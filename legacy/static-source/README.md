# SOP — Sinergi Operational Platform

Integrated enterprise demo application for **PT Sinergi Bisnis Indonesia**.

## Start

Extract the ZIP and open:

`index.html`

Demo flow:

`Login → Dashboard → CRM → Quotation → Sales → Project → Purchase → Inventory → Finance & Accounting → Reports → Master Data → Documents → General Meeting → Settings`

No build process or backend is required.

## Architecture

The extended application does **not** implement 100 pages independently. It uses shared reusable layers:

- `css/style.css` — original Login / Dashboard / Leads design system
- `css/platform.css` — shared enterprise application components
- `js/platform-config.js` — route + menu metadata for the full platform
- `js/platform.js` — reusable application shell, page renderers, data grids, drawers, modals, import/export, validation, autosave, reports, Kanban, Gantt, settings, and business-document editors
- generated route entry files — very small HTML route wrappers that load the shared platform layer

Reusable concepts include:

- AppShell
- Sidebar
- TopNavbar
- Breadcrumb / PageHeader
- KPI cards
- Data grid / HandsontableGrid
- Detail drawer
- Status badges
- Modals / confirm dialogs
- Bulk actions
- Import / export
- Loading / empty / error states
- Forms
- Reports
- Kanban
- Gantt
- Approval / settings patterns

## Spreadsheet grid

The reusable `HandsontableGrid` component:

- attempts to load the official Handsontable + HyperFormula browser bundles when internet access is available;
- uses `licenseKey: non-commercial-and-evaluation` for this demo;
- applies the SOP theme and custom status/currency/progress rendering;
- enables filtering, sorting, context menu, copy/paste, fill handle, resizing, undo/redo, validation and selection;
- falls back automatically to the included native editable SOP grid if the external library cannot be reached, so the demo still works when opened locally/offline.

Formula-driven pages include quotation items, PO/SO/invoice line items, project budget, project cost, stock calculations, reconciliation, profitability, and accounting journals.

## Demo persistence

Grid edits are stored in the browser with `localStorage`, keyed per route.

Keyboard:
- `Ctrl/Cmd + K` — focus global search
- `Ctrl/Cmd + S` — save current grid/form draft
- spreadsheet keyboard behavior is available through Handsontable when loaded.

## Important

This is a front-end business-platform prototype. Actions that would normally require a backend (approval posting, bank connection, server backup, PDF service, real authentication, etc.) are simulated in local UI state with confirmation, toast, loading, or modal feedback.
