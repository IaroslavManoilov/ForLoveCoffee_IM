<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
  ],
  link: [
    { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "shortcut icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
  background: #fdf5f0;
  width: 100%;
  overflow-x: hidden;

  /* iPhone/Telegram safe area */
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

#__nuxt {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* чтобы padding не ломал ширины */
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>