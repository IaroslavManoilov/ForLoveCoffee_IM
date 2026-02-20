<template>
  <header class="topbar">
    <div class="topbar__inner">
      <NuxtLink class="logo" to="/" aria-label="Home">
        <img :src="topLogo" alt="For-love coffee" />
      </NuxtLink>

      <!-- Desktop -->
      <nav class="nav nav--desktop" aria-label="Main navigation">
        <NuxtLink class="nav__link" to="/" exact>Главная</NuxtLink>
        <NuxtLink class="nav__link" to="/about">Про нас</NuxtLink>
        <NuxtLink class="nav__link" to="/contacts">Контакты</NuxtLink>

        <button class="iconBtn" type="button" @click="goCheckout" aria-label="Checkout">
          🛒
          <span v-if="totalQty" class="badge" aria-live="polite">{{ totalQty }}</span>
        </button>

        <NuxtLink class="adminBtn" to="/admin/login" aria-label="Admin">
          <span class="adminIcon">👤</span>
          <span class="lock" :data-ok="isAdminAuthed ? '1' : '0'">
            {{ isAdminAuthed ? "🔓" : "🔒" }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Mobile -->
      <div class="nav nav--mobile">
        <button class="iconBtn" type="button" @click="goCheckout" aria-label="Checkout">
          🛒
          <span v-if="totalQty" class="badge" aria-live="polite">{{ totalQty }}</span>
        </button>

        <NuxtLink class="adminBtn" to="/admin/login" aria-label="Admin">
          <span class="adminIcon">👤</span>
          <span class="lock" :data-ok="isAdminAuthed ? '1' : '0'">
            {{ isAdminAuthed ? "🔓" : "🔒" }}
          </span>
        </NuxtLink>

        <button class="burger" type="button" :aria-expanded="mobileOpen ? 'true' : 'false'" aria-label="Menu"
          @click="mobileOpen = !mobileOpen">
          ☰
        </button>
      </div>
    </div>

    <!-- Mobile dropdown -->
    <Transition name="drop">
      <div v-if="mobileOpen" class="mobilePanel" @click.self="closeMobile">
        <div class="mobileCard">
          <NuxtLink class="mobileLink" to="/" @click="closeMobile">Главная</NuxtLink>
          <NuxtLink class="mobileLink" to="/about" @click="closeMobile">Про нас</NuxtLink>
          <NuxtLink class="mobileLink" to="/contacts" @click="closeMobile">Контакты</NuxtLink>

          <button class="mobileBtn" type="button" @click="onCheckoutFromMobile">
            <span>🛒 Корзина</span>
            <span v-if="totalQty" class="mobileBadge">{{ totalQty }}</span>
          </button>

          <NuxtLink class="mobileLink" to="/admin/login" @click="closeMobile">
            👤 Админ {{ isAdminAuthed ? "🔓" : "🔒" }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import topLogo from "@/assets/image5.svg"
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useCart } from "@/composables/useCart"
import { useCartDrawer } from "@/composables/useCartDrawer"

const { totalQty } = useCart()
const { closeDrawer } = useCartDrawer()

const goCheckout = async () => {
  closeDrawer()
  await navigateTo("/checkout")
}

const mobileOpen = ref(false)
const closeMobile = () => (mobileOpen.value = false)

const onCheckoutFromMobile = async () => {
  closeMobile()
  closeDrawer()
  await navigateTo("/checkout")
}

// admin auth
const { data, refresh } = await useAsyncData("admin-me", async () => {
  try {
    return await $fetch<{ ok: boolean }>("/api/admin/me", { credentials: "include" })
  } catch {
    return { ok: false }
  }
})

const isAdminAuthed = computed(() => !!data.value?.ok)

const onVis = () => {
  if (!document.hidden) refresh()
}
const onFocus = () => refresh()

onMounted(() => {
  document.addEventListener("visibilitychange", onVis)
  window.addEventListener("focus", onFocus)
})

onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", onVis)
  window.removeEventListener("focus", onFocus)
})

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    refresh()
  }
)
</script>

