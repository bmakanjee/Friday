---
node_type: knowledge
status: active
tier: deep
created: 2026-03-29
updated: 2026-03-29
source: Jobber GraphQL API introspection
---

# Jobber GraphQL API — Complete Capability Map

**Endpoint:** `https://api.getjobber.com/api/graphql`
**Version header:** `X-JOBBER-GRAPHQL-VERSION: 2026-03-10`
**Auth:** `Authorization: Bearer <access_token>`
**Rate limit:** 10,000 cost per 5 minutes
**Pagination:** Relay-style (first/after/last/before). Most lists return max 100 items.

**Our scopes:** read_clients, write_clients, read_requests, write_requests, read_quotes, write_quotes, read_jobs, write_jobs, read_scheduled_items, write_scheduled_items, read_invoices, write_invoices, read_jobber_payments, read_users, write_users, write_tax_rates, read_expenses, write_expenses, read_custom_field_configurations, write_custom_field_configurations, read_time_sheets, read_equipment, write_equipment

---

## Table of Contents

1. [Client Management](#1-client-management)
2. [Property Management](#2-property-management)
3. [Request Management](#3-request-management)
4. [Quote Management](#4-quote-management)
5. [Job Management](#5-job-management)
6. [Visit Management](#6-visit-management)
7. [Invoice Management](#7-invoice-management)
8. [Payment Tracking](#8-payment-tracking)
9. [Expense Management](#9-expense-management)
10. [Task Management](#10-task-management)
11. [Event Management](#11-event-management)
12. [Team/User Management](#12-teamuser-management)
13. [Schedule & Calendar](#13-schedule--calendar)
14. [Products & Services](#14-products--services)
15. [Custom Fields](#15-custom-fields)
16. [Tax Rates](#16-tax-rates)
17. [Timesheets](#17-timesheets)
18. [Vehicles/Equipment](#18-vehiclesequipment)
19. [Webhooks](#19-webhooks)
20. [Account & Misc](#20-account--misc)
21. [Enums Reference](#21-enums-reference)
22. [Job Lifecycle: End-to-End](#22-job-lifecycle-end-to-end)

---

## 1. Client Management

### Query: Get single client
```graphql
query {
  client(id: "<encoded_id>") {
    id name firstName lastName companyName isCompany
    email phone balance isLead isArchived
    emails { address description primary }
    phones { number description primary smsAllowed }
    billingAddress { street1 street2 city province postalCode country }
    tags { edges { node { label } } }
    clientProperties(first: 10) { nodes { id name address { street1 city } } }
    customFields { ... on CustomFieldText { label value } }
    createdAt updatedAt
  }
}
```

### Query: List/search clients
```graphql
query {
  clients(
    first: 50
    searchTerm: "John"
    filter: {
      isArchived: false
      isLead: false
      tags: ["VIP"]
      createdAt: { after: "2026-01-01T00:00:00Z" }
    }
    sort: { key: NAME, direction: ASC }
  ) {
    nodes { id name email phone balance }
    totalCount
    pageInfo { hasNextPage endCursor }
  }
}
```
**Filter fields:** isCompany, isLead, isArchived, updatedAt, createdAt, tags
**Search fields:** searchFields param accepts [ClientSearchField!]

### Query: Find similar clients (dedup)
```graphql
query {
  similarClients(name: "John Smith", emails: ["john@example.com"]) {
    nodes { id name email phone }
  }
}
```
Max 10 results.

### Query: Client emails/phones search
```graphql
query { clientEmails(searchTerm: "john@", first: 10) { nodes { address } } }
query { clientPhones(searchTerm: "0412", first: 10) { nodes { number } } }
```

### Query: Client metadata
```graphql
query { clientMeta(id: "<id>") { ... } }
```

### Mutation: Create client
```graphql
mutation {
  clientCreate(input: {
    firstName: "John"
    lastName: "Smith"
    companyName: "Smith Corp"
    isCompany: false
    title: MR
    phones: [{ number: "0412345678", description: MOBILE, primary: true, smsAllowed: true }]
    emails: [{ address: "john@example.com", description: MAIN, primary: true }]
    properties: [{
      address: { street1: "123 Main St", city: "Brisbane", province: "QLD", postalCode: "4000", country: "AU" }
    }]
    billingAddress: { street1: "123 Main St", city: "Brisbane", province: "QLD", postalCode: "4000" }
    sourceAttribution: { sourceText: "Facebook Ad" }
  }) {
    client { id name }
    userErrors { message path }
  }
}
```
**Optional fields:** receivesReminders, receivesFollowUps, receivesQuoteFollowUps, receivesInvoiceFollowUps, receivesReviewRequests, contacts, customFields

### Mutation: Create multiple clients
```graphql
mutation {
  clientsCreate(input: [
    { firstName: "Jane", lastName: "Doe", phones: [{ number: "0400000001" }] }
    { firstName: "Bob", lastName: "Builder", phones: [{ number: "0400000002" }] }
  ]) {
    clients { id name }
    userErrors { message path }
  }
}
```

### Mutation: Edit client
```graphql
mutation {
  clientEdit(clientId: "<id>", input: {
    firstName: "Jonathan"
    phonesToAdd: [{ number: "0499999999", description: WORK }]
    phonesToEdit: [{ id: "<phone_id>", number: "0412345679" }]
    phonesToDelete: ["<phone_id>"]
    emailsToAdd: [{ address: "new@email.com" }]
    tagsToAdd: ["VIP", "Paint Protection"]
    tagsToDelete: ["Lead"]
    billingAddress: { street1: "456 New St", city: "Brisbane" }
  }) {
    client { id name }
    userErrors { message path }
  }
}
```
**Also supports:** contactsToAdd/Edit/Delete, propertiesToAdd/Edit/Delete, customFields

### Mutation: Archive/unarchive client
```graphql
mutation { clientArchive(clientId: "<id>") { client { id } userErrors { message } } }
mutation { clientUnarchive(clientId: "<id>") { client { id } userErrors { message } } }
```

### Mutation: Client notes
```graphql
mutation { clientCreateNote(clientId: "<id>", input: { message: "Called re quote" }) { ... } }
mutation { clientEditNote(input: { noteId: "<id>", message: "Updated note" }) { ... } }
mutation { clientDeleteNote(input: { noteId: "<id>" }) { ... } }
mutation { clientNoteAddAttachment(noteId: "<id>", clientId: "<id>", noteAddAttachmentAttributes: [{ url: "https://..." }]) { ... } }
```

---

## 2. Property Management

### Query: Get/list properties
```graphql
query { property(id: "<id>") { id name address { street1 city province postalCode } client { id name } taxRate { id name } } }
query { properties(first: 50, searchTerm: "Brisbane", filter: { ... }) { nodes { id name address { street1 city } } } }
```

### Mutation: Create property
```graphql
mutation {
  propertyCreate(clientId: "<client_id>", input: {
    address: { street1: "789 Oak Ave", city: "Brisbane", province: "QLD", postalCode: "4000", country: "AU" }
    name: "Home"
    taxRateId: "<tax_rate_id>"
  }) {
    property { id name address { street1 } }
    userErrors { message }
  }
}
```

### Mutation: Edit property
```graphql
mutation {
  propertyEdit(propertyId: "<id>", input: {
    address: { street1: "Updated Address" }
    name: "Office"
  }) {
    property { id }
    userErrors { message }
  }
}
```

---

## 3. Request Management

Requests are inbound work requests (leads) that can be converted to quotes or jobs.

### Query: Get/list requests
```graphql
query {
  request(id: "<id>") {
    id title requestStatus source
    client { id name } property { id address { street1 } }
    lineItems { nodes { id name quantity unitPrice } }
    assessment { id startAt endAt isComplete }
    createdAt updatedAt
  }
}
query {
  requests(
    first: 50
    filter: { status: new, clientId: "<id>" }
    sort: [{ key: CREATED_AT, direction: DESC }]
    searchTerm: "detailing"
  ) {
    nodes { id title requestStatus client { name } createdAt }
    totalCount
  }
}
```
**Filter fields:** clientId, propertyId, status, updatedAt, createdAt, assignedTo
**Status values:** new, completed, converted, archived, upcoming, overdue, unscheduled, assessment_completed, today

### Mutation: Create request
```graphql
mutation {
  requestCreate(input: {
    clientId: "<client_id>"
    propertyId: "<property_id>"
    title: "Paint correction inquiry"
    lineItems: [{ name: "Paint Correction", quantity: 1, unitPrice: 500.00, description: "Full vehicle" }]
    salespersonId: "<user_id>"
  }) {
    request { id title requestStatus }
    userErrors { message }
  }
}
```

### Mutation: Edit request
```graphql
mutation {
  requestEdit(requestId: "<id>", input: {
    title: "Updated title"
    propertyId: "<property_id>"
    salespersonId: "<user_id>"
  }) {
    request { id }
    userErrors { message }
  }
}
```

### Mutation: Request line items
```graphql
mutation { requestCreateLineItems(requestId: "<id>", lineItems: [{ name: "Ceramic Coating", quantity: 1, unitPrice: 800 }]) { ... } }
mutation { requestEditLineItems(requestId: "<id>", lineItems: [{ lineItemId: "<id>", name: "Updated", unitPrice: 900 }]) { ... } }
mutation { requestDeleteLineItems(requestId: "<id>", lineItemIds: ["<id>"]) { ... } }
```

### Mutation: Request notes
```graphql
mutation { requestCreateNote(requestId: "<id>", input: { message: "Client called back" }) { ... } }
mutation { requestEditNote(input: { noteId: "<id>", message: "Updated" }) { ... } }
```

### Mutation: Archive/unarchive request
```graphql
mutation { requestArchive(requestId: "<id>") { request { id } userErrors { message } } }
mutation { requestUnarchive(requestId: "<id>") { request { id } userErrors { message } } }
```

### Mutation: Assessment (site visit for a request)
```graphql
mutation {
  assessmentCreate(requestId: "<id>", input: {
    startAt: "2026-04-01T09:00:00+10:00"
    endAt: "2026-04-01T10:00:00+10:00"
    assignedUserIds: ["<user_id>"]
  }) {
    assessment { id }
    userErrors { message }
  }
}
mutation { assessmentComplete(assessmentId: "<id>") { assessment { id } } }
mutation { assessmentUncomplete(assessmentId: "<id>") { ... } }
mutation { assessmentEdit(assessmentId: "<id>", input: { ... }) { ... } }
mutation { assessmentDelete(assessmentId: "<id>") { ... } }
```

---

## 4. Quote Management

### Query: Get/list quotes
```graphql
query {
  quote(id: "<id>") {
    id quoteNumber title quoteStatus
    client { id name } property { id address { street1 } }
    amounts { subtotal discountAmount depositAmount taxAmount total }
    lineItems(first: 50) { nodes { id name quantity unitPrice totalPrice taxable optional } }
    sentAt createdAt updatedAt
    salesperson { id name { full } }
    message contractDisclaimer
  }
}
query {
  quotes(
    first: 50
    filter: { status: awaiting_response, clientId: "<id>" }
    sort: [{ key: CREATED_AT, direction: DESC }]
  ) {
    nodes { id quoteNumber title quoteStatus amounts { total } client { name } }
    totalCount
  }
}
```
**Filter fields:** clientId, quoteNumber (range), status, cost (range), sentAt, updatedAt, createdAt, salespersonId
**Status values:** draft, awaiting_response, archived, approved, converted, changes_requested

### Mutation: Create quote
```graphql
mutation {
  quoteCreate(attributes: {
    clientId: "<client_id>"
    propertyId: "<property_id>"
    title: "Paint Correction + Ceramic Coating"
    message: "Thanks for your interest. Here's your quote."
    lineItems: [
      { name: "Paint Correction", unitPrice: 500, quantity: 1, taxable: true, saveToProductsAndServices: false }
      { name: "Ceramic Coating", unitPrice: 800, quantity: 1, taxable: true, saveToProductsAndServices: false }
    ]
    deposit: { rate: 20, type: Percent }
    discount: { rate: 5, type: Percent }
    taxRateId: "<tax_rate_id>"
    transitionQuoteTo: AWAITING_RESPONSE
  }) {
    quote { id quoteNumber quoteStatus amounts { total } }
    userErrors { message path }
  }
}
```
**transitionQuoteTo:** Set to `AWAITING_RESPONSE` to mark as sent on creation. Omit for draft.

### Mutation: Edit quote
```graphql
mutation {
  quoteEdit(quoteId: "<id>", attributes: {
    title: "Updated Quote"
    message: "Revised pricing"
    discount: { rate: 10, type: Percent }
  }) {
    quote { id }
    userErrors { message }
  }
}
```

### Mutation: Quote line items
```graphql
mutation { quoteCreateLineItems(quoteId: "<id>", lineItems: [{ name: "Add-on Service", unitPrice: 200, quantity: 1, taxable: true, saveToProductsAndServices: false }]) { ... } }
mutation { quoteEditLineItems(quoteId: "<id>", lineItems: [{ lineItemId: "<id>", name: "Updated", unitPrice: 250 }]) { ... } }
mutation { quoteDeleteLineItems(quoteId: "<id>", lineItemIds: ["<id>"]) { ... } }
mutation { quoteCreateTextLineItems(quoteId: "<id>", lineItems: [{ name: "Section header text" }]) { ... } }
```

### Mutation: Quote notes
```graphql
mutation { quoteCreateNote(quoteId: "<id>", input: { message: "Client prefers weekend" }) { ... } }
mutation { quoteEditNote(input: { noteId: "<id>", message: "Updated" }) { ... } }
```

---

## 5. Job Management

### Query: Get/list jobs
```graphql
query {
  job(id: "<id>") {
    id jobNumber title jobStatus jobType billingType
    client { id name } property { id address { street1 } }
    total invoicedTotal uninvoicedTotal
    lineItems(first: 50) { nodes { id name quantity unitPrice totalPrice } }
    visits(first: 50) { nodes { id title startAt endAt isComplete visitStatus assignedUsers { nodes { id name { full } } } } }
    invoices(first: 10) { nodes { id invoiceNumber invoiceStatus amounts { total } } }
    instructions startAt endAt completedAt
    salesperson { id name { full } }
    quote { id quoteNumber }
    request { id title }
    createdAt updatedAt
  }
}
query {
  jobs(
    first: 50
    filter: { status: active, jobType: ONE_OFF }
    sort: [{ key: CREATED_AT, direction: DESC }]
    searchTerm: "detailing"
  ) {
    nodes { id jobNumber title jobStatus total client { name } }
    totalCount
  }
}
```
**Filter fields:** jobType (ONE_OFF/RECURRING), status, createdAt, startAt, endAt, completedAt, visitsScheduledBetween, includeUnscheduled, onlyInvoiceable, ids
**Status values:** requires_invoicing, archived, late, today, upcoming, action_required, on_hold, unscheduled, active, expiring_within_30_days

### Mutation: Create job
```graphql
mutation {
  jobCreate(input: {
    propertyId: "<property_id>"
    title: "Full Detail"
    instructions: "Park in driveway. Dog is friendly."
    quoteId: "<quote_id>"
    requestId: "<request_id>"
    lineItems: [
      { name: "Full Detail", unitPrice: 250, quantity: 1, taxable: true, saveToProductsAndServices: false }
    ]
    invoicing: {
      invoicingType: FIXED_PRICE
      invoicingSchedule: ON_COMPLETION
    }
    scheduling: {
      createVisits: true
      notifyTeam: true
      assignedTo: ["<user_id>"]
      startTime: "09:00:00"
      endTime: "12:00:00"
    }
    timeframe: {
      startAt: "2026-04-01"
      durationUnits: DAYS
      durationValue: 1
    }
    arrivalWindow: { durationInMinutes: 30 }
  }) {
    job { id jobNumber title jobStatus visits(first: 1) { nodes { id startAt } } }
    userErrors { message path }
  }
}
```
**Required:** propertyId, invoicing (invoicingType + invoicingSchedule)
**invoicingType:** FIXED_PRICE, VISIT_BASED
**invoicingSchedule:** ON_COMPLETION, PERIODIC, PER_VISIT, NEVER

### Mutation: Edit job
```graphql
mutation {
  jobEdit(jobId: "<id>", input: {
    title: "Updated Title"
    instructions: "New instructions"
    scheduling: { createVisits: false, notifyTeam: false, assignedTo: ["<user_id>"] }
  }) {
    job { id }
    userErrors { message }
  }
}
```

### Mutation: Close/reopen job
```graphql
mutation {
  jobClose(jobId: "<id>", input: {
    modifyIncompleteVisitsBy: COMPLETE_PAST_DESTROY_FUTURE
  }) {
    job { id jobStatus }
    userErrors { message }
  }
}
```
**modifyIncompleteVisitsBy:** DESTROY_ALL or COMPLETE_PAST_DESTROY_FUTURE

```graphql
mutation { jobReopen(jobId: "<id>") { job { id jobStatus } userErrors { message } } }
```

### Mutation: Job line items
```graphql
mutation { jobCreateLineItems(jobId: "<id>", input: { lineItems: [{ name: "Extra", unitPrice: 50, quantity: 1, saveToProductsAndServices: false }] }) { ... } }
mutation { jobEditLineItems(jobId: "<id>", input: { lineItems: [{ lineItemId: "<id>", name: "Updated", unitPrice: 60 }] }) { ... } }
mutation { jobDeleteLineItems(jobId: "<id>", input: { lineItemIds: ["<id>"] }) { ... } }
mutation { jobOrderLineItems(jobId: "<id>", orderedLineItemIds: ["<id1>", "<id2>"]) { ... } }
```

### Mutation: Job notes
```graphql
mutation { jobCreateNote(jobId: "<id>", input: { message: "Work complete" }) { ... } }
mutation { jobEditNote(input: { noteId: "<id>", message: "Updated" }) { ... } }
mutation { jobDeleteNote(input: { noteId: "<id>" }) { ... } }
mutation { jobNoteAddAttachment(noteId: "<id>", jobId: "<id>", noteAddAttachmentAttributes: [{ url: "https://..." }]) { ... } }
```

---

## 6. Visit Management

Visits are the actual scheduled appointments within a job.

### Query: Get/list visits
```graphql
query {
  visit(id: "<id>") {
    id title visitStatus isComplete
    startAt endAt completedAt allDay
    client { id name } property { id address { street1 } }
    job { id jobNumber title }
    assignedUsers { nodes { id name { full } } }
    lineItems(first: 50) { nodes { id name quantity unitPrice } }
    instructions
    invoice { id invoiceNumber }
  }
}
query {
  visits(
    first: 50
    filter: {
      status: ACTIVE
      startAt: { after: "2026-04-01T00:00:00Z", before: "2026-04-07T23:59:59Z" }
      assignedTo: "<user_id>"
    }
    sort: [{ key: START_AT, direction: ASC }]
  ) {
    nodes { id title visitStatus startAt endAt client { name } job { jobNumber } assignedUsers { nodes { name { full } } } }
    totalCount
  }
}
```
**Filter fields:** status, createdAt, startAt, endAt, completedAt, invoiceStatus, onlyRelevantToBillingPeriod, assignedTo, productOrServiceId, ids
**Status values:** ACTIVE, COMPLETED, LATE, TODAY, UNSCHEDULED, UPCOMING

### Mutation: Create visit (add to job)
```graphql
mutation {
  visitCreate(jobId: "<job_id>", input: {
    visits: [{
      title: "Follow-up visit"
      instructions: "Check coating cure"
      schedule: {
        startAt: { date: "2026-04-05", time: "09:00:00", timezone: "Australia/Brisbane" }
        endAt: { date: "2026-04-05", time: "12:00:00", timezone: "Australia/Brisbane" }
        teamMemberIdsToAssign: ["<user_id>"]
        notifyTeam: true
      }
    }]
  }) {
    job { id }
    createdVisits { id startAt }
    userErrors { message }
  }
}
```

### Mutation: Edit visit
```graphql
mutation {
  visitEdit(id: "<visit_id>", attributes: {
    title: "Updated visit title"
    instructions: "Bring ceramic coating kit"
  }) {
    visit { id title }
    userErrors { message }
  }
}
```

### Mutation: Edit visit schedule
```graphql
mutation {
  visitEditSchedule(id: "<visit_id>", input: {
    startAt: { date: "2026-04-06", time: "10:00:00", timezone: "Australia/Brisbane" }
    endAt: { date: "2026-04-06", time: "13:00:00", timezone: "Australia/Brisbane" }
  }) {
    visit { id startAt endAt }
    userErrors { message }
  }
}
```

### Mutation: Edit visit assigned users
```graphql
mutation {
  visitEditAssignedUsers(visitId: "<visit_id>", input: {
    assignedUserIds: ["<user_id_1>", "<user_id_2>"]
  }) {
    visit { id assignedUsers { nodes { name { full } } } }
    userErrors { message }
  }
}
```

### Mutation: Complete/uncomplete visit
```graphql
mutation {
  visitComplete(visitId: "<visit_id>", input: {
    completedAt: "2026-04-05T15:00:00+10:00"
  }) {
    visit { id isComplete completedAt }
    userErrors { message }
  }
}
mutation { visitUncomplete(visitId: "<id>") { visit { id isComplete } userErrors { message } } }
```

### Mutation: Visit line items
```graphql
mutation { visitCreateLineItems(visitId: "<id>", input: { lineItems: [{ name: "Extra polish", unitPrice: 50, quantity: 1 }] }) { ... } }
mutation { visitEditLineItems(visitId: "<id>", input: { lineItems: [{ lineItemId: "<id>", name: "Updated" }] }) { ... } }
mutation { visitDeleteLineItems(visitId: "<id>", input: { lineItemIds: ["<id>"] }) { ... } }
```

### Mutation: Delete visit
```graphql
mutation { visitDelete(visitIds: ["<id>"]) { userErrors { message } } }
```

### Mutation: Update future visits (recurring)
```graphql
mutation { updateFutureVisits(input: { ... }) { ... } }
```

### Mutation: On My Way tracking link
```graphql
mutation {
  onMyWayTrackingLinkCreate(visitId: "<id>", input: { ... }) {
    trackingLink { url }
    userErrors { message }
  }
}
```

---

## 7. Invoice Management

### Query: Get/list invoices
```graphql
query {
  invoice(id: "<id>") {
    id invoiceNumber invoiceStatus subject
    client { id name }
    amounts { subtotal discountAmount taxAmount total depositAmount invoiceBalance outstanding paymentsTotal }
    lineItems(first: 50) { nodes { id name quantity unitPrice totalPrice } }
    jobs { nodes { id jobNumber } }
    visits { nodes { id title } }
    dueDate issuedDate receivedDate
    message contractDisclaimer
    paymentRecords(first: 10) { nodes { ... on PaymentRecord { id amount paymentType } } }
    salesperson { id name { full } }
    taxRate { id name rate }
    createdAt updatedAt
  }
}
query {
  invoices(
    first: 50
    filter: { status: awaiting_payment, clientId: "<id>" }
    sort: [{ key: CREATED_AT, direction: DESC }]
  ) {
    nodes { id invoiceNumber invoiceStatus amounts { total outstanding } client { name } dueDate }
    totalCount
  }
}
```
**Filter fields:** clientId, invoiceNumber, total (range), issuedDate, dueDate, updatedAt, createdAt, status, excludeOrigin
**Status values:** draft, awaiting_payment, paid, past_due, bad_debt, sent_not_due

### Mutation: Create invoice
```graphql
mutation {
  invoiceCreate(input: {
    clientId: "<client_id>"
    jobId: "<job_id>"
    propertyId: "<property_id>"
    subject: "Detail Service - April 2026"
    message: "Thank you for choosing Monarch Detailing."
    lineItems: [
      { name: "Full Detail", quantity: 1, cost: 100, taxable: true }
    ]
    tax: { taxCalculationMethod: EXCLUSIVE, taxRateId: "<tax_rate_id>" }
    dueDetails: { dueDate: "2026-04-15T00:00:00Z" }
    issuedDate: "2026-04-01T00:00:00Z"
    markSent: true
    allowClientHubCreditCardPayments: true
    allowClientHubAchPayments: true
    salespersonId: "<user_id>"
  }) {
    invoice { id invoiceNumber invoiceStatus amounts { total } }
    userErrors { message path }
  }
}
```
**Required:** clientId, lineItems, tax (taxCalculationMethod), dueDetails
**Key options:** markSent (skip draft), jobId (link to job), visitIds (link to visits), discount, depositIds

### Mutation: Edit invoice
```graphql
mutation {
  invoiceEdit(invoiceId: "<id>", input: {
    subject: "Updated Subject"
    message: "Updated message"
    dueDetails: { dueDate: "2026-04-30T00:00:00Z" }
    discount: { discountRate: 10, discountType: Percent }
  }) {
    invoice { id }
    userErrors { message }
  }
}
```

### Mutation: Mark invoice as sent
```graphql
mutation { invoiceMarkAsSent(id: "<id>") { invoice { id invoiceStatus } userErrors { message } } }
```

### Mutation: Close invoice (mark paid or bad debt)
```graphql
mutation {
  invoiceClose(id: "<id>", input: {
    closeOption: MARK_RECEIVED
  }) {
    invoice { id invoiceStatus }
    userErrors { message }
  }
}
```
**closeOption:** MARK_RECEIVED (mark as paid), BAD_DEBT (write off)

### Mutation: Reopen paid invoice
```graphql
mutation { invoiceReopen(id: "<id>") { invoice { id invoiceStatus } userErrors { message } } }
```

### Mutation: Unmark bad debt
```graphql
mutation { invoiceUnmarkBadDebt(id: "<id>") { invoice { id invoiceStatus } userErrors { message } } }
```

### Mutation: Invoice notes
```graphql
mutation { invoiceCreateNote(invoiceId: "<id>", input: { message: "Payment received via bank transfer" }) { ... } }
mutation { invoiceEditNote(input: { noteId: "<id>", message: "Updated" }) { ... } }
```

---

## 8. Payment Tracking

**Note:** We have `read_jobber_payments` scope. We can READ payments but NOT create them via API (payments are created through Jobber Payments or manual entry in the UI).

### Query: Get/list payment records
```graphql
query {
  paymentRecord(id: "<id>") {
    ... on PaymentRecord {
      id amount paymentType details adjustment
      invoice { id invoiceNumber }
      createdAt
    }
  }
}
query {
  paymentRecords(
    first: 50
    filter: { ... }
    sort: { key: CREATED_AT, direction: DESC }
  ) {
    nodes {
      ... on PaymentRecord { id amount paymentType createdAt invoice { invoiceNumber } }
    }
  }
}
```

### Query: Payment methods
```graphql
query { paymentMethods(first: 50) { nodes { ... } } }
```

### Query: Payout records
```graphql
query { payoutRecord(id: "<id>") { ... } }
query { payoutRecords(first: 50, filter: { ... }) { nodes { ... } } }
```

### Query: Refund reasons
```graphql
query { paymentRefundReasons }
```

---

## 9. Expense Management

### Query: Get/list expenses
```graphql
query {
  expense(id: "<id>") {
    id title description date total
    enteredBy { name { full } }
    reimbursableTo { name { full } }
    linkedJob { id jobNumber }
    createdAt updatedAt
  }
}
query {
  expenses(
    first: 50
    filter: { ... }
    sort: [{ key: DATE, direction: DESC }]
  ) {
    nodes { id title total date linkedJob { jobNumber } }
  }
}
```

### Mutation: Create expense
```graphql
mutation {
  expenseCreate(input: {
    title: "Ceramic coating supplies"
    description: "5L bottle"
    date: "2026-04-01T00:00:00Z"
    total: 89.95
    linkedJobId: "<job_id>"
    reimbursableToId: "<user_id>"
  }) {
    expense { id title total }
    userErrors { message }
  }
}
```

### Mutation: Edit/delete expense
```graphql
mutation { expenseEdit(expenseId: "<id>", input: { title: "Updated", total: 95.00 }) { expense { id } userErrors { message } } }
mutation { expenseDelete(expenseId: "<id>") { userErrors { message } } }
```

---

## 10. Task Management

Tasks are standalone to-do items (not attached to jobs like visits).

### Query: Get/list tasks
```graphql
query {
  task(id: "<id>") {
    id title instructions isComplete startAt endAt allDay
    assignedUsers { nodes { id name { full } } }
    client { id name } property { id }
    isRecurring recurrenceSchedule { rule }
  }
}
query {
  tasks(
    first: 50
    filter: { ... }
    sort: [{ key: START_AT, direction: ASC }]
  ) {
    nodes { id title isComplete startAt assignedUsers { nodes { name { full } } } }
  }
}
```

### Mutation: Create task
```graphql
mutation {
  taskCreate(clientId: "<client_id>", propertyId: "<property_id>", input: {
    title: "Follow up with client"
    instructions: "Call about paint protection"
    startAt: "2026-04-02T09:00:00+10:00"
    endAt: "2026-04-02T09:30:00+10:00"
    assignedTo: ["<user_id>"]
    emailAssignments: true
  }) {
    task { id title startAt }
    userErrors { message }
  }
}
```

### Mutation: Edit/delete task
```graphql
mutation { taskEdit(taskId: "<id>", input: { title: "Updated task", assignedTo: ["<user_id>"] }) { task { id } userErrors { message } } }
mutation { taskDelete(taskIds: ["<id>"], deleteFutureRecurring: false) { userErrors { message } } }
```

---

## 11. Event Management

Events are calendar events (e.g., meetings, personal time).

### Query: Get event
```graphql
query { event(id: "<id>") { id title description startAt endAt allDay isRecurring assignedUsers { nodes { name { full } } } } }
```

### Mutation: Create event
```graphql
mutation {
  eventCreate(input: {
    title: "Team Meeting"
    description: "Weekly sync"
    startAt: "2026-04-01T08:00:00+10:00"
    endAt: "2026-04-01T09:00:00+10:00"
    allDay: false
  }) {
    event { id title }
    userErrors { message }
  }
}
```

---

## 12. Team/User Management

### Query: Get/list users
```graphql
query {
  user(id: "<id>") {
    id name { full first last }
    email { raw }
    phone { raw }
    status
    isAccountAdmin isAccountOwner isCurrentUser
    availableForScheduling
    assignedColor
    timezone
    createdAt lastLoginAt
  }
}
query { user { id name { full } email { raw } } }  # Current user (no id = self)

query {
  users(
    first: 100
    filter: { ... }
    sort: [{ key: NAME, direction: ASC }]
  ) {
    nodes { id name { full } email { raw } status availableForScheduling }
  }
}
```

### Mutation: Edit user
```graphql
mutation {
  userEdit(userId: "<id>", input: {
    name: "Updated Name"
  }) {
    user { id name { full } }
    userErrors { message }
  }
}
```
**Note:** Limited to name changes via API. User creation/deletion is not available via API.

---

## 13. Schedule & Calendar

### Query: Scheduled items (unified calendar view)
```graphql
query {
  scheduledItems(
    filter: {
      occursWithin: { startDate: "2026-04-01", endDate: "2026-04-07" }
      assignedTo: ["<user_id>"]
      includeUnassigned: true
      includeUnscheduled: false
      scheduleItemType: VISIT
      status: ACTIVE
    }
    sort: { key: START_AT, direction: ASC }
  ) {
    nodes {
      ... on Visit { id title startAt endAt visitStatus client { name } job { jobNumber } }
      ... on Task { id title startAt endAt isComplete }
      ... on Event { id title startAt endAt }
      ... on Assessment { id startAt endAt }
    }
    totalCount
  }
}
```
**scheduleItemType:** BASIC_TASK, VISIT, EVENT, ASSESSMENT, QUOTE_REMINDER, INVOICE_REMINDER
**status:** ACTIVE, COMPLETED, OVERDUE, REMAINING

### Mutation: Generic appointment scheduling (works for visits, tasks, assessments, events)
```graphql
# Reschedule any appointment
mutation {
  appointmentEditSchedule(appointmentId: "<id>", input: {
    schedule: {
      startAt: "10:00:00"
      endAt: "13:00:00"
      timezone: "Australia/Brisbane"
    }
  }) {
    appointment { ... on Visit { id startAt endAt } }
    userErrors { message }
  }
}

# Unschedule
mutation {
  appointmentEditSchedule(appointmentId: "<id>", input: {
    unschedule: true
  }) { ... }
}

# Make all-day
mutation {
  appointmentEditSchedule(appointmentId: "<id>", input: {
    scheduleAllDay: { startDate: "2026-04-01", timezone: "Australia/Brisbane" }
  }) { ... }
}
```

### Mutation: Generic appointment assignment
```graphql
mutation {
  appointmentEditAssignment(appointmentId: "<id>", input: {
    assignedUserIds: ["<user_id_1>", "<user_id_2>"]
  }) {
    appointment { ... on Visit { id assignedUsers { nodes { name { full } } } } }
    userErrors { message }
  }
}
```

### Mutation: Generic appointment complete/incomplete
```graphql
mutation {
  appointmentEditCompleteness(appointmentId: "<id>", input: {
    completed: true
  }) {
    appointment { ... on Visit { id isComplete } }
    userErrors { message }
  }
}
```

---

## 14. Products & Services

### Query: Get/list products/services
```graphql
query {
  product(id: "<id>") {
    id name description category
    defaultUnitCost internalUnitCost markup
    taxable visible
    durationMinutes
    onlineBookingsEnabled
  }
}
query {
  products(first: 50, searchTerm: "detail", filter: { ... }) {
    nodes { id name category defaultUnitCost taxable visible }
  }
}
```

### Mutation: Create product/service
```graphql
mutation {
  productsAndServicesCreate(input: {
    name: "Full Detail"
    description: "Complete interior and exterior detail"
    category: SERVICE
    defaultUnitCost: 250.00
    taxable: true
    visible: true
  }) {
    productOrService { id name }
    userErrors { message }
  }
}
```

### Mutation: Edit product/service
```graphql
mutation {
  productsAndServicesEdit(productOrServiceId: "<id>", input: {
    name: "Premium Full Detail"
    defaultUnitCost: 300.00
  }) {
    productOrService { id name }
    userErrors { message }
  }
}
```

---

## 15. Custom Fields

### Query: List custom field configurations
```graphql
query {
  customFieldConfigurations(first: 50) {
    nodes { id label fieldType applicableTo }
  }
}
```

### Mutations: Create custom field configs
```graphql
mutation { customFieldConfigurationCreateText(input: { label: "Vehicle Make", applicableTo: CLIENT }) { ... } }
mutation { customFieldConfigurationCreateDropdown(input: { label: "Service Type", options: ["Detail", "PPF", "Ceramic"], applicableTo: JOB }) { ... } }
mutation { customFieldConfigurationCreateNumeric(input: { label: "Vehicle Year", applicableTo: CLIENT }) { ... } }
mutation { customFieldConfigurationCreateTrueFalse(input: { label: "Repeat Customer", applicableTo: CLIENT }) { ... } }
mutation { customFieldConfigurationCreateLink(input: { label: "Portfolio Link", applicableTo: JOB }) { ... } }
mutation { customFieldConfigurationCreateArea(input: { label: "Notes", applicableTo: JOB }) { ... } }
```

### Mutation: Edit/archive/unarchive
```graphql
mutation { customFieldConfigurationEdit(customFieldConfigurationId: "<id>", input: { label: "Updated" }) { ... } }
mutation { customFieldConfigurationArchive(customFieldConfigurationIds: ["<id>"]) { ... } }
mutation { customFieldConfigurationUnarchive(customFieldConfigurationIds: ["<id>"]) { ... } }
```

---

## 16. Tax Rates

### Query: List tax rates
```graphql
query { taxRates(first: 50) { nodes { id name rate } } }
```

### Mutation: Create tax
```graphql
mutation { taxCreate(input: { name: "GST", rate: 10.0, defaultTax: true }) { taxRate { id name rate } userErrors { message } } }
mutation { taxGroupCreate(input: { name: "Combined Tax", taxIds: ["<id1>", "<id2>"] }) { ... } }
```

---

## 17. Timesheets

### Query: Timesheet entries
```graphql
query {
  timeSheetEntries(
    first: 50
    filter: { ... }
    sort: [{ key: START_AT, direction: DESC }]
  ) {
    nodes { id startAt endAt duration user { name { full } } job { jobNumber } }
  }
}
query { timeSheetEntry(id: "<id>") { id startAt endAt duration } }
query { timeSheetEntriesByGroup(filter: { userId: "<id>", startDate: "2026-04-01", endDate: "2026-04-07" }) { ... } }
```
**Note:** Read-only. No create/edit/delete mutations for timesheets via API.

---

## 18. Vehicles/Equipment

### Query: Get/list vehicles
```graphql
query { vehicle(vehicleId: "<id>") { id make model year licensePlate } }
query { vehicles { nodes { id make model year licensePlate } } }
```

### Mutation: Create/update/delete vehicles
```graphql
mutation { vehicleCreate(input: { make: "Toyota", model: "HiAce", year: 2024, licensePlate: "ABC123" }) { vehicle { id } userErrors { message } } }
mutation { vehiclesUpdate(input: [{ vehicleId: "<id>", make: "Toyota", model: "HiAce LWB" }]) { vehicles { id } userErrors { message } } }
mutation { vehicleDelete(vehicleId: "<id>") { userErrors { message } } }
```

---

## 19. Webhooks

### Mutation: Create webhook
```graphql
mutation {
  webhookEndpointCreate(input: {
    topic: VISIT_COMPLETE
    url: "https://your-server.com/webhooks/jobber"
  }) {
    webhookEndpoint { id topic url }
    userErrors { message }
  }
}
```

### Mutation: Delete webhook
```graphql
mutation { webhookEndpointDelete(webhookEndpointsIds: ["<id>"]) { userErrors { message } } }
```

### Available webhook topics
| Topic | Trigger |
|-------|---------|
| CLIENT_CREATE / UPDATE / DESTROY | Client CRUD |
| JOB_CREATE / UPDATE / DESTROY / CLOSED | Job lifecycle |
| VISIT_CREATE / UPDATE / DESTROY / COMPLETE | Visit lifecycle |
| INVOICE_CREATE / UPDATE / DESTROY | Invoice CRUD |
| QUOTE_CREATE / UPDATE / DESTROY / SENT / APPROVED | Quote lifecycle |
| REQUEST_CREATE / UPDATE / DESTROY | Request CRUD |
| PAYMENT_CREATE / UPDATE / DESTROY | Payment events |
| PAYOUT_CREATE / UPDATE / DESTROY | Payout events |
| PRODUCT_OR_SERVICE_CREATE / UPDATE / DESTROY | Product CRUD |
| TIMESHEET_CREATE / UPDATE / DESTROY | Timesheet events |
| EXPENSE_CREATE / UPDATE / DESTROY | Expense events |
| USER_CREATE | New user |
| ON_MY_WAY_TRACKING_LINK_REQUEST | On My Way sent |

---

## 20. Account & Misc

### Query: Account info
```graphql
query { account { id name phone industry { name } createdAt } }
```

### Query: Online booking configuration
```graphql
query { onlineBookingConfiguration { ... } }
```

### Mutation: App management
```graphql
mutation { appDisconnect { userErrors { message } } }  # Remove app from account
mutation { appAlertEdit(input: { ... }) { ... } }
mutation { appInstanceLastSyncDateEdit(input: { lastSyncDate: "2026-04-01T00:00:00Z" }) { ... } }
```

---

## 21. Enums Reference

### Job/work status enums
| Enum | Values |
|------|--------|
| JobStatusTypeEnum | requires_invoicing, archived, late, today, upcoming, action_required, on_hold, unscheduled, active, expiring_within_30_days |
| JobTypeTypeEnum | ONE_OFF, RECURRING |
| VisitStatusTypeEnum | ACTIVE, COMPLETED, LATE, TODAY, UNSCHEDULED, UPCOMING |
| InvoiceStatusTypeEnum | draft, awaiting_payment, paid, past_due, bad_debt, sent_not_due |
| QuoteStatusTypeEnum | draft, awaiting_response, archived, approved, converted, changes_requested |
| RequestStatusTypeEnum | new, completed, converted, archived, upcoming, overdue, unscheduled, assessment_completed, today |

### Billing enums
| Enum | Values |
|------|--------|
| BillingStrategy | FIXED_PRICE, VISIT_BASED |
| BillingFrequencyEnum | ON_COMPLETION, PERIODIC, PER_VISIT, NEVER |
| CostModifierTypeEnum | Percent, Unit |
| TaxCalculationMethodType | EXCLUSIVE, INCLUSIVE |
| InvoiceCloseOptionsType | BAD_DEBT, MARK_RECEIVED |

### Scheduling enums
| Enum | Values |
|------|--------|
| ScheduledItemType | BASIC_TASK, VISIT, EVENT, ASSESSMENT, QUOTE_REMINDER, INVOICE_REMINDER |
| ScheduledItemStatus | ACTIVE, COMPLETED, OVERDUE, REMAINING |
| DurationUnit | DAYS, WEEKS, MONTHS, YEARS |
| IncompleteVisitDecisionEnum | DESTROY_ALL, COMPLETE_PAST_DESTROY_FUTURE |

### Contact enums
| Enum | Values |
|------|--------|
| ClientTitle | MR, MS, MRS, MISS, DR |
| PhoneNumberDescription | MAIN, WORK, MOBILE, HOME, FAX, OTHER |
| EmailDescription | MAIN, WORK, PERSONAL, OTHER |
| ProductsAndServicesCategory | PRODUCT, SERVICE |

---

## 22. Job Lifecycle: End-to-End

Here is the complete lifecycle for a Monarch Detailing job via the API:

### Step 1: Client comes in (Request)
```graphql
# Create client if new
mutation { clientCreate(input: { firstName: "John", lastName: "Smith", phones: [{ number: "0412345678", description: MOBILE }], properties: [{ address: { street1: "123 Main St", city: "Brisbane", province: "QLD", postalCode: "4000" } }] }) { client { id clientProperties(first:1) { nodes { id } } } } }

# Create request (optional — can skip to quote or job)
mutation { requestCreate(input: { clientId: "<client_id>", propertyId: "<property_id>", title: "Full detail enquiry" }) { request { id } } }
```

### Step 2: Quote the work
```graphql
mutation { quoteCreate(attributes: { clientId: "<client_id>", propertyId: "<property_id>", requestId: "<request_id>", title: "Full Detail", lineItems: [{ name: "Full Detail", unitPrice: 250, quantity: 1, taxable: true, saveToProductsAndServices: false }], taxRateId: "<tax_id>", transitionQuoteTo: AWAITING_RESPONSE }) { quote { id quoteNumber } } }
```

### Step 3: Create job (from quote or standalone)
```graphql
mutation { jobCreate(input: { propertyId: "<property_id>", quoteId: "<quote_id>", lineItems: [{ name: "Full Detail", unitPrice: 250, quantity: 1, taxable: true, saveToProductsAndServices: false }], invoicing: { invoicingType: FIXED_PRICE, invoicingSchedule: ON_COMPLETION }, scheduling: { createVisits: true, notifyTeam: true, assignedTo: ["<user_id>"], startTime: "09:00:00", endTime: "12:00:00" }, timeframe: { startAt: "2026-04-05", durationUnits: DAYS, durationValue: 1 } }) { job { id jobNumber visits(first:1) { nodes { id } } } } }
```

### Step 4: Manage the visit
```graphql
# Reschedule if needed
mutation { visitEditSchedule(id: "<visit_id>", input: { startAt: { date: "2026-04-06", time: "10:00:00", timezone: "Australia/Brisbane" }, endAt: { date: "2026-04-06", time: "13:00:00", timezone: "Australia/Brisbane" } }) { visit { id startAt } } }

# Reassign if needed
mutation { visitEditAssignedUsers(visitId: "<visit_id>", input: { assignedUserIds: ["<other_user_id>"] }) { visit { id } } }

# Complete the visit
mutation { visitComplete(visitId: "<visit_id>", input: { completedAt: "2026-04-06T13:00:00+10:00" }) { visit { id isComplete } } }
```

### Step 5: Invoice the client
```graphql
mutation { invoiceCreate(input: { clientId: "<client_id>", jobId: "<job_id>", lineItems: [{ name: "Full Detail", quantity: 1, taxable: true }], tax: { taxCalculationMethod: EXCLUSIVE, taxRateId: "<tax_id>" }, dueDetails: { dueDate: "2026-04-20T00:00:00Z" }, markSent: true, allowClientHubCreditCardPayments: true }) { invoice { id invoiceNumber invoiceStatus amounts { total } } } }
```

### Step 6: Close the job
```graphql
mutation { jobClose(jobId: "<job_id>", input: { modifyIncompleteVisitsBy: DESTROY_ALL }) { job { id jobStatus } } }
```

---

## Capabilities Summary

| Domain | Read | Create | Edit | Delete/Archive | Notes |
|--------|------|--------|------|----------------|-------|
| Clients | YES | YES | YES | Archive/Unarchive | Bulk create supported |
| Properties | YES | YES | YES | No | Created via client or standalone |
| Requests | YES | YES | YES | Archive/Unarchive | Line items, notes, assessments |
| Quotes | YES | YES | YES | No | Line items, notes, send on create |
| Jobs | YES | YES | YES | Close/Reopen | Line items, notes, full lifecycle |
| Visits | YES | YES | YES | Delete | Schedule, assign, complete, line items |
| Invoices | YES | YES | YES | Close (paid/bad debt) | Mark sent, reopen, notes |
| Payments | YES | No | No | No | Read-only via API |
| Expenses | YES | YES | YES | Delete | Link to jobs |
| Tasks | YES | YES | YES | Delete | Standalone to-dos |
| Events | YES | YES | No | No | Calendar events |
| Users | YES | No | Name only | No | Cannot create/delete users |
| Products/Services | YES | YES | YES | No | Service catalogue |
| Custom Fields | YES | YES (6 types) | YES | Archive/Unarchive | Text, dropdown, numeric, bool, link, area |
| Tax Rates | YES | YES | No | No | Tax and tax groups |
| Timesheets | YES | No | No | No | Read-only |
| Vehicles | YES | YES | YES (bulk) | Delete | Fleet management |
| Webhooks | No | YES | No | Delete | 44 event topics |
| Appointments | No | No | Schedule/Assign/Complete | No | Generic for all appointment types |

### What we CANNOT do via API
- Create/process payments (must use Jobber Payments or manual entry)
- Send invoices/quotes to clients (can only mark as sent)
- Create users or change roles
- Edit timesheets
- Delete clients (only archive)
- Delete jobs (only close)
- Delete quotes or invoices
- Edit events after creation
- Access reporting/analytics data
- Manage Jobber Payments settings
