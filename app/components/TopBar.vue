<template>
  <header class="topbar" :class="{ 'is-open': mobileOpen }">
    <div class="topbar__inner">
      <!-- Left: Logo -->
      <NuxtLink class="logo" to="/" aria-label="Home" @click="closeMobile">
        <img :src="topLogo" alt="For-love coffee" />
      </NuxtLink>

      <!-- Desktop nav -->
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

      <!-- Mobile actions -->
      <div class="nav nav--mobile" aria-label="Mobile actions">
        <button class="iconBtn iconBtn--mini" type="button" @click="goCheckout" aria-label="Cart">
          🛒
          <span v-if="totalQty" class="badge" aria-live="polite">{{ totalQty }}</span>
        </button>

        <NuxtLink class="iconBtn iconBtn--mini" to="/admin/login" aria-label="Admin" @click="closeMobile">
          👤
          <span class="lockMini">{{ isAdminAuthed ? "🔓" : "🔒" }}</span>
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
/* =========================================
   MOBILE FIRST (телефон) — компактная капсула
   ========================================= */

.topbar {
  --offset: 10px;
  --h: 64px;

  position: fixed;
  top: calc(var(--offset) + env(safe-area-inset-top));
  left: 0;
  right: 0;
  z-index: 3000;

  display: grid;
  place-items: center;
}

.topbar__inner {
  height: var(--h);
  width: min(520px, calc(100% - 18px));
  margin-inline: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: 0 14px 34px rgba(32, 18, 14, 0.14);
  border-radius: 999px;

  padding-left: calc(12px + env(safe-area-inset-left));
  padding-right: calc(12px + env(safe-area-inset-right));
  box-sizing: border-box;
}

/* logo */
.logo {
  display: inline-flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
  flex: 0 0 auto;
  padding-left: 4px;
}

.logo img {
  width: 56px;
  height: auto;
  display: block;
}

/* nav base */
.nav {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

/* desktop hidden on mobile */
.nav--desktop {
  display: none;
}

.nav--mobile {
  display: flex;
}

/* icon buttons */
.iconBtn {
  position: relative;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  border-radius: 999px;
  font-weight: 900;
  transition: transform 140ms ease, background 140ms ease;
  flex: 0 0 auto;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.78);
}

.iconBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.92);
}

.iconBtn--mini {
  padding: 9px 11px;
  min-width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.lockMini {
  margin-left: 6px;
  font-size: 14px;
  opacity: 0.9;
}

/* burger */
.burger {
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(80, 55, 48, 0.08);
  cursor: pointer;
  border-radius: 999px;
  padding: 9px 12px;
  font-weight: 900;
  min-width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* =========================================
   DESKTOP (комп) — больше, шире, крупнее
   ========================================= */
@media (min-width: 861px) {
  .topbar {
    --offset: 12px;
    --h: 78px;
  }

  .topbar__inner {
    /* было: width: min(1240px, calc(100% - 40px)); */
    width: min(1240px, calc(100% - 20px));
    /* +20px шире на компе */
    gap: 16px;

    background: rgba(235, 235, 235, 0.58);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 18px 54px rgba(32, 18, 14, 0.16);

    padding-left: calc(18px + env(safe-area-inset-left));
    padding-right: calc(18px + env(safe-area-inset-right));
  }

  .logo img {
    width: 82px;
  }

  .nav--mobile {
    display: none;
  }

  .nav--desktop {
    display: flex;
  }

  .nav {
    gap: 14px;
  }

  .nav__link {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.72);
    font-weight: 800;
    font-size: 16px;
    padding: 10px 14px;
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
    padding: 10px 14px;
    font-size: 16px;
  }

  .adminBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 64px;
    height: 46px;
    padding: 0 14px;
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

  .lock {
    font-size: 16px;
    line-height: 1;
    opacity: 0.9;
  }
}

/* dropdown */
.mobilePanel {
  position: fixed;
  inset: calc(var(--offset) + env(safe-area-inset-top) + var(--h) + 10px) 0 0 0;
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