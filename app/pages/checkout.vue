<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <h1 class="title">Оформление заказа</h1>
        <p class="sub">Заполни данные — и мы подготовим заказ.</p>

        <div v-if="!cart.length" class="empty">
          <div class="emptyTitle">Корзина пустая</div>
          <NuxtLink class="btn btn--primary" to="/menu">Вернуться в меню</NuxtLink>
        </div>

        <div v-else class="grid">
          <!-- LEFT -->
          <form class="form" @submit.prevent="submit">
            <label class="field">
              <span class="label">Имя</span>
              <input v-model.trim="form.name" class="input" type="text" placeholder="Алина" />
            </label>

            <label class="field">
              <span class="label">Телефон</span>
              <input v-model.trim="form.phone" class="input" type="tel" placeholder="+373 ..." />
            </label>

            <label class="field">
              <span class="label">Способ</span>
              <select v-model="form.type" class="input">
                <option value="pickup">Самовывоз</option>
                <option value="delivery">Доставка (Кишинёв)</option>
              </select>
            </label>

            <!-- готовность -->
            <div class="readyBox">
              <div class="readyRow">Готово через: <b>{{ prepMinutes }} мин</b></div>
              <div class="readyRow">Готово к: <b>{{ readyTime }}</b></div>
              <div class="hint">
                {{
                  form.type === "delivery"
                    ? "Доставка включает время на дорогу."
                    : "Самовывоз — время приготовления."
                }}
              </div>
            </div>

            <!-- DELIVERY -->
            <template v-if="form.type === 'delivery'">
              <label class="field">
                <span class="label">Адрес (только Кишинёв)</span>
                <input v-model.trim="form.address" class="input" type="text" placeholder="Кишинёв, ул. ... дом ..." />
                <small class="hint">Адрес должен содержать “Кишинев / Chișinău / Chisinau”.</small>
              </label>

              <label class="field">
                <span class="label">Расстояние (км)</span>
                <select v-model.number="form.distanceKm" class="input">
                  <option v-for="n in kmOptions" :key="n" :value="n">{{ n }} км</option>
                </select>
                <small class="hint">Стоимость доставки: 10 MDL за 1 км.</small>
              </label>

              <div class="deliveryBox">
                <div>Доставка: <b>{{ deliveryFee }} MDL</b></div>
                <div class="small">({{ form.distanceKm }} км × 10 MDL)</div>
              </div>
            </template>

            <!-- Оплата -->
            <div class="payBox">
              <div class="payTitle">Оплата</div>

              <label class="radio">
                <input v-model="form.pay" type="radio" value="cash" />
                <span>Наличными при получении</span>
              </label>

              <label class="radio">
                <input v-model="form.pay" type="radio" value="card" />
                <span>Картой при получении</span>
              </label>

              <!-- сдача -->
              <label v-if="form.pay === 'cash'" class="field" style="margin-top: 8px">
                <span class="label">Сдача с (MDL)</span>
                <input v-model.number="form.changeFrom" class="input" type="number" min="0" step="1"
                  placeholder="Например: 200" />
                <small class="hint">Если не нужно — оставь пустым.</small>

                <small v-if="changeDue != null" class="hint">
                  Сдача дать: <b>{{ changeDue }} MDL</b>
                </small>
              </label>
            </div>

            <label class="field">
              <span class="label">Комментарий</span>
              <textarea v-model.trim="form.comment" class="input textarea" rows="3"
                placeholder="Без сахара / позвонить заранее и т.д." />
            </label>

            <div class="actions">
              <NuxtLink class="btn btn--ghost" to="/menu">Назад</NuxtLink>
              <button class="btn btn--primary" type="submit" :disabled="submitting">
                {{ submitting ? "Отправка..." : "Подтвердить заказ" }}
              </button>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
          </form>

          <!-- RIGHT -->
          <aside class="summary">
            <div class="sumTitle">Твой заказ</div>

            <div class="list">
              <div v-for="i in cart" :key="i.id" class="row">
                <div class="rowLeft">
                  <div class="name">{{ i.title }}</div>
                  <div class="meta">{{ i.qty }} × {{ i.price }} MDL</div>
                </div>
                <div class="rowPrice">{{ i.qty * i.price }} MDL</div>
              </div>
            </div>

            <div class="totalLine">
              <div>Товары</div>
              <div class="money">{{ totalPrice }} MDL</div>
            </div>

            <div v-if="form.type === 'delivery'" class="totalLine">
              <div>Доставка</div>
              <div class="money">{{ deliveryFee }} MDL</div>
            </div>

            <div class="total">
              <div>Итого</div>
              <div class="totalPrice">{{ totalWithDelivery }} MDL</div>
            </div>

            <div class="hintBox">
              Готово через <b>{{ prepMinutes }} мин</b> • к <b>{{ readyTime }}</b>
            </div>

            <div v-if="form.pay === 'cash' && changeDue != null" class="hintBox">
              Сдача дать: <b>{{ changeDue }} MDL</b>
            </div>

            <div class="hintBox">
              После подтверждения будет страница <b>“Успешно”</b> с чек-квитанцией.
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCart } from "~/composables/useCart"

