<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <header class="header">
          <div class="hLeft">
            <h1 class="title">Заказы</h1>
            <p class="sub">PostgreSQL (Supabase) через /api/admin/*</p>
          </div>

          <div class="hRight">
            <button class="btn btn--ghost" type="button" @click="refreshOrders" :disabled="pending">
              {{ pending ? "..." : "Обновить" }}
            </button>

            <button class="btn btn--ghost" type="button" @click="clearAll" :disabled="pending || !orders.length">
              Очистить всё
            </button>

            <button class="btn btn--danger" type="button" @click="logout" :disabled="pending">
              Выйти
            </button>
          </div>
        </header>

        <div class="filters">
          <input v-model.trim="filter.q" class="input" placeholder="Поиск: имя / телефон / id" />

          <select v-model="filter.pay" class="input">
            <option value="all">Все оплаты</option>
            <option value="paid">Оплаченные</option>
            <option value="unpaid">Не оплаченные</option>
          </select>

          <select v-model="filter.status" class="input">
            <option value="all">Все статусы</option>
            <option v-for="s in STATUS_ORDER" :key="s" :value="s">
              {{ STATUS_LABEL[s] }}
            </option>
          </select>
        </div>

        <p v-if="errorText" class="error">{{ errorText }}</p>

        <div v-if="!filtered.length && !pending" class="empty">
          Пока нет заказов.
        </div>

        <div v-else class="list">
          <article v-for="o in filtered" :key="o.id" class="order" :data-open="openId === o.id">
            <div class="orderTop" @click="toggleOpen(o.id)" role="button" tabindex="0">
              <div class="topMain">
                <div class="idRow">
                  <span class="id">#{{ shortId(o.id) }}</span>
                  <span class="time">{{ formatDate(o.createdAt) }}</span>
                </div>

                <div class="who">
                  <span class="name">{{ o.customerName }}</span>
                  <span class="phone">{{ o.customerPhone }}</span>
                </div>

                <div class="meta">
                  <span class="pill" :data-kind="o.deliveryType">
                    {{ o.deliveryType === "delivery" ? "Доставка" : "Самовывоз" }}
                  </span>

                  <span class="pill">
                    Готово за <b>{{ o.prepMinutes }} мин</b> • к <b>{{ formatTime(o.readyAt) }}</b>
                  </span>

                  <span class="pill">
                    {{ o.paymentMethod === "cash" ? "Наличные" : "Карта" }}
                  </span>

                  <span v-if="o.deliveryType === 'delivery'" class="pill">
                    {{ o.deliveryDistanceKm }} км • {{ o.deliveryFee }} MDL
                  </span>

                  <span v-if="o.deliveryAddress && o.deliveryType === 'delivery'" class="pill pill--addr">
                    {{ o.deliveryAddress }}
                  </span>
                </div>

                <div v-if="o.comment" class="comment">
                  <span class="commentLabel">Комментарий:</span> {{ o.comment }}
                </div>
              </div>

              <div class="topSide">
                <div class="total">{{ o.total }} MDL</div>

                <div class="badges">
                  <span class="badge" :data-paid="String(o.paid)">
                    <span class="dot" :data-paid="String(o.paid)"></span>
                    {{ o.paid ? "Оплачен" : "Не оплачен" }}
                  </span>

                  <span class="badge" :data-status="o.status">
                    <span class="dot" :data-status="o.status"></span>
                    {{ statusLabel(o.status) }}
                  </span>
                </div>

                <div class="chev" aria-hidden="true">
                  <span>{{ openId === o.id ? "▲" : "▼" }}</span>
                </div>
              </div>
            </div>

            <div v-if="openId === o.id" class="orderBody">
              <div class="items">
                <div v-for="i in o.items" :key="i.id" class="itemRow">
                  <div class="iName">{{ i.title }}</div>
                  <div class="iQty">{{ i.qty }}×{{ i.price }}</div>
                  <div class="iSum">{{ i.qty * i.price }} MDL</div>
                </div>
              </div>

              <div class="actions">
                <!-- Оплата -->
                <button class="btn" :class="o.paid ? 'btn--ok' : 'btn--primary'" type="button"
                  @click.stop="togglePaid(o)" :disabled="actionPendingId === o.id">
                  {{ o.paid ? "Снять оплату" : "Отметить оплачен" }}
                </button>

                <!-- Статус -->
                <div class="statusBox" @click.stop>
                  <label class="statusLabel">Статус</label>
                  <select class="statusSelect" :value="o.status"
                    @change="onStatusChange(o, ($event.target as HTMLSelectElement).value)"
                    :disabled="actionPendingId === o.id">
                    <option v-for="s in STATUS_ORDER" :key="s" :value="s">
                      {{ STATUS_LABEL[s] }}
                    </option>
                  </select>
                </div>

                <!-- Чек -->
                <NuxtLink class="btn btn--ghost" :to="`/success?orderId=${encodeURIComponent(o.id)}`" @click.stop>
                  Открыть чек
                </NuxtLink>

                <button class="btn btn--ghost" type="button" @click.stop="copyReceipt(o)">
                  Скопировать чек
                </button>

                <button class="btn btn--danger" type="button" @click.stop="removeOrder(o.id)">
                  Удалить
                </button>
              </div>
            </div>
          </article>
        </div>

        <p v-if="toast" class="toast">{{ toast }}</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Admin — Orders" })

type OrderItem = { id: string; title: string; price: number; qty: number; category?: string }

type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled"

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
  status: OrderStatus
  comment: string
  subtotal: number
  total: number
  items: OrderItem[]
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "Новый",
  preparing: "Готовим",
  ready: "Готов",
  delivered: "Выдан",
  cancelled: "Отменён",
}

const STATUS_ORDER: OrderStatus[] = ["new", "preparing", "ready", "delivered", "cancelled"]

function statusLabel(s: any) {
  return STATUS_LABEL[s as OrderStatus] || "Новый"
}

const toast = ref("")
function showToast(t: string) {
  toast.value = t
  setTimeout(() => (toast.value = ""), 1600)
}

const actionPendingId = ref("")
const openId = ref<string>("")

const filter = reactive({
  q: "",
  pay: "all" as "all" | "paid" | "unpaid",
  status: "all" as "all" | OrderStatus,
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
  return e?.data?.statusMessage || e?.statusMessage || "Ошибка загрузки заказов."
})

function refreshOrders() {
  refresh()
}

const filtered = computed(() => {
  const q = filter.q.toLowerCase().trim()

  return orders.value.filter((o) => {
    const payOk =
      filter.pay === "all" ? true : filter.pay === "paid" ? o.paid : !o.paid

    const stOk =
      filter.status === "all" ? true : o.status === filter.status

    if (!payOk || !stOk) return false
    if (!q) return true

    const hay = `${o.id} ${o.customerName} ${o.customerPhone}`.toLowerCase()
    return hay.includes(q)
  })
})

function toggleOpen(id: string) {
  openId.value = openId.value === id ? "" : id
}

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
    await refresh()
  } catch (e: any) {
    showToast(e?.data?.statusMessage || e?.statusMessage || "Ошибка")
  } finally {
    actionPendingId.value = ""
  }
}

async function onStatusChange(o: ApiOrder, next: string) {
  const s = next as any
  if (o.status === s) return
  if (actionPendingId.value) return
  actionPendingId.value = o.id

  try {
    await $fetch(`/api/admin/orders/${encodeURIComponent(o.id)}/status`, {
      method: "PATCH",
      credentials: "include",
      body: { status: s },
    })
    showToast(`Статус: ${statusLabel(s)}`)
    await refresh()
  } catch (e: any) {
    showToast(e?.data?.statusMessage || e?.statusMessage || "Ошибка статуса")
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
    return new Date(iso).toLocaleString([], { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
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

function shortId(id: string) {
  // чтобы не занимало полэкрана
  if (!id) return ""
  return id.length > 8 ? id.slice(0, 8) : id
}

function copyReceipt(o: ApiOrder) {
  const lines: string[] = []
  lines.push(`For Love Coffee — Чек`)
  lines.push(`Заказ: ${o.id}`)
  lines.push(`Дата: ${formatDate(o.createdAt)}`)
  lines.push(`Клиент: ${o.customerName} (${o.customerPhone})`)
  lines.push(`Оплата: ${o.paid ? "Оплачен" : "Не оплачен"}`)
  lines.push(`Статус: ${statusLabel(o.status)}`)
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
  padding: 92px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #1f1614;
  background: #f6f0ec;
}

.wrap {
  max-width: 1080px;
  margin: 0 auto;
}

.card {
  border-radius: 22px;
  padding: 18px;
  background: #fff;
  border: 1px solid rgba(40, 20, 15, 0.10);
  box-shadow: 0 18px 50px rgba(20, 12, 10, 0.12);
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
}

.sub {
  margin: 6px 0 0;
  color: rgba(31, 22, 20, 0.75);
  font-weight: 700;
}

.hRight {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 220px 220px;
  gap: 10px;
}

.input {
  border-radius: 14px;
  border: 1px solid rgba(40, 20, 15, 0.18);
  background: #fff;
  padding: 12px 12px;
  outline: none;
  font-weight: 800;
  color: #1f1614;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.order {
  border-radius: 18px;
  border: 1px solid rgba(40, 20, 15, 0.14);
  background: #fff;
  overflow: hidden;
}

.orderTop {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
}

.topMain {
  min-width: 0;
}

.idRow {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.id {
  font-weight: 1000;
  letter-spacing: 0.2px;
}

.time {
  color: rgba(31, 22, 20, 0.65);
  font-weight: 800;
  font-size: 12px;
}

.who {
  margin-top: 6px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.name {
  font-weight: 1000;
}

.phone {
  color: rgba(31, 22, 20, 0.75);
  font-weight: 800;
}

.meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(40, 20, 15, 0.14);
  background: rgba(246, 240, 236, 0.6);
  font-weight: 900;
  font-size: 12px;
  color: #1f1614;
}

.pill[data-kind="delivery"] {
  border-color: rgba(178, 74, 74, 0.25);
  background: rgba(178, 74, 74, 0.10);
}

.pill--addr {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(40, 20, 15, 0.12);
  background: #faf7f5;
  font-weight: 800;
}

.commentLabel {
  font-weight: 1000;
}

.topSide {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.total {
  font-weight: 1100;
  font-size: 18px;
  color: #b24a4a;
}

.badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(40, 20, 15, 0.14);
  background: #fff;
  font-weight: 1000;
  font-size: 12px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #999;
}

/* paid */
.badge[data-paid="true"] {
  border-color: rgba(32, 120, 72, 0.30);
  background: rgba(32, 120, 72, 0.10);
}

