function dashboard() {
  return {
    connected: false,
    lastUpdated: '',
    ws: null,
    trendChart: null,

    // Data stores
    kpis: { current: {}, previous: {}, changes: {} },
    campaigns: [],
    leads: [],
    leadCounts: {},
    alerts: [],
    memory: { openLoops: [], currentFocus: [] },

    get totalLeads() {
      return this.leads.length;
    },

    async init() {
      await this.fetchAll();
      this.connectWs();
      // Refresh every 60s as fallback
      setInterval(() => this.fetchAll(), 60000);
    },

    async fetchAll() {
      await Promise.all([
        this.fetchKpis(),
        this.fetchCampaigns(),
        this.fetchLeads(),
        this.fetchAlerts(),
        this.fetchMemory(),
        this.fetchTrends(),
      ]);
      this.lastUpdated = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    },

    async fetchKpis() {
      try {
        const res = await fetch('/api/kpis');
        this.kpis = await res.json();
      } catch (e) { console.error('KPI fetch failed:', e); }
    },

    async fetchCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        this.campaigns = await res.json();
      } catch (e) { console.error('Campaign fetch failed:', e); }
    },

    async fetchLeads() {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        this.leads = data.leads ?? [];
        this.leadCounts = data.counts ?? {};
      } catch (e) { console.error('Lead fetch failed:', e); }
    },

    async fetchAlerts() {
      try {
        const res = await fetch('/api/alerts');
        this.alerts = await res.json();
      } catch (e) { console.error('Alert fetch failed:', e); }
    },

    async fetchMemory() {
      try {
        const res = await fetch('/api/memory');
        this.memory = await res.json();
      } catch (e) { console.error('Memory fetch failed:', e); }
    },

    async fetchTrends() {
      try {
        const res = await fetch('/api/kpis/trends?days=7');
        const data = await res.json();
        this.renderTrendChart(data);
      } catch (e) { console.error('Trend fetch failed:', e); }
    },

    renderTrendChart(data) {
      const ctx = document.getElementById('trendChart');
      if (!ctx) return;

      if (this.trendChart) {
        this.trendChart.destroy();
      }

      const labels = data.map(d => {
        const date = new Date(d.date + 'T00:00:00');
        return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' });
      });

      this.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Spend ($)',
              data: data.map(d => d.spend),
              backgroundColor: 'rgba(201, 168, 76, 0.6)',
              borderColor: '#c9a84c',
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y',
              order: 2,
            },
            {
              label: 'CPL ($)',
              data: data.map(d => d.cpl),
              borderColor: '#ef4444',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#ef4444',
              type: 'line',
              yAxisID: 'y1',
              order: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { color: '#888', boxWidth: 12, padding: 16, font: { size: 11 } },
            },
          },
          scales: {
            x: {
              grid: { color: '#1a1a1a' },
              ticks: { color: '#888', font: { size: 11 } },
            },
            y: {
              position: 'left',
              grid: { color: '#1a1a1a' },
              ticks: { color: '#c9a84c', font: { size: 11 }, callback: v => '$' + v },
            },
            y1: {
              position: 'right',
              grid: { display: false },
              ticks: { color: '#ef4444', font: { size: 11 }, callback: v => '$' + v },
            },
          },
        },
      });
    },

    connectWs() {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      this.ws = new WebSocket(`${proto}//${location.host}/ws`);

      this.ws.onopen = () => { this.connected = true; };
      this.ws.onclose = () => {
        this.connected = false;
        setTimeout(() => this.connectWs(), 3000);
      };
      this.ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'refresh') this.fetchAll();
        if (msg.type === 'new_leads') this.fetchLeads();
        if (msg.type === 'alert') this.fetchAlerts();
      };
    },

    async dismissAlert(id) {
      await fetch(`/api/alerts/${id}`, { method: 'PATCH' });
      this.alerts = this.alerts.filter(a => a.id !== id);
    },

    leadsByStatus(status) {
      return this.leads.filter(l => l.status === status);
    },

    isStale(lead) {
      if (!lead.created_at) return false;
      const age = Date.now() - new Date(lead.created_at).getTime();
      return age > 24 * 60 * 60 * 1000 && lead.status === 'new';
    },

    // Formatters
    fmt(n) {
      if (n == null) return '—';
      return parseFloat(n).toFixed(2);
    },

    fmtNum(n) {
      if (n == null) return '—';
      return parseInt(n).toLocaleString('en-AU');
    },

    fmtChange(pct) {
      if (pct == null) return '';
      const sign = pct >= 0 ? '+' : '';
      return sign + pct.toFixed(1) + '%';
    },

    changeClass(pct, invertGood = false) {
      if (pct == null) return 'neutral';
      if (invertGood) return pct <= 0 ? 'up' : 'down'; // Lower spend/CPL = good
      return pct >= 0 ? 'up' : 'down';
    },

    cplColor(cpl) {
      if (!cpl) return '';
      if (cpl <= 20) return 'color: var(--green)';
      if (cpl <= 30) return 'color: var(--yellow)';
      return 'color: var(--red)';
    },

    timeAgo(dateStr) {
      if (!dateStr) return '';
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return mins + 'm ago';
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return hrs + 'h ago';
      const days = Math.floor(hrs / 24);
      return days + 'd ago';
    },
  };
}
