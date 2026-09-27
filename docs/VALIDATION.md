# Migration Validation

Validation performed in the migration workspace on 27 September 2026.

## Passed

- Legacy route count: **102**
- Migrated route count: **102**
- Missing routes: **0**
- Extra mapped legacy routes: **0**
- Nuxt page files: **103** (102 legacy routes + login `/`)
- Nitro API TypeScript files: **506**
- JSON data files: **103**
- JSON parse validation: **PASS**
- Legacy `.html` navigation references in migrated app: **0**
- TypeScript syntax transpilation check: **655 scripts checked, 0 syntax errors**
- Original static source retained under `legacy/static-source`
- Unsupported Handsontable `dist/handsontable.full.min.css` import: **not used**
- Frontend direct import from `server/data`: **not used**
- `v-html` page migration: **not used**

## Package-install / build environment note

`npm install` was attempted twice. The execution environment could not resolve `registry.npmjs.org` and returned:

```text
EAI_AGAIN getaddrinfo registry.npmjs.org
```

Because dependencies could not be downloaded in this sandbox, `nuxt typecheck` and `nuxt build` could not be executed here. This is an environment/network limitation, not a project validation pass. On a machine with npm registry access, run:

```bash
npm install
npm run validate:all
npm run typecheck
npm run build
npm run dev
```

Any compiler/runtime issue found by those commands should be treated as remaining migration work; route/JSON/static syntax checks above have already passed.
