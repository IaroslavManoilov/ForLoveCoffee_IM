<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <div class="top">
          <div>
            <h1 class="title">Заказы</h1>
            <p class="sub">Серверная база (SQLite) через /api/admin/*</p>
          </div>

          <div class="topActions">
            <button class="btn btn--ghost" type="button" @click="refreshOrders" :disabled="pending">
              {{ pending ? "..." : "Обновить" }}
            </button>

            <button class="btn btn--ghost" type="button" @click="clearAll" :disabled="pending || !orders.length">
              Очистить все
            </button>

            <button class="btn btn--danger" type="button" @click="logout" :disabled="pending">
              Выйти
            </button>
          </div>
        </div>

        <div class="filters">
          <input v-model.trim="filter.q" class="input" placeholder="Поиск: имя / телефон / id" />
          <select v-model="filter.status" class="input">
            <option value="all">Все</option>
            <option value="paid">Оплаченные</option>
            <option value="unpaid">Не оплаченные</option>
          </select>
        </div>

        <p v-if="errorText" class="error">{{ errorText }}</p>

        <div v-if="!orders.length && !pending" class="empty">Пока нет заказов.</div>

        <div v-else class="list">
          <div v-for="o in filtered" :key="o.id" class="item">
            <div class="row">
              <div class="left">
                <div class="id">#{{ o.id }}</div>

                <div class="meta">
                  {{ formatDate(o.createdAt) }} • {{ o.customerName }} • {{ o.customerPhone }}
                </div>

                <div class="meta">
                  Готово через: <b>{{ o.prepMinutes }} мин</b>
                  • Готово к: <b>{{ formatTime(o.readyAt) }}</b>
                  • {{ o.deliveryType === "delivery" ? "Доставка" : "Самовывоз" }}
                  <span v-if="o.deliveryAddress"> • {{ o.deliveryAddress }}</span>
                </div>

                <div v-if="o.deliveryType === 'delivery'" class="meta">
                  Доставка: <b>{{ o.deliveryDistanceKm }} км</b> • <b>{{ o.deliveryFee }} MDL</b>
                </div>

                <div class="meta">
                  Оплата: <b>{{ o.paymentMethod === "cash" ? "Наличные" : "Карта" }}</b>
                </div>

                <div v-if="o.comment" class="meta">
                  Комментарий: <b>{{ o.comment }}</b>
                </div>
              </div>

              <div class="right">
                <div class="sum">{{ o.total }} MDL</div>

                <!-- статус справа -->
                <div class="badge" :data-paid="o.paid">
                  <span class="dot" :data-paid="o.paid"></span>
                  {{ o.paid ? "Оплачен" : "Ожидает оплаты" }}
                </div>
              </div>
            </div>

            <div class="items">
              <div v-for="i in o.items" :key="i.id" class="miniRow">
                <span class="miniName">{{ i.title }}</span>
                <span class="miniMeta">{{ i.qty }}×{{ i.price }}</span>
                <span class="miniPrice">{{ i.qty * i.price }} MDL</span>
              </div>
            </div>

            <div class="actions">
              <button class="btn" :class="o.paid ? 'btn--ok' : 'btn--primary'" type="button" @click="togglePaid(o)"
                :disabled="actionPendingId === o.id">
                <span class="check" :data-on="o.paid">✓</span>
                {{ o.paid ? "Оплачен" : "Отметить “Оплачен”" }}
              </button>

              <NuxtLink class="btn btn--ghost" :to="`/success?orderId=${encodeURIComponent(o.id)}`">
                Открыть чек
              </NuxtLink>

              <button class="btn btn--ghost" type="button" @click="copyReceipt(o)">
                Скопировать чек
              </button>

              <button class="btn btn--danger" type="button" @click="removeOrder(o.id)">
                Удалить
              </button>
            </div>
          </div>
        </div>

        <p v-if="toast" class="toast">{{ toast }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Admin — Orders" })

type OrderItem = { id: string; title: string; price: number; qty: number; category?: string }
type ApiOrder = {
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

const toast = ref("")
function showToast(t: string) {
  toast.value = t
  setTimeout(() => (toast.value = ""), 1500)
}

const actionPendingId = ref("")

const filter = reactive({
  q: "",
  status: "all" as "all" | "paid" | "unpaid",
})

onMounted(async () => {
  try {
    const me = await $fetch<{ ok: boolean }>("/api/admin/me", { credentials: "include" })
    if (!me.ok) navigateTo("/admin/login")
  } catch {
    navigateTo("/admin/login")
  }
})

const { data, pending, error, refresh } = await useFetch<{ ok: boolean; orders: ApiOrder[] }>(
  "/api/admin/orders",
  { server: false, credentials: "include" }
)

const orders = computed(() => data.value?.orders ?? [])

const errorText = computed(() => {
  const e: any = error.value
  if (!e) return ""
  if (e?.statusCode === 401) return "Нет доступа. Перезайди."
  return "Ошибка загрузки заказов."
})

function refreshOrders() {
  refresh()
}

const filtered = computed(() => {
  const q = filter.q.toLowerCase().trim()

  return orders.value.filter((o) => {
    const byStatus =
      filter.status === "all" ? true : filter.status === "paid" ? o.paid : !o.paid

    if (!byStatus) return false
    if (!q) return true

    const hay = `${o.id} ${o.customerName} ${o.customerPhone}`.toLowerCase()
    return hay.includes(q)
  })
})

async function togglePaid(o: ApiOrder) {
  if (actionPendingId.value) return
  actionPendingId.value = o.id

  const next = !o.paid

  try {
    if (next) {
      await $fetch(`/api/admin/orders/${encodeURIComponent(o.id)}/paid`, {
        method: "PATCH",
        credentials: "include",
      })
      showToast("Оплачено ✅")
    } else {
      await $fetch(`/api/admin/orders/${encodeURIComponent(o.id)}/unpaid`, {
        method: "PATCH",
        credentials: "include",
      })
      showToast("Снято с оплаты")
    }

    await refresh() // ✅ перезагрузить список, чтобы UI и фильтры были корректны
  } catch (e: any) {
    showToast(e?.data?.statusMessage || e?.statusMessage || "Ошибка")
  } finally {
    actionPendingId.value = ""
  }
}

async function removeOrder(id: string) {
  await $fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  })
  showToast("Удалено")
  await refresh()
}

async function clearAll() {
  await $fetch(`/api/admin/orders`, {
    method: "DELETE",
    credentials: "include",
  })
  showToast("Очищено")
  await refresh()
}

async function logout() {
  await $fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => null)
  navigateTo("/admin/login")
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

function copyReceipt(o: ApiOrder) {
  const lines: string[] = []
  lines.push(`For Love Coffee — Чек`)
  lines.push(`Заказ: ${o.id}`)
  lines.push(`Дата: ${formatDate(o.createdAt)}`)
  lines.push(`Клиент: ${o.customerName} (${o.customerPhone})`)
  lines.push(`Статус: ${o.paid ? "Оплачен" : "Ожидает оплаты"}`)
  lines.push(`---`)
  for (const i of o.items) lines.push(`${i.title} — ${i.qty}×${i.price} = ${i.qty * i.price} MDL`)
  lines.push(`---`)
  lines.push(`Итого: ${o.total} MDL`)

  navigator.clipboard.writeText(lines.join("\n"))
  showToast("Чек скопирован")
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
}

.wrap {
  max-width: 980px;
  margin: 0 auto;
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 28px;
}

.sub {
  margin: 6px 0 0;
  opacity: 0.75;
}

.topActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
}

.input {
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 12px;
  outline: none;
  font-weight: 700;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.item {
  border-radius: 22px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.id {
  font-weight: 1000;
}

.meta {
  margin-top: 3px;
  font-size: 12px;
  opacity: 0.78;
}

.right {
  text-align: right;
}

.sum {
  font-weight: 1000;
  color: #b24a4a;
}

.badge {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.65);
}

.badge[data-paid="true"] {
  border-color: rgba(56, 134, 86, 0.22);
  background: rgba(56, 134, 86, 0.1);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 8px;
  background: rgba(178, 74, 74, 0.55);
}

.dot[data-paid="true"] {
  background: rgba(56, 134, 86, 0.9);
}

.items {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}

.miniRow {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  font-weight: 800;
  font-size: 12px;
  opacity: 0.92;
}

.miniName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.miniMeta {
  opacity: 0.75;
}

.miniPrice {
  color: #b24a4a;
  white-space: nowrap;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 900;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
}

.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
}

.btn--danger {
  background: rgba(178, 74, 74, 0.14);
  border: 1px solid rgba(178, 74, 74, 0.22);
}

.btn--ok {
  background: rgba(56, 134, 86, 0.14);
  border: 1px solid rgba(56, 134, 86, 0.22);
  color: #1f5a38;
}

.check {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid rgba(80, 55, 48, 0.18);
  background: rgba(255, 255, 255, 0.65);
  font-weight: 1000;
  font-size: 12px;
  opacity: 0.35;
}

.check[data-on="true"] {
  opacity: 1;
  border-color: rgba(56, 134, 86, 0.45);
  background: rgba(56, 134, 86, 0.18);
  color: #1f5a38;
}

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 900;
  opacity: 0.8;
}

.toast {
  margin-top: 12px;
  font-weight: 1000;
  color: #2f7c4c;
}

.error {
  margin-top: 10px;
  font-weight: 900;
  color: #b24a4a;
}

@media (max-width: 860px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