.dot[data-paid="true"] {
  background: rgba(32, 120, 72, 0.95);
}

.dot[data-paid="false"] {
  background: rgba(178, 74, 74, 0.95);
}

/* status colors */
.badge[data-status="new"] {
  background: rgba(35, 86, 190, 0.10);
  border-color: rgba(35, 86, 190, 0.28);
}

.dot[data-status="new"] {
  background: rgba(35, 86, 190, 0.95);
}

.badge[data-status="preparing"] {
  background: rgba(184, 120, 24, 0.10);
  border-color: rgba(184, 120, 24, 0.28);
}

.dot[data-status="preparing"] {
  background: rgba(184, 120, 24, 0.95);
}

.badge[data-status="ready"] {
  background: rgba(32, 120, 72, 0.10);
  border-color: rgba(32, 120, 72, 0.28);
}

.dot[data-status="ready"] {
  background: rgba(32, 120, 72, 0.95);
}

.badge[data-status="delivered"] {
  background: rgba(18, 18, 18, 0.08);
  border-color: rgba(18, 18, 18, 0.18);
}

.dot[data-status="delivered"] {
  background: rgba(18, 18, 18, 0.75);
}

.badge[data-status="cancelled"] {
  background: rgba(178, 74, 74, 0.10);
  border-color: rgba(178, 74, 74, 0.28);
}

