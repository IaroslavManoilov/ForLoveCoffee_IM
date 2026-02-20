import { defineEventHandler, readBody, createError } from "h3"
import { getDb } from "~~/server/utils/db"

type BookingBody = {
  name: string
  phone: string
  guests: number
  preference?: string
  notes?: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  durationMin?: number
}

function isValidDateISO(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

function isValidTime(s: string) {
  return /^\d{2}:\d{2}$/.test(s)
}

function phoneOk(s: string) {
  const digits = s.replace(/[^\d+]/g, "")
  return digits.length >= 8
}

function safeStr(v: unknown) {
  return String(v ?? "").trim()
}

function genId() {
  // Node 18+ обычно поддерживает crypto.randomUUID()
  // Если вдруг нет — fallback.
  const anyCrypto: any = globalThis.crypto as any
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `B-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as BookingBody

  const name = safeStr(body?.name)
  const phone = safeStr(body?.phone)
  const guests = Number(body?.guests ?? 0)
  const date = safeStr(body?.date)
  const time = safeStr(body?.time)
  const preference = safeStr(body?.preference) || "oricare"
  const notes = safeStr(body?.notes)
  const durationMin = Number(body?.durationMin ?? 90)

  if (name.length < 2) throw createError({ statusCode: 400, statusMessage: "Invalid name" })
  if (!phoneOk(phone)) throw createError({ statusCode: 400, statusMessage: "Invalid phone" })
  if (!Number.isFinite(guests) || guests < 1) throw createError({ statusCode: 400, statusMessage: "Invalid guests" })
  if (!isValidDateISO(date)) throw createError({ statusCode: 400, statusMessage: "Invalid date" })
  if (!isValidTime(time)) throw createError({ statusCode: 400, statusMessage: "Invalid time" })
  if (!Number.isFinite(durationMin) || durationMin < 30 || durationMin > 360)
    throw createError({ statusCode: 400, statusMessage: "Invalid duration" })

  // reservation datetime (как строка, чтобы в админке было понятно)
  const reservationLocal = `${date} ${time}`

  // Важно: твоя админка сортирует по datetime(createdAt)
  // Поэтому createdAt кладём ISO, SQLite datetime() обычно нормально понимает ISO.
  const createdAt = new Date().toISOString()

  // readyAt: чтобы в админке было видно "когда бронь"
  // Лучше хранить именно дату/время брони (в ISO). Это ок, даже если это не "готово к выдаче".
  const readyAt = new Date(`${date}T${time}:00`).toISOString()

  const comment =
    `TABLE_BOOKING | date=${date} time=${time} guests=${guests} duration=${durationMin}min | pref=${preference}` +
    (notes ? ` | notes=${notes}` : "")

  const id = genId()

  const dbAny = await getDb()

  // В разных проектах getDb возвращает по-разному.
  // У тебя в admin коде используется { all }, значит обычно есть и run/get.
  const db = (dbAny as any).db ?? dbAny
  const run = (dbAny as any).run ?? (dbAny as any).exec ?? (db as any).run

  if (typeof run !== "function" || !db) {
    throw createError({ statusCode: 500, statusMessage: "DB helper does not expose run()" })
  }

  // записываем как "order", чтобы /admin/orders увидел
  // deliveryType должен быть "pickup" или "delivery" (у тебя в админке маппится)
  // paymentMethod: "cash" или "card"
  // paid: 0/1
  try {
    await run("BEGIN")

    await run(
      `INSERT INTO orders (
        id,
        createdAt,
        customerName,
        customerPhone,
        deliveryType,
        deliveryAddress,
        deliveryDistanceKm,
        deliveryFee,
        prepMinutes,
        readyAt,
        paymentMethod,
        paid,
        comment,
        subtotal,
        total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        createdAt,
        name,
        phone,
        "pickup",
        "",
        0,
        0,
        0,
        readyAt,
        "cash",
        0,
        comment,
        0,
        0,
      ]
    )

    // добавим один item, чтобы было видно что это бронь
    await run(
      `INSERT INTO order_items (orderId, title, price, qty, category)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        `Table booking • ${guests} pers. • ${reservationLocal}`,
        0,
        1,
        "booking",
      ]
    )

    await run("COMMIT")
  } catch (e) {
    try {
      await run("ROLLBACK")
    } catch {}
    throw createError({ statusCode: 500, statusMessage: "Failed to create booking" })
  }

  return { ok: true, id }
})