useHead({ title: "Оформление — For Love Coffee" })

type OrderItem = { id: string; title: string; price: number; qty: number; category?: string }

type Receipt = {
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
  changeFrom?: number | null
  changeDue?: number | null
  comment: string
  subtotal: number
  total: number
  items: OrderItem[]
}

const router = useRouter()
const { cart, totalPrice, clear } = useCart()

const kmOptions = Array.from({ length: 20 }, (_, i) => i + 1)

const form = reactive({
  name: "",
  phone: "",
  type: "pickup" as "pickup" | "delivery",
  address: "",
  distanceKm: 1,
  pay: "cash" as "cash" | "card",
  changeFrom: null as number | null,
  comment: "",
})

const error = ref("")
const submitting = ref(false)

/** доставка = 10 MDL за км */
const deliveryFee = computed(() => {
  if (form.type !== "delivery") return 0
  const km = Number(form.distanceKm || 0)
  return Math.max(0, Math.ceil(km) * 10)
})

const totalWithDelivery = computed(() => totalPrice.value + deliveryFee.value)

/** есть ли блины (crepes) */
function hasCrepes(items: OrderItem[]) {
  return (items ?? []).some((i) => i.category === "crepes" || (i.id ?? "").startsWith("crepe-"))
}

/** логика приготовления */
function calcPrepMinutes(items: OrderItem[], deliveryType: "pickup" | "delivery") {
  let minutes = 10
  if (hasCrepes(items)) minutes += 10
  if (deliveryType === "delivery") minutes += 20
  return minutes
}

