import { createError } from "h3"
import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  if (event.method !== "PATCH") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
  }

  const id = String(event.context.params?.id || "")
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const { run } = await getDb()
  const res = await run(`UPDATE orders SET paid = 1 WHERE id = ?`, [id])

  if (!res.changes) throw createError({ statusCode: 404, statusMessage: "Order not found" })
  return { ok: true }
})
