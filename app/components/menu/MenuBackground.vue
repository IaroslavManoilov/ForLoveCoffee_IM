<template>
  <div class="bg" aria-hidden="true">
    <div class="bg__warm" />
    <div class="bg__grain" />
    <div class="bg__blob bg__blob--1" />
    <div class="bg__blob bg__blob--2" />
  </div>
</template>

<style scoped>
.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  /* ✅ фон всегда под всем */
  pointer-events: none;
  /* ✅ фон никогда не мешает кликам */
}

.bg__warm {
  position: absolute;
  inset: 0;
  background: radial-gradient(1100px 700px at 20% 10%, rgba(255, 228, 214, 0.9), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(255, 214, 196, 0.65), transparent 60%),
    radial-gradient(900px 900px at 45% 100%, rgba(214, 170, 150, 0.35), transparent 60%),
    linear-gradient(180deg, #fff 0%, #fbf5f1 45%, #f5ede8 100%);
}

.bg__grain {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.bg__blob {
  position: absolute;
  width: 560px;
  height: 560px;
  filter: blur(40px);
  opacity: 0.35;
  border-radius: 999px;
}

.bg__blob--1 {
  left: -140px;
  top: 120px;
  background: radial-gradient(circle at 30% 30%, rgba(196, 88, 52, 0.55), transparent 60%);
  animation: floaty 12s ease-in-out infinite;
}

.bg__blob--2 {
  right: -180px;
  bottom: -140px;
  background: radial-gradient(circle at 30% 30%, rgba(130, 70, 55, 0.55), transparent 60%);
  animation: floaty 14s ease-in-out infinite reverse;
}

@keyframes floaty {
  0% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(22px, -18px) scale(1.03);
  }

  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
