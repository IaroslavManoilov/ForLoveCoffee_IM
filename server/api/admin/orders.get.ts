import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { all } = await getDb()

  // В Postgres с camelCase колонками — обязательно "createdAt"
  const orders = await all(
    `SELECT *
     FROM public.orders
     ORDER BY "createdAt" DESC`
  )

  if (!orders.length) return { ok: true, orders: [] }

  const ids = orders.map((o: any) => String(o.id))

  // $1, $2, $3... (а не ?)
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",")

  const items = await all(
    `SELECT *
     FROM public.order_items
     WHERE "orderId" IN (${placeholders})`,
    ids
  )

  const byOrder: Record<string, any[]> = {}
  for (const it of items as any[]) {
    const k = String(it.orderId)
    ;(byOrder[k] ||= []).push({
      id: String(it.id),
      title: String(it.title),
      price: Number(it.price),
      qty: Number(it.qty),
      category: it.category ? String(it.category) : undefined,
    })
  }

  return {
    ok: true,
    orders: (orders as any[]).map((o) => ({
      id: String(o.id),
      createdAt: String(o.createdAt),
      customerName: String(o.customerName),
      customerPhone: String(o.customerPhone),
      deliveryType: o.deliveryType === "delivery" ? "delivery" : "pickup",
      deliveryAddress: String(o.deliveryAddress ?? ""),
      deliveryDistanceKm: Number(o.deliveryDistanceKm ?? 0),
      deliveryFee: Number(o.deliveryFee ?? 0),
      prepMinutes: Number(o.prepMinutes ?? 0),
      readyAt: String(o.readyAt),
      paymentMethod: o.paymentMethod === "card" ? "card" : "cash",
      paid: Boolean(o.paid),
      status: String(o.status ?? "new"), // ✅ если добавил status
      comment: String(o.comment ?? ""),
      subtotal: Number(o.subtotal ?? 0),
      total: Number(o.total ?? 0),
      items: byOrder[String(o.id)] || [],
    })),
  }
})