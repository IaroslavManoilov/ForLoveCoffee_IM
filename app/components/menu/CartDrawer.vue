<template>
  <Teleport to="body">
    <div class="drawer" :data-open="open ? 'true' : 'false'" @click.self="$emit('close')">
      <div class="drawerPanel">
        <div class="drawerTop">
          <div class="drawerTitle">Корзина</div>
          <button class="iconBtn" type="button" @click="$emit('close')">✕</button>
        </div>

        <div v-if="cart.length" class="drawerList">
          <div v-for="i in cart" :key="i.id" class="drawerItem">
            <img class="drawerImg" :src="i.img" :alt="i.title" loading="lazy" />

            <div class="drawerInfo">
              <div class="drawerName">{{ i.title }}</div>
              <div class="drawerSub">{{ i.price }} MDL • {{ i.tag }}</div>

              <div class="qtyRow">
                <button class="qtyBtn" type="button" @click="$emit('dec', i.id)">−</button>
                <div class="qtyNum">{{ i.qty }}</div>
                <button class="qtyBtn" type="button" @click="$emit('inc', i.id)">+</button>
                <button class="removeBtn" type="button" @click="$emit('remove', i.id)">Удалить</button>
              </div>
            </div>

            <div class="drawerLinePrice">{{ i.price * i.qty }} MDL</div>
          </div>
        </div>

        <div v-else class="empty">
          <div class="emptyTitle">Пусто</div>
          <div class="emptyText">Добавь что-нибудь вкусное 🙂</div>
        </div>

        <div class="drawerBottom">
          <div class="sumRow">
            <div class="sumLabel">Итого</div>
            <div class="sumValue">{{ totalPrice }} MDL</div>
          </div>

          <div class="drawerActions">
            <button class="btn btn--ghost" type="button" @click="$emit('clear')" :disabled="!cart.length">
              Очистить
            </button>
            <button class="btn btn--primary" type="button" :disabled="!cart.length" @click="$emit('checkout')">
              Оформить
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from "~/composables/useCart"
type CartItem = Product & { qty: number }

defineProps<{
  open: boolean
  cart: CartItem[]
  totalPrice: number
}>()

defineEmits<{
  (e: "close"): void
  (e: "inc", id: string): void
  (e: "dec", id: string): void
  (e: "remove", id: string): void
  (e: "clear"): void
  (e: "checkout"): void
}>()
</script>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 999999;
  /* ✅ поверх всего (как было, но гарантировано) */
  background: rgba(10, 10, 10, 0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
}

.drawer[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
}

.drawerPanel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px);
  border-left: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: -18px 0 60px rgba(32, 18, 14, 0.18);
  transform: translateX(18px);
  transition: transform 180ms ease;
  display: flex;
  flex-direction: column;
}

.drawer[data-open="true"] .drawerPanel {
  transform: translateX(0);
}

.drawerTop {
  padding: 14px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(80, 55, 48, 0.12);
}

.drawerTitle {
  font-weight: 1000;
  font-size: 18px;
}

.iconBtn {
  border: 1px solid rgba(80, 55, 48, .14);
  background: rgba(255, 255, 255, .65);
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
}

.drawerList {
  padding: 12px;
  overflow: auto;
  flex: 1;
  display: grid;
  gap: 10px;
}

.drawerItem {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, .12);
  background: rgba(255, 255, 255, .6);
}

.drawerImg {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(255, 255, 255, .55);
  border: 1px solid rgba(80, 55, 48, .10);
  padding: 6px;
}

.drawerName {
  font-weight: 1000;
}

.drawerSub {
  margin-top: 3px;
  font-size: 12px;
  opacity: .78;
}

.qtyRow {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.qtyBtn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(80, 55, 48, .14);
  background: rgba(255, 255, 255, .6);
  cursor: pointer;
  font-weight: 1000;
}

.qtyNum {
  min-width: 22px;
  text-align: center;
  font-weight: 1000;
}

.removeBtn {
  margin-left: auto;
  border: 1px solid rgba(178, 74, 74, .22);
  background: rgba(178, 74, 74, .10);
  color: #7c2f2f;
  border-radius: 999px;
  padding: 8px 10px;
  font-weight: 1000;
  cursor: pointer;
}

.drawerLinePrice {
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
  align-self: start;
  padding-top: 2px;
}

.empty {
  padding: 18px;
  opacity: .85;
}

.emptyTitle {
  font-weight: 1000;
}

.emptyText {
  margin-top: 4px;
}

.drawerBottom {
  padding: 12px;
  border-top: 1px solid rgba(80, 55, 48, .12);
}

.sumRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 12px;
  border-radius: 18px;
  background: rgba(178, 74, 74, .08);
  border: 1px solid rgba(178, 74, 74, .16);
}

.sumLabel {
  font-weight: 1000;
  opacity: .85;
}

.sumValue {
  font-weight: 1000;
  color: #b24a4a;
}

.drawerActions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 800;
  font-size: 15px;
  background: rgba(0, 0, 0, .08);
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, .26);
}

.btn--ghost {
  background: rgba(163, 147, 147, .08);
}

.btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}
</style>
