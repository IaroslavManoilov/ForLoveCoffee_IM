<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <h1 class="title">Заказ оформлен</h1>

        <div v-if="pending && !order" class="empty">Загрузка…</div>
        <div v-else-if="errorText" class="empty">{{ errorText }}</div>

        <div v-else-if="order" class="box">
          <div class="metaLine"><b>Номер заказа:</b> {{ order.id }}</div>
          <div class="metaLine"><b>Время оформления:</b> {{ fmtDate(order.createdAt) }}</div>
          <div class="metaLine"><b>Готово через:</b> {{ order.prepMinutes }} мин</div>
          <div class="metaLine"><b>Готово к:</b> {{ fmtTime(order.readyAt) }}</div>

          <div class="metaLine"><b>Контакт:</b> {{ order.customerName }} • {{ order.customerPhone }}</div>

          <div class="metaLine">
            <b>Способ:</b> {{ order.deliveryType === "delivery" ? "Доставка" : "Самовывоз" }}
            <span v-if="order.deliveryType === 'delivery' && order.deliveryAddress"> • {{ order.deliveryAddress
              }}</span>
          </div>

          <div class="metaLine">
            <b>Оплата:</b> {{ order.paymentMethod === "cash" ? "Наличными" : "Картой" }} при получении •
            <b>{{ order.paid ? "Оплачен" : "Ожидает оплаты" }}</b>
          </div>

          <hr class="hr" />

          <div class="items">
            <div v-for="i in order.items" :key="i.id" class="itemRow">
              <div class="name">{{ i.title }}</div>
              <div class="right">{{ i.qty }} × {{ i.price }}</div>
              <div class="right price">{{ i.qty * i.price }} MDL</div>
            </div>
          </div>

          <hr class="hr" />

          <div class="totalLine">
            <div>Товары</div>
            <div class="price">{{ order.subtotal }} MDL</div>
          </div>

          <div v-if="order.deliveryType === 'delivery'" class="totalLine">
            <div>Доставка</div>
            <div class="price">{{ order.deliveryFee }} MDL</div>
          </div>

          <div class="totalLine big">
            <div>Итого</div>
            <div class="price">{{ order.total }} MDL</div>
          </div>

          <div class="actions">
            <NuxtLink class="btn btn--primary" to="/menu">Вернуться в меню</NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Заказ оформлен" })

type OrderItem = { id: string; title: string; price: number; qty: number; category?: string }
type Order = {
  id: string
  createdAt: string
  customerName: string
  customerPhone: string
  deliveryType: "pickup" | "delivery"
  deliveryAddress: string
  deliveryDistanceKm: number
  deliveryFee: number
  prepMinutes: number
  readyAt: string
  paymentMethod: "cash" | "card"
  paid: boolean
  comment: string
  subtotal: number
  total: number
  items: OrderItem[]
}

const route = useRoute()
const orderId = computed(() => String(route.query.orderId ?? "").trim())

const pending = ref(false)
const error = ref<any>(null)
const serverOrder = ref<Order | null>(null)

watchEffect(async () => {
  if (!orderId.value) return
  pending.value = true
  error.value = null

  try {
    const res = await $fetch<{ ok: boolean; order: Order }>(`/api/orders/${encodeURIComponent(orderId.value)}`)
    serverOrder.value = res?.order ?? null
  } catch (e) {
    serverOrder.value = null
    error.value = e
  } finally {
    pending.value = false
  }
})

const order = computed(() => serverOrder.value)

const errorText = computed(() => {
  if (order.value) return ""
  if (!orderId.value) return "Нет данных заказа в ссылке."
  const e: any = error.value
  if (!e) return ""
  if (e?.statusCode === 404) return "Заказ не найден."
  return "Ошибка загрузки заказа."
})

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}
function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } catch { return iso }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18
}

.wrap {
  max-width: 980px;
  margin: 0 auto
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, .7);
  border: 1px solid rgba(80, 55, 48, .12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, .1);
  backdrop-filter: blur(10px)
}

.title {
  margin: 0;
  font-size: 28px
}

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, .12);
  background: rgba(255, 255, 255, .6);
  font-weight: 900;
  opacity: .85
}

.box {
  margin-top: 14px;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, .12);
  background: rgba(255, 255, 255, .6)
}

.metaLine {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 800;
  opacity: .9
}

.hr {
  border: none;
  border-top: 1px solid rgba(80, 55, 48, .12);
  margin: 12px 0
}

.items {
  display: grid;
  gap: 8px
}

.itemRow {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, .10);
  background: rgba(255, 255, 255, .65);
  font-weight: 900;
  font-size: 13px
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.right {
  text-align: right
}

.price {
  color: #b24a4a;
  white-space: nowrap
}

.totalLine {
  display: flex;
  justify-content: space-between;
  font-weight: 1000;
  margin-top: 8px
}

.totalLine.big {
  font-size: 16px
}

.actions {
  margin-top: 14px
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 22px;
  font-weight: 900;
  background: rgba(0, 0, 0, .08);
  color: #111;
  text-decoration: none
}

.btn--primary {
  background: #b24a4a;
  color: #fff
}
</style>
