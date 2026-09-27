import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  nitro: {
    serverAssets: [
      {
        baseName: 'sop-data',
        dir: fileURLToPath(new URL('./server/data', import.meta.url)),
      },
    ],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
      handsontableLicenseKey: process.env.NUXT_PUBLIC_HANDSONTABLE_LICENSE_KEY || 'non-commercial-and-evaluation',
    },
  },
  app: {
    head: {
      title: 'SOP  - Sinergi Operational Platform',
      htmlAttrs: { lang: 'id' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
