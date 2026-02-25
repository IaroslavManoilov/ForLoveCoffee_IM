import { createError, readBody } from "h3"
import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

const ALLOWED = new Set(["new", "preparing", "ready", "delivered", "cancelled"])

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = String(event.context.params?.id || "").trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const body = await readBody<any>(event)
  const status = String(body?.status || "").trim()

  if (!ALLOWED.has(status)) {
    throw createError({ statusCode: 400, statusMessage: "Bad status" })
  }

  const { run, get } = await getDb()

  // $1 / $2 потому что postgres.js
  const updated = await run(
    `UPDATE public.orders
     SET status = $1
     WHERE id = $2
     RETURNING id`,
    [status, id]
  )

  const ok = Array.isArray(updated) && updated.length > 0
  if (!ok) throw createError({ statusCode: 404, statusMessage: "Order not found" })

  // вернуть можно минимум
  const order = await get(`SELECT status FROM public.orders WHERE id = $1`, [id])
  return { ok: true, status: String((order as any)?.status ?? status) }
})