import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { all } = await getDb()

  const orders = await all(`SELECT * FROM orders ORDER BY datetime(createdAt) DESC`)
  if (!orders.length) return { ok: true, orders: [] }

  const ids = orders.map((o: any) => o.id)
  const placeholders = ids.map(() => "?").join(",")

  const items = await all(
    `SELECT * FROM order_items WHERE orderId IN (${placeholders})`,
    ids
  )

  const byOrder: Record<string, any[]> = {}
  for (const it of items) {
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
    orders: orders.map((o: any) => ({
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
      paid: Number(o.paid) === 1,
      comment: String(o.comment ?? ""),
      subtotal: Number(o.subtotal ?? 0),
      total: Number(o.total ?? 0),
      items: byOrder[String(o.id)] || [],
    })),
  }



});

