export default defineNuxtConfig({
  srcDir: "app",

  // 👇 говорим Nuxt где лежит сервер (корневая папка /server)
  serverDir: "server",

  runtimeConfig: {
    ADMIN_LOGIN: process.env.ADMIN_LOGIN || "admin",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
    ADMIN_SECRET: process.env.ADMIN_SECRET || "change_me_super_secret",
  },
})