.dot[data-status="cancelled"] {
  background: rgba(178, 74, 74, 0.95);
}

.chev {
  color: rgba(31, 22, 20, 0.65);
  font-weight: 1000;
}

.orderBody {
  border-top: 1px solid rgba(40, 20, 15, 0.12);
  padding: 14px;
  background: #faf7f5;
}

.items {
  display: grid;
  gap: 8px;
}

.itemRow {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(40, 20, 15, 0.10);
  font-weight: 900;
}

.iName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.iQty {
  color: rgba(31, 22, 20, 0.70);
}

.iSum {
  color: #b24a4a;
  white-space: nowrap;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.btn {
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 1000;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.06);
  color: #1f1614;
  text-decoration: none;
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
}

.btn--ghost {
  background: rgba(31, 22, 20, 0.06);
}

.btn--danger {
  background: rgba(178, 74, 74, 0.14);
  border: 1px solid rgba(178, 74, 74, 0.28);
}

.btn--ok {
  background: rgba(32, 120, 72, 0.14);
  border: 1px solid rgba(32, 120, 72, 0.28);
  color: #165a34;
}

.statusBox {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(40, 20, 15, 0.14);
  background: #fff;
}

.statusLabel {
  font-size: 11px;
  font-weight: 1000;
  color: rgba(31, 22, 20, 0.70);
}

.statusSelect {
  border-radius: 12px;
  border: 1px solid rgba(40, 20, 15, 0.18);
  padding: 10px 10px;
  font-weight: 1000;
  outline: none;
}

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(40, 20, 15, 0.12);
  background: #faf7f5;
  font-weight: 1000;
}

.toast {
  margin-top: 12px;
  font-weight: 1000;
  color: #165a34;
}

.error {
  margin-top: 10px;
  font-weight: 1000;
  color: #b24a4a;
}

@media (max-width: 980px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .orderTop {
    grid-template-columns: 1fr;
  }

  .topSide {
    align-items: flex-start;
  }

  .badges {
    align-items: flex-start;
  }
}
</style>