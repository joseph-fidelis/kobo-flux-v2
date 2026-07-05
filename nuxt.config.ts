export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    /** Server-only — never exposed to the browser. */
    koboApiToken: process.env.NUXT_KOBO_API_TOKEN ?? process.env.NUXT_PUBLIC_API_TOKEN ?? '',
    koboBaseUrl: process.env.NUXT_KOBO_BASE_URL ?? 'https://kc.kobotoolbox.org',
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? 'Sample App',
      /** Leave empty — API calls go to same-origin Nitro proxy routes (/api/*, /me/*). */
      baseURL: process.env.NUXT_PUBLIC_BASE_URL ?? '',
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vee-validate/zod',
        'vee-validate',
        'zod',
        '@vueuse/core',
        'lucide-vue-next',
        'vue-sonner',
        'clsx',
        'tailwind-merge',
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  colorMode: {
    preference: 'light',   // default theme
    fallback: 'light',     // if system preference unavailable
    classSuffix: '',       // results in .light / .dark classes
    storageKey: 'nuxt-color-mode'
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
})