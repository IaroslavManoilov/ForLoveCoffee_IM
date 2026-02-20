import { createError } from "h3"
import { getDb } from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
  const id = String(event.context.params?.id || "").trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const { get, all } = await getDb()

  const order = await get(`SELECT * FROM orders WHERE id = ?`, [id])
  if (!order) throw createError({ statusCode: 404, statusMessage: "Order not found" })

  const items = await all(`SELECT * FROM order_items WHERE orderId = ?`, [id])

  return {
    ok: true,
    order: {
      id: String(order.id),
      createdAt: String(order.createdAt),
      customerName: String(order.customerName),
      customerPhone: String(order.customerPhone),
      deliveryType: order.deliveryType === "delivery" ? "delivery" : "pickup",
      deliveryAddress: String(order.deliveryAddress ?? ""),
      deliveryDistanceKm: Number(order.deliveryDistanceKm ?? 0),
      deliveryFee: Number(order.deliveryFee ?? 0),
      prepMinutes: Number(order.prepMinutes ?? 0),
      readyAt: String(order.readyAt),
      paymentMethod: order.paymentMethod === "card" ? "card" : "cash",
      paid: Number(order.paid) === 1,
      changeFrom: order.changeFrom == null ? null : Number(order.changeFrom),
      changeDue: order.changeDue == null ? null : Number(order.changeDue),
      comment: String(order.comment ?? ""),
      subtotal: Number(order.subtotal ?? 0),
      total: Number(order.total ?? 0),
      items: items.map((i: any) => ({
        id: String(i.id),
        title: String(i.title),
        price: Number(i.price),
        qty: Number(i.qty),
        category: i.category ? String(i.category) : undefined,
      })),
    },
  }
})
