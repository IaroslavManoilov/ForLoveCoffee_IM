<template>
  <TopBar />

  <CartDrawer :open="open" :cart="cart" :total-price="totalPrice" @close="closeDrawer" @inc="inc" @dec="dec"
    @remove="remove" @clear="clear" @checkout="onCheckout" />

  <div class="page">
    <slot />
  </div>
</template>

<script setup lang="ts">
import TopBar from "~/components/TopBar.vue"
import CartDrawer from "~/components/menu/CartDrawer.vue"
import { useCart } from "~/composables/useCart"
import { useCartDrawer } from "~/composables/useCartDrawer"

const { cart, totalPrice, inc, dec, remove, clear } = useCart()
const { open, closeDrawer } = useCartDrawer()

const onCheckout = async () => {
  closeDrawer()
  await navigateTo("/checkout")
}
</script>

<style>
.page {
  padding-top: calc(110px + 12px);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>