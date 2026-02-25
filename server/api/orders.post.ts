import { createError, readBody } from "h3"
import crypto from "node:crypto"
import { getDb } from "~~/server/utils/db"

type OrderItem = { id: string; title: string; price: number; qty: number; category?: string }

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
  }

  const body = await readBody<any>(event)

  const customerName = String(body?.customerName ?? "").trim()
  const customerPhone = String(body?.customerPhone ?? "").trim()

  const deliveryType = body?.deliveryType === "delivery" ? "delivery" : "pickup"
  const deliveryAddress = String(body?.deliveryAddress ?? "")
  const deliveryDistanceKm = Number(body?.deliveryDistanceKm ?? 0)
  const deliveryFee = Number(body?.deliveryFee ?? 0)

  const prepMinutes = Number(body?.prepMinutes ?? 0)
  const readyAt = String(body?.readyAt ?? "")

  const paymentMethod = body?.paymentMethod === "card" ? "card" : "cash"
  const changeFrom = body?.changeFrom == null ? null : Number(body.changeFrom)
  const changeDue = body?.changeDue == null ? null : Number(body.changeDue)

  const comment = String(body?.comment ?? "")
  const items: OrderItem[] = Array.isArray(body?.items) ? body.items : []

  if (!customerName) throw createError({ statusCode: 400, statusMessage: "Missing customerName" })
  if (!customerPhone) throw createError({ statusCode: 400, statusMessage: "Missing customerPhone" })
  if (!items.length) throw createError({ statusCode: 400, statusMessage: "Cart is empty" })
  if (!readyAt) throw createError({ statusCode: 400, statusMessage: "Missing readyAt" })
  if (!Number.isFinite(prepMinutes) || prepMinutes <= 0) {
    throw createError({ statusCode: 400, statusMessage: "Bad prepMinutes" })
  }

  const normalized = items.map((i) => ({
    id: String(i.id),
    title: String(i.title),
    price: Number(i.price),
    qty: Number(i.qty),
    category: i.category ? String(i.category) : null,
  }))

  for (const i of normalized) {
    if (!i.id || !i.title) throw createError({ statusCode: 400, statusMessage: "Bad item" })
    if (!Number.isFinite(i.price) || i.price < 0) throw createError({ statusCode: 400, statusMessage: "Bad item price" })
    if (!Number.isFinite(i.qty) || i.qty <= 0) throw createError({ statusCode: 400, statusMessage: "Bad item qty" })
  }

  const subtotal = normalized.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + (deliveryType === "delivery" ? deliveryFee : 0)

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  const { run, transaction } = await getDb()

  await transaction(async () => {
    await run(
      `INSERT INTO orders (
        id, "createdAt",
        "customerName", "customerPhone",
        "deliveryType", "deliveryAddress", "deliveryDistanceKm", "deliveryFee",
        "prepMinutes", "readyAt",
        "paymentMethod", paid,
        "changeFrom", "changeDue",
        comment, subtotal, total
      ) VALUES (
        $1,$2,
        $3,$4,
        $5,$6,$7,$8,
        $9,$10,
        $11,$12,
        $13,$14,
        $15,$16,$17
      )`,
      [
        id,
        createdAt,
        customerName,
        customerPhone,
        deliveryType,
        deliveryAddress || "",
        Math.round(deliveryDistanceKm),
        Math.round(deliveryFee),
        Math.round(prepMinutes),
        readyAt,
        paymentMethod,
        false,
        changeFrom == null ? null : Math.round(changeFrom),
        changeDue == null ? null : Math.round(changeDue),
        comment || "",
        Math.round(subtotal),
        Math.round(total),
      ]
    )

    for (const i of normalized) {
      await run(
        `INSERT INTO order_items ("orderId", id, title, price, qty, category)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, i.id, i.title, Math.round(i.price), Math.round(i.qty), i.category]
      )
    }
  })

  return { ok: true, id }
})