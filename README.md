# SOP — Sinergi Operational Platform (Nuxt Migration)

Migrasi frontend statis SOP ke **Nuxt 4 / Vue 3 / TypeScript** dengan tujuan mempertahankan visual source asli sambil memecah arsitektur legacy menjadi pages, layouts, components, composables, Nuxt server API, typed configuration, dan JSON mock persistence.

## Stack

- Nuxt 4.5.2 pattern mengikuti reference branch `dulank-nuxt/Rama`
- Vue 3 + TypeScript
- Tailwind CSS 4 melalui `@tailwindcss/vite` (CSS legacy tetap menjadi visual source of truth)
- Handsontable 18.1.0 + `@handsontable/vue3` 18.1.0
- HyperFormula 3.4.0 untuk formula engine yang dipasang eksplisit
- Nitro server API
- JSON mock persistence pada `server/data/**/*.json`

## Handsontable

Grid client berada di `app/components/common/data-grid/HandsontableGrid.client.vue` agar SSR-safe. Import CSS menggunakan package export yang didukung:

```ts
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
```

Tidak ada import legacy `handsontable/dist/handsontable.full.min.css`.

## Menjalankan

```bash
npm install
npm run dev
```

Validasi:

```bash
npm run validate:json
npm run validate:migration
npm run validate:assets
npm run typecheck
npm run build
```

## Arsitektur

```text
app/
  assets/css/          # source CSS + compatibility
  components/
    common/data-grid/  # Handsontable SSR-safe wrapper
    layout/            # sidebar/menu/icon shell
    pages/             # page/domain renderers
  composables/         # API, resource grid, toast
  config/              # typed route/menu/grid schema config
  layouts/             # default + platform
  pages/               # 102 explicit Nuxt routes + login
  types/
  utils/
server/
  api/                 # REST CRUD endpoints per route/resource
  data/                # JSON temporary persistence
  types/
  utils/               # reusable JSON repository/query logic
legacy/
  static-source/       # original HTML/CSS/JS, untouched, for regression comparison
scripts/
  validate-migration.mjs
  validate-json.mjs
```

## Data Flow

`Nuxt Page → Domain/Type Component → Composable → Nuxt API → server/data/*.json`

Frontend tidak mengimpor `server/data` secara langsung. `NUXT_PUBLIC_API_BASE_URL` disediakan agar integrasi berikutnya dapat diarahkan ke Spring Boot tanpa mengubah visual components.

## REST API

Untuk route data utama tersedia pola:

```text
GET    /api/<module>/<resource>
GET    /api/<module>/<resource>/:id
POST   /api/<module>/<resource>
PUT    /api/<module>/<resource>/:id
DELETE /api/<module>/<resource>/:id
```

Collection GET mendukung `page`, `limit`, `search`, field filter, `sort`, dan `order`.

## Environment

Salin `.env.example` menjadi `.env` bila perlu. Untuk produksi komersial, isi `NUXT_PUBLIC_HANDSONTABLE_LICENSE_KEY` dengan license Handsontable yang sesuai. Nilai demo `non-commercial-and-evaluation` hanya untuk penggunaan yang memenuhi lisensinya.

Untuk deployment VM/container, arahkan `SOP_DATA_DIR` ke volume writable dan persisten. Pada platform serverless (misalnya Vercel, Netlify, atau AWS Lambda), API otomatis memakai temporary directory agar operasi CRUD tidak gagal karena filesystem aplikasi bersifat read-only. Data di temporary directory dapat hilang saat instance di-restart dan tidak dibagikan antar-instance; gunakan backend/database persisten untuk data produksi.

## Routes

Legacy `route-map.json` berisi **102 route**. Detail mapping ada di `docs/ROUTE_MIGRATION.md`. `npm run validate:migration` membandingkan route map dengan file-based routes dan gagal bila ada route hilang.

## Backend Migration

Saat Spring Boot/PostgreSQL siap, ubah `NUXT_PUBLIC_API_BASE_URL` ke base URL backend dan pertahankan kontrak response/API. Pages dan visual components tidak perlu dirombak besar.

## Catatan Migrasi

- Login, Dashboard, dan CRM Leads menggunakan markup original sebagai Vue template (bukan `v-html`) untuk menjaga fidelity.
- 100 route platform yang sebelumnya dirender oleh satu `platform.js` kini memiliki file Nuxt route masing-masing dan memakai layout/components/composables terpisah.
- Source original tidak di-overwrite dan disimpan di `legacy/static-source` untuk perbandingan visual/regression.

## Dokumentasi tambahan

- `docs/ROUTE_MIGRATION.md` — mapping seluruh 102 route.
- `docs/API.md` — endpoint CRUD dan query contract.
- `docs/VALIDATION.md` — hasil validasi dan catatan environment build.
