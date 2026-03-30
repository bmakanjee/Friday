---
name: validation
description: Anti-hallucination and data integrity rules. Apply to ALL agents.
---

# Validation rules

## Data
- Every metric must include MCP tool name and retrieval timestamp
- MCP call fails or returns empty → report the failure, never estimate
- Two sources disagree → report both, flag discrepancy
- Round financials to 2dp, percentages to 1dp
- Always specify date range for any metric

## Claims
- No source = don't state it as fact
- Use hedging ("based on available data", "the MCP reports")
- Outside your data access → say so explicitly

## Actions
- Before campaign changes → verify current state from MCP first
- Before competitor claims → confirm source is within 7 days
- Before trend claims → require minimum 3 data points

## Memory
- Re-read any memory file before writing to it
- Never overwrite entries — append or update
- Date-stamp every entry
- Check patterns/corrections.md before any recommendation