<style scoped>
/* === Размеры топбара (меняешь только тут) === */
.topbar {
  --topbar-offset: 12px;
  /* отступ сверху */
  --topbar-h: 84px;
  /* было 110px */

  position: fixed;
  top: var(--topbar-offset);
  left: 0;
  right: 0;
  width: 100%;
  height: var(--topbar-h);
  z-index: 3000;

  /* ✅ фикс уезда вправо */
  transform: none;
  overflow-x: visible;

  background: rgba(235, 235, 235, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.35);
}

.topbar__inner {
  height: 100%;
  width: 100%;
  padding: 0 clamp(16px, 4vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  /* было 160px */
  height: 100%;
  cursor: pointer;
  text-decoration: none;
}

.logo img {
  width: 90px;
  /* было 110px */
  height: auto;
  display: block;
  transition: transform 0.18s ease;
  transform-origin: center;
}

.logo:hover img {
  transform: scale(1.12);
}

.logo:active img {
  transform: scale(1.18);
}

.nav {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: clamp(12px, 3vw, 40px);
  height: 100%;
}

.nav__link {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.72);
  font-weight: 700;
  font-size: clamp(14px, 1.2vw, 18px);
  padding: 8px 10px;
  /* было 10px 12px */
  border-radius: 999px;
  transition: background 140ms ease, color 140ms ease;
  white-space: nowrap;
}

.nav__link:hover {
  color: #b24a4a;
  background: rgba(178, 74, 74, 0.1);
}

.nav__link.router-link-active,
.nav__link.router-link-exact-active {
  color: #b24a4a;
  background: rgba(178, 74, 74, 0.14);
}

.iconBtn {
  position: relative;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 10px;
  /* было 10px 12px */
  font-weight: 900;
  transition: transform 140ms ease, background 140ms ease;
  flex: 0 0 auto;
}

.iconBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.9);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #2a1713;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.adminBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 56px;
  height: 40px;
  /* было 44px */
  padding: 0 10px;
  /* было 0 12px */
  border-radius: 999px;
  text-decoration: none;

  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(80, 55, 48, 0.12);
  transition: transform 140ms ease, background 140ms ease;
  flex: 0 0 auto;
}

.adminBtn:hover {
  transform: translateY(-1px);
  background: rgba(178, 74, 74, 0.14);
}

.adminIcon {
  line-height: 1;
}

.lock {
  font-size: 16px;
  line-height: 1;
  opacity: 0.9;
}

.nav--mobile {
  display: none;
}

.burger {
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(80, 55, 48, 0.08);
  cursor: pointer;
  border-radius: 999px;
  padding: 8px 10px;
  /* было 10px 12px */
  font-weight: 900;
  flex: 0 0 auto;
}

@media (max-width: 860px) {
  .nav--desktop {
    display: none;
  }

  .nav--mobile {
    display: flex;
  }
}

/* mobile dropdown */
.mobilePanel {
  position: fixed;
  inset: calc(var(--topbar-offset) + var(--topbar-h)) 0 0 0;
  /* было calc(12px + 110px) */
  background: rgba(18, 10, 8, 0.28);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: start center;
  padding: 14px;
  z-index: 2999;
}

.mobileCard {
  width: min(92vw, 420px);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.16);
  padding: 10px;
  display: grid;
  gap: 8px;
}

.mobileLink {
  padding: 12px 12px;
  border-radius: 14px;
  text-decoration: none;
  color: rgba(28, 16, 13, 0.9);
  font-weight: 900;
}

.mobileLink:hover {
  background: rgba(178, 74, 74, 0.1);
  color: #b24a4a;
}

.mobileBtn {
  width: 100%;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(80, 55, 48, 0.06);
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  font-weight: 900;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobileBadge {
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.28);
  font-size: 12px;
}

/* transition */
.drop-enter-active,
.drop-leave-active {
  transition: opacity 160ms ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
}
</style>