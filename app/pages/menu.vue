<template>
  <div class="page">
    <MenuBackground />

    <main class="wrap">
      <!-- ✅ ВЕРХНИЙ БЛОК (как на скрине 2) -->
      <MenuHeader :total-qty="totalQty" @open-cart="openCart" />

      <!-- GRID -->
      <section class="menuGrid">
        <!-- LEFT -->
        <article class="card">
          <div class="card__head">
            <h2 class="card__title">Кофе & напитки</h2>
            <p class="card__subtitle">Сиропы, мороженое, настроение — выбирай своё.</p>
          </div>

          <MenuSection badge="For-L∞ve coffee" title="Кофе" :items="coffee" @buy="buy" />

          <MenuSection
            badge="For-L∞ve drinks"
            title="Чай / напитки"
            :items="drinks"
            :badge-soft="true"
            @buy="buy"
          >
            <template #meta>
              <span class="mini">лёд</span>
              <span class="mini">цитрус</span>
            </template>
          </MenuSection>
        </article>

        <!-- RIGHT -->
        <aside class="card card--accent right">
          <div class="card__head">
            <h2 class="card__title">Блинчики</h2>
            <p class="card__subtitle">Сладкие, нежные — идеальны к кофе.</p>
          </div>

          <MenuSection
            badge="For-L∞ve crepes"
            title="Блинчики"
            :items="crepes"
            :single-column="true"
            :big-cards="true"
            @buy="buy"
          >
            <template #meta>
              <span class="mini">добавки</span>
              <span class="mini">шоколад</span>
            </template>
          </MenuSection>

          <div class="cta">
            <div class="ctaLeft">
              <div class="ctaTitle">Хочешь помочь выбрать?</div>
              <div class="ctaText">Напиши нам — подскажем по вкусу.</div>
            </div>

            <NuxtLink class="btn btn--primary" to="/contacts">Написать</NuxtLink>
          </div>
        </aside>
      </section>
    </main>

    <!-- TOAST -->
    <AppToast :show="toast.show" :text="toast.text" />

    <!-- ✅ CART DRAWER -->
    <CartDrawer
      :open="cartOpen"
      :cart="cart"
      :total-price="totalPrice"
      @close="cartOpen = false"
      @inc="inc"
      @dec="dec"
      @remove="remove"
      @clear="clear"
      @checkout="goCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import MenuBackground from "~/components/menu/MenuBackground.vue"
import MenuHeader from "~/components/menu/MenuHeader.vue"
import MenuSection from "~/components/menu/MenuSection.vue"
import CartDrawer from "~/components/menu/CartDrawer.vue"
import AppToast from "~/components/menu/AppToast.vue"
import { useCart, type Product } from "~/composables/useCart"
import { coffee, drinks, crepes } from "~/data/menu"

const router = useRouter()

useHead({
  title: "Меню — For Love Coffee",
  meta: [{ name: "description", content: "Меню For Love Coffee: кофе, чай и сладкие блинчики." }],
})

const { cart, totalQty, totalPrice, add, remove, inc, dec, clear } = useCart()

const cartOpen = ref(false)
function openCart() {
  cartOpen.value = true
}
function goCheckout() {
  cartOpen.value = false
  router.push("/checkout")
}

/* Toast */
const toast = ref({ show: false, text: "" })
let toastTimer: any = null

function showToast(text: string) {
  toast.value = { show: true, text }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value.show = false), 1600)
}

function buy(p: Product) {
  add(p, 1)
  showToast(`Добавлено: ${p.title}`)
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
  position: relative;
  overflow: hidden;
}

.wrap {
  max-width: 1180px;
  margin: 0 auto;
}

.menuGrid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.card--accent {
  background: radial-gradient(900px 500px at 30% 10%, rgba(196, 88, 52, 0.16), transparent 55%),
    rgba(255, 255, 255, 0.62);
}

.card__head {
  margin-bottom: 14px;
}

.card__title {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.01em;
}

.card__subtitle {
  margin: 6px 0 0;
  opacity: 0.78;
  line-height: 1.5;
}

.right {
  align-self: start;
}

.cta {
  margin-top: 14px;
  border-radius: 22px;
  padding: 14px;
  background: rgba(178, 74, 74, 0.1);
  border: 1px solid rgba(178, 74, 74, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.ctaTitle {
  font-weight: 1000;
}
.ctaText {
  opacity: 0.8;
  margin-top: 2px;
}

.mini {
  font-size: 12px;
  font-weight: 1000;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.2px;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
  user-select: none;
}
.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

@media (max-width: 980px) {
  .menuGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .page {
    padding-top: 90px;
  }
  .card {
    padding: 16px;
  }
}
</style>