function calcReadyAtIso(prepMinutes: number) {
  const now = new Date()
  const ready = new Date(now.getTime() + prepMinutes * 60_000)
  return ready.toISOString()
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

const prepMinutes = computed(() => calcPrepMinutes(cart.value as OrderItem[], form.type))
const readyAt = computed(() => calcReadyAtIso(prepMinutes.value))
const readyTime = computed(() => formatTime(readyAt.value))

/** сдача */
const changeDue = computed(() => {
  if (form.pay !== "cash") return null
  const from = form.changeFrom
  if (from == null || from <= 0) return null
  const due = from - totalWithDelivery.value
  return due >= 0 ? due : null
})

watch(
  () => form.type,
  () => {
    if (form.type === "delivery" && (!form.distanceKm || form.distanceKm < 1)) form.distanceKm = 1
    if (form.type === "pickup") form.address = ""
  }
)

watch(
  () => [form.distanceKm, form.type],
  () => {
    if (form.type === "delivery" && (!form.distanceKm || form.distanceKm < 1)) form.distanceKm = 1
  }
)

function isChisinauAddress(addr: string) {
  const a = (addr || "").toLowerCase()
  return a.includes("кишин") || a.includes("chisinau") || a.includes("chișinău") || a.includes("chisinău")
}

function validate() {
  if (!form.name) return "Введите имя"
  if (!form.phone) return "Введите телефон"
  if (!form.pay) return "Выберите способ оплаты"

  if (form.type === "delivery") {
    if (!form.address) return "Введите адрес доставки"
    if (!isChisinauAddress(form.address)) return "Доставка только по Кишинёву"
    if (!form.distanceKm || form.distanceKm < 1) return "Выберите расстояние (км)"
  }

  if (form.pay === "cash" && form.changeFrom != null && form.changeFrom > 0) {
    if (form.changeFrom < totalWithDelivery.value) {
      return `Сдача с должна быть ≥ ${totalWithDelivery.value} MDL`
    }
  }

  return ""
}

function encodeReceipt(r: Receipt) {
  // успех-страница у тебя грузится на клиенте (server:false),
  // поэтому btoa/atob подходят
  const json = JSON.stringify(r)
  return btoa(unescape(encodeURIComponent(json)))
}

async function submit() {
  const err = validate()
  if (err) {
    error.value = err
    return
  }

  if (!cart.value.length) {
    error.value = "Корзина пустая"
    return
  }

  error.value = ""
  submitting.value = true

  const payload = {
    customerName: form.name,
    customerPhone: form.phone,

    deliveryType: form.type,
    deliveryAddress: form.type === "delivery" ? form.address : "",
    deliveryDistanceKm: form.type === "delivery" ? Number(form.distanceKm) : 0,
    deliveryFee: deliveryFee.value,

    prepMinutes: prepMinutes.value,
    readyAt: readyAt.value,

    paymentMethod: form.pay,
    changeFrom: form.pay === "cash" ? form.changeFrom : null,
    changeDue: form.pay === "cash" ? changeDue.value : null,

    comment: form.comment,
    items: cart.value,
  }

  try {
    const res = await $fetch<{ ok: boolean; id: string }>("/api/orders", {
      method: "POST",
      body: payload,
    })

    if (!res?.ok || !res?.id) throw new Error("Bad response")

    // ✅ делаем чек сразу и передаём в /success как fallback
    const receipt: Receipt = {
      id: res.id,
      createdAt: new Date().toISOString(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress,
      deliveryDistanceKm: payload.deliveryDistanceKm,
      deliveryFee: payload.deliveryFee,
      prepMinutes: payload.prepMinutes,
      readyAt: payload.readyAt,
      paymentMethod: payload.paymentMethod,
      paid: false,
      changeFrom: payload.changeFrom,
      changeDue: payload.changeDue,
      comment: payload.comment,
      subtotal: totalPrice.value,
      total: totalWithDelivery.value,
      items: (payload.items as any[]).map((x) => ({
        id: x.id,
        title: x.title,
        price: x.price,
        qty: x.qty,
        category: x.category,
      })),
    }

    const receipt64 = encodeReceipt(receipt)

    clear()
    await router.push({
      path: "/success",
      query: {
        orderId: res.id,
        receipt: receipt64,
      },
    })
  } catch {
    error.value = "Ошибка при оформлении заказа. Попробуй ещё раз."
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* ✅ оставляю твой CSS как есть */
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

.title {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.02em;
}

.sub {
  margin: 8px 0 0;
  opacity: 0.8;
}

.grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 14px;
}

.form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-weight: 900;
  font-size: 13px;
  opacity: 0.85;
}

.input {
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.14);
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 12px;
  outline: none;
  font-weight: 700;
}

.textarea {
  resize: vertical;
}

.actions {
  margin-top: 6px;
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
  padding: 14px 22px;
  font-weight: 800;
  font-size: 15px;
  transition: transform 0.15s ease, background 0.15s ease;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn--primary {
  background: #b24a4a;
  color: #fff;
}

.btn--ghost {
  background: rgba(163, 147, 147, 0.08);
}

.summary {
  border-radius: 22px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.55);
  height: fit-content;
}

.sumTitle {
  font-weight: 1000;
}

.list {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.6);
}

.name {
  font-weight: 1000;
}

.meta {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
}

.rowPrice {
  font-weight: 1000;
  color: #b24a4a;
  white-space: nowrap;
}

.totalLine {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-weight: 1000;
  opacity: 0.9;
}

.money {
  color: #b24a4a;
}

.total {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  border-radius: 16px;
  background: rgba(178, 74, 74, 0.08);
  border: 1px solid rgba(178, 74, 74, 0.16);
  font-weight: 1000;
}

.totalPrice {
  color: #b24a4a;
}

.error {
  margin: 0;
  color: #b24a4a;
  font-weight: 900;
}

.hint {
  font-size: 12px;
  opacity: 0.7;
}

.hintBox {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.75;
  line-height: 1.4;
  border-radius: 16px;
  padding: 10px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.6);
}

.payBox {
  border-radius: 18px;
  padding: 12px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}

.payTitle {
  font-weight: 1000;
  margin-bottom: 8px;
}

.radio {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px;
  border-radius: 12px;
  font-weight: 800;
}

.radio input {
  transform: scale(1.1);
}

.deliveryBox {
  margin-top: 6px;
  border-radius: 16px;
  padding: 10px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 900;
}

.small {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 2px;
}

.readyBox {
  border-radius: 18px;
  padding: 12px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}

.readyRow {
  font-weight: 900;
}

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}

.emptyTitle {
  font-weight: 1000;
  margin-bottom: 10px;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>