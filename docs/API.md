# API Endpoint Summary

Nuxt/Nitro menyediakan **101 resource CRUD** + endpoint autentikasi demo.

Semua resource CRUD memakai pola berikut:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/<resource>?page=1&limit=25&search=&sort=&order=asc` | List dengan pagination/search/filter/sort |
| GET | `/api/<resource>/:id` | Detail record |
| POST | `/api/<resource>` | Create record ke JSON |
| PUT | `/api/<resource>/:id` | Update record |
| DELETE | `/api/<resource>/:id` | Delete record |
| POST | `/api/auth/login` | Demo login contract |

## Resource routes

- `/crm/leads` → `/api/crm/leads`
- `/crm/prospects` → `/api/crm/prospects`
- `/crm/customers` → `/api/crm/customers`
- `/crm/activities` → `/api/crm/activities`
- `/crm/sales-pipeline` → `/api/crm/sales-pipeline`
- `/quotation` → `/api/quotation`
- `/quotation/draft` → `/api/quotation/draft`
- `/quotation/pending-approval` → `/api/quotation/pending-approval`
- `/quotation/sent` → `/api/quotation/sent`
- `/quotation/negotiation` → `/api/quotation/negotiation`
- `/quotation/approved` → `/api/quotation/approved`
- `/quotation/rejected` → `/api/quotation/rejected`
- `/quotation/expired` → `/api/quotation/expired`
- `/quotation/create` → `/api/quotation/create`
- `/sales/orders` → `/api/sales/orders`
- `/sales/delivery` → `/api/sales/delivery`
- `/sales/invoices` → `/api/sales/invoices`
- `/sales/returns` → `/api/sales/returns`
- `/sales/payments` → `/api/sales/payments`
- `/sales/receivables` → `/api/sales/receivables`
- `/project` → `/api/project`
- `/project/dashboard` → `/api/project/dashboard`
- `/project/planning` → `/api/project/planning`
- `/project/wbs` → `/api/project/wbs`
- `/project/tasks` → `/api/project/tasks`
- `/project/gantt` → `/api/project/gantt`
- `/project/milestones` → `/api/project/milestones`
- `/project/team` → `/api/project/team`
- `/project/progress` → `/api/project/progress`
- `/project/budget` → `/api/project/budget`
- `/project/cost` → `/api/project/cost`
- `/project/procurement` → `/api/project/procurement`
- `/project/documents` → `/api/project/documents`
- `/project/profitability` → `/api/project/profitability`
- `/purchase/request` → `/api/purchase/request`
- `/purchase/orders` → `/api/purchase/orders`
- `/purchase/receipts` → `/api/purchase/receipts`
- `/purchase/returns` → `/api/purchase/returns`
- `/purchase/vendors` → `/api/purchase/vendors`
- `/purchase/contracts` → `/api/purchase/contracts`
- `/inventory/stock` → `/api/inventory/stock`
- `/inventory/movement` → `/api/inventory/movement`
- `/inventory/transfer` → `/api/inventory/transfer`
- `/inventory/opname` → `/api/inventory/opname`
- `/inventory/adjustment` → `/api/inventory/adjustment`
- `/inventory/stock-card` → `/api/inventory/stock-card`
- `/finance/transactions/sales` → `/api/finance/transactions/sales`
- `/finance/transactions/purchases` → `/api/finance/transactions/purchases`
- `/finance/transactions/expenses` → `/api/finance/transactions/expenses`
- `/finance/transactions/receipts` → `/api/finance/transactions/receipts`
- `/finance/transactions/adjustments` → `/api/finance/transactions/adjustments`
- `/finance/accounting/journal` → `/api/finance/accounting/journal`
- `/finance/accounting/trial-balance` → `/api/finance/accounting/trial-balance`
- `/finance/accounting/balance-sheet` → `/api/finance/accounting/balance-sheet`
- `/finance/accounting/income-statement` → `/api/finance/accounting/income-statement`
- `/finance/accounting/cash-flow` → `/api/finance/accounting/cash-flow`
- `/finance/accounting/reconciliation` → `/api/finance/accounting/reconciliation`
- `/finance/accounting/closing` → `/api/finance/accounting/closing`
- `/finance/cash` → `/api/finance/cash`
- `/finance/bank` → `/api/finance/bank`
- `/finance/transfers` → `/api/finance/transfers`
- `/finance/bank-reconciliation` → `/api/finance/bank-reconciliation`
- `/reports/financial` → `/api/reports/financial`
- `/reports/tax` → `/api/reports/tax`
- `/reports/management` → `/api/reports/management`
- `/reports/sales` → `/api/reports/sales`
- `/reports/purchase` → `/api/reports/purchase`
- `/reports/project` → `/api/reports/project`
- `/reports/inventory` → `/api/reports/inventory`
- `/reports/assets` → `/api/reports/assets`
- `/reports/other` → `/api/reports/other`
- `/master/company` → `/api/master/company`
- `/master/coa` → `/api/master/coa`
- `/master/customers` → `/api/master/customers`
- `/master/vendors` → `/api/master/vendors`
- `/master/products` → `/api/master/products`
- `/master/assets` → `/api/master/assets`
- `/master/departments` → `/api/master/departments`
- `/master/employees` → `/api/master/employees`
- `/master/warehouses` → `/api/master/warehouses`
- `/master/pricing-tax` → `/api/master/pricing-tax`
- `/master/banks` → `/api/master/banks`
- `/master/others` → `/api/master/others`
- `/documents` → `/api/documents`
- `/documents/projects` → `/api/documents/projects`
- `/documents/quotations` → `/api/documents/quotations`
- `/documents/sales` → `/api/documents/sales`
- `/documents/purchases` → `/api/documents/purchases`
- `/documents/templates` → `/api/documents/templates`
- `/meeting/agenda` → `/api/meeting/agenda`
- `/meeting/general` → `/api/meeting/general`
- `/meeting/resolutions` → `/api/meeting/resolutions`
- `/meeting/documents` → `/api/meeting/documents`
- `/settings/users` → `/api/settings/users`
- `/settings/workflow` → `/api/settings/workflow`
- `/settings/numbering` → `/api/settings/numbering`
- `/settings/integrations` → `/api/settings/integrations`
- `/settings/notifications` → `/api/settings/notifications`
- `/settings/audit` → `/api/settings/audit`
- `/settings/backup` → `/api/settings/backup`
- `/settings/parameters` → `/api/settings/parameters`

## Response contract

Collection:
```json
{"success":true,"data":[],"page":1,"limit":25,"total":0,"totalPages":1}
```

Mutation:
```json
{"success":true,"message":"Updated","data":{}}
```
