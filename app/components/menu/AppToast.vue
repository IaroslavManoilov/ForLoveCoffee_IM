<template>
  <div class="toast" :data-show="show">{{ text }}</div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; text: string }>()
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%) translateY(14px);
  opacity: 0;
  pointer-events: none;
  z-index: 80;
  padding: 12px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(80, 55, 48, 0.14);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.16);
  backdrop-filter: blur(10px);
  font-weight: 900;
}

.toast[data-show="true"] {
  opacity: 1;
  transform: translateX(-50%) translateY(0px);
  transition: all 160ms ease;
}
</style>
