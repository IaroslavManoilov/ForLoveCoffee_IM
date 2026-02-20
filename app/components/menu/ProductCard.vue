<template>
  <article class="pc" :class="{ 'pc--big': big }">
    <div class="pcImgWrap">
      <img class="pcImg" :src="p.img" :alt="p.title" loading="lazy" />
    </div>

    <div class="pcBody">
      <div class="pcTop">
        <h3 class="pcTitle" :title="p.title">{{ p.title }}</h3>
        <div class="pcPrice">{{ p.price }} MDL</div>
      </div>

      <p class="pcDesc" :title="p.desc">{{ p.desc }}</p>

      <div class="pcMeta">
        <span class="pcTag">{{ p.tag }}</span>
        <slot name="meta" />
      </div>

      <div class="pcBottom">
        <button class="pcBuy" type="button" @click="$emit('buy', p)">
          Купить
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from "~/composables/useCart"

defineProps<{
  p: Product
  big?: boolean
}>()

defineEmits<{ (e: "buy", p: Product): void }>()
</script>

<style scoped>
/* Карточка */
.pc {
  min-width: 0;
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 12px 30px rgba(32, 18, 14, 0.06);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}

.pcImgWrap {
  background: rgba(255, 255, 255, 0.8);
  padding: 12px;
}

.pcImg {
  width: 100%;
  height: 180px;
  object-fit: contain;
  display: block;
  border-radius: 12px;
}

.pcBody {
  padding: 12px;
  min-width: 0;
}

.pcTop {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: start;
  min-width: 0;
}

.pcTitle {
  margin: 0;
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: -0.01em;

  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pcPrice {
  font-size: 13px;
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
}

/* ✅ описание: без line-clamp и без -webkit-line-clamp (никаких предупреждений) */
.pcDesc {
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.45;
  opacity: 0.78;

  overflow: hidden;
  word-break: break-word;

  /* 2 строки: line-height(1.45) * 11px * 2 = ~31.9px */
  max-height: calc(11px * 1.45 * 2);
}

.pcMeta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.pcTag {
  font-size: 11px;
  font-weight: 900;
  border-radius: 999px;
  padding: 5px 10px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

/* ✅ кнопка всегда влезает */
.pcBottom {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.pcBuy {
  border: 1px solid rgba(178, 74, 74, 0.22);
  background: rgba(178, 74, 74, 0.12);
  color: #7c2f2f;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 1000;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  max-width: 100%;
}

.pcBuy:hover {
  background: rgba(178, 74, 74, 0.18);
}

/* big cards */
.pc--big .pcImg {
  height: 260px;
}

.pc--big .pcTitle {
  font-size: 14px;
}

.pc--big .pcDesc {
  font-size: 12px;
  line-height: 1.45;

  /* 3 строки: 12px * 1.45 * 3 = ~52.2px */
  max-height: calc(12px * 1.45 * 3);
}

@media (max-width: 520px) {
  .pcBottom {
    justify-content: stretch;
  }

  .pcBuy {
    width: 100%;
  }
}
</style>
