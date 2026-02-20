import { createError } from "h3"
import { getDb } from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
  const id = String(event.context.params?.id || "").trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const { get, all } = await getDb()

  const order = await get(`SELECT * FROM orders WHERE id = ?`, [id])
  if (!order) throw createError({ statusCode: 404, statusMessage: "Order not found" })

  const items = await all(`SELECT * FROM order_items WHERE "orderId" = ?`, [id])

  return {
    ok: true,
    order: {
      id: String((order as any).id),
      createdAt: String((order as any).createdAt),
      customerName: String((order as any).customerName),
      customerPhone: String((order as any).customerPhone),
      deliveryType: (order as any).deliveryType === "delivery" ? "delivery" : "pickup",
      deliveryAddress: String((order as any).deliveryAddress ?? ""),
      deliveryDistanceKm: Number((order as any).deliveryDistanceKm ?? 0),
      deliveryFee: Number((order as any).deliveryFee ?? 0),
      prepMinutes: Number((order as any).prepMinutes ?? 0),
      readyAt: String((order as any).readyAt),
      paymentMethod: (order as any).paymentMethod === "card" ? "card" : "cash",
      paid: Boolean((order as any).paid) || Number((order as any).paid) === 1,
      changeFrom: (order as any).changeFrom == null ? null : Number((order as any).changeFrom),
      changeDue: (order as any).changeDue == null ? null : Number((order as any).changeDue),
      comment: String((order as any).comment ?? ""),
      subtotal: Number((order as any).subtotal ?? 0),
      total: Number((order as any).total ?? 0),
      items: (items as any[]).map((i) => ({
        id: String(i.id),
        title: String(i.title),
        price: Number(i.price),
        qty: Number(i.qty),
        category: i.category ? String(i.category) : undefined,
      })),
    },
  }
})