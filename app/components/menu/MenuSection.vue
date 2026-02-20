<template>
  <div class="group">
    <div class="group__top">
      <div class="group__badge" :class="{ 'group__badge--soft': badgeSoft }">
        {{ badge }}
      </div>
      <div class="group__title">{{ title }}</div>
    </div>

    <div class="items" :class="{ 'items--single': singleColumn }">
      <ProductCard v-for="p in items" :key="p.id" :p="p" :big="bigCards" @buy="$emit('buy', $event)">
        <template #meta>
          <slot name="meta" />
        </template>
      </ProductCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/composables/useCart"
import ProductCard from "./ProductCard.vue"

defineProps<{
  badge: string
  title: string
  items: Product[]
  badgeSoft?: boolean
  singleColumn?: boolean
  bigCards?: boolean
}>()

defineEmits<{ (e: "buy", p: Product): void }>()
</script>

<style scoped>
.group {
  margin-top: 14px;
}

.group__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.group__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(196, 88, 52, 0.12);
  border: 1px solid rgba(196, 88, 52, 0.18);
  font-weight: 900;
  font-size: 12px;
  color: #7a3b2b;
}

.group__badge--soft {
  background: rgba(178, 74, 74, 0.1);
  border-color: rgba(178, 74, 74, 0.18);
  color: #7c2f2f;
}

.group__title {
  font-weight: 1000;
  letter-spacing: -0.01em;
}

/* ✅ фикс “выпирания” */
.items {

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  min-width: 0;
}





.items>* {
  min-width: 0;
}

.items--single {
  grid-template-columns: 1fr;
}

@media (max-width: 980px) {
  .items {
    grid-template-columns: 1fr;
  }
}
</style>
