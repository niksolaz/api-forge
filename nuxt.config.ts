export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  runtimeConfig: {
    sessionSecret: process.env.NUXT_SESSION_SECRET || "change-me-in-production",
    public: { appName: "API Forge" },
  },
  app: {
    head: {
      title: "API Forge",
      meta: [
        {
          name: "description",
          content: "Progetta, proteggi e genera API RESTful dal tuo dominio.",
        },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  nitro: { routeRules: { "/api/**": { cors: true } } },
});
