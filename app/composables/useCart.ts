// composables/useCart.ts
import { computed, watch } from "vue"

export type ProductCategory = "coffee" | "drinks" | "crepes"

export type Product = {
  id: string
  title: string
  desc: string
  price: number
  img: string
  tag: string
  category: ProductCategory
}

export type CartItem = Product & { qty: number }

const STORAGE_KEY = "forlove_cart_v1"

export function useCart() {
  const cart = useState<CartItem[]>("cart", () => [])

  // init from localStorage (client only)
  if (import.meta.client && cart.value.length === 0) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) cart.value = JSON.parse(raw)
    } catch {
      // ignore
    }
  }

  const totalQty = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
  const totalPrice = computed(() => cart.value.reduce((s, i) => s + i.qty * i.price, 0))

  function add(p: Product, qty = 1) {
    const found = cart.value.find((x) => x.id === p.id)
    if (found) found.qty += qty
    else cart.value.push({ ...p, qty })
  }

  function remove(id: string) {
    cart.value = cart.value.filter((x) => x.id !== id)
  }

  function inc(id: string) {
    const found = cart.value.find((x) => x.id === id)
    if (found) found.qty++
  }

  function dec(id: string) {
    const found = cart.value.find((x) => x.id === id)
    if (!found) return
    found.qty--
    if (found.qty <= 0) remove(id)
  }

  function clear() {
    cart.value = []
  }

  // persist
  watch(
    cart,
    (v) => {
      if (!import.meta.client) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    },
    { deep: true }
  )

  return { cart, totalQty, totalPrice, add, remove, inc, dec, clear }
}
