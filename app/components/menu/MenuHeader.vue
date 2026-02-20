<template>
  <section class="head">
    <div class="head__badge">☕ Меню — For-L∞ve</div>

    <h1 class="head__title">
      Выбирай вкус <span class="dot">с любовью.</span>
    </h1>

    <p class="head__text">
      Слева — кофе и напитки, справа — блинчики. Всё свежее и вкусное ✨
    </p>

    <div class="head__actions">
      <NuxtLink class="btn btn--primary" to="/booking">Забронировать столик</NuxtLink>
      <NuxtLink class="btn btn--ghost" to="/contacts">Контакты</NuxtLink>

      <button class="btn btn--ghost cartBtn" type="button" @click="$emit('open-cart')">
        Корзина
        <span v-if="totalQty" class="cartBadge">{{ totalQty }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ totalQty: number }>()
defineEmits<{ (e: "open-cart"): void }>()
</script>

<style scoped>
.head {
  position: relative;
  z-index: 2;
  /* ✅ чтобы точно не перекрывалось */
  border-radius: 26px;
  padding: 26px 22px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1), 0 2px 0 rgba(255, 255, 255, 0.6) inset;
  backdrop-filter: blur(10px);
}

.head__badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(196, 88, 52, 0.12);
  border: 1px solid rgba(196, 88, 52, 0.18);
  font-weight: 800;
  color: #7a3b2b;
  font-size: 13px;
}

.head__title {
  margin: 14px 0 6px;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.dot {
  color: rgba(233, 68, 68, 0.95);
  text-shadow: 0 10px 25px rgba(196, 88, 52, 0.25);
}

.head__text {
  margin: 0;
  max-width: 72ch;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.88;
}

.head__actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
  user-select: none;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0px) scale(0.99);
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(178, 74, 74, 0.26);
}

.btn--primary:hover {
  background: #933737;
}

.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
  color: #111;
}

.btn--ghost:hover {
  background: rgba(232, 13, 13, 0.12);
}

.cartBtn {
  position: relative;
}

.cartBadge {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
  background: rgba(178, 74, 74, 0.18);
  border: 1px solid rgba(178, 74, 74, 0.28);
}
</style>
