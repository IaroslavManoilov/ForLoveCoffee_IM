import { createError } from "h3"
import { getDb } from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
  const id = String(event.context.params?.id || "").trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const { run } = await getDb()

  // paid в Supabase у тебя boolean
  const rows = await run(`UPDATE orders SET paid = true WHERE id = $1 RETURNING id`, [id])

  if (!rows || rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" })
  }

  return { ok: true }
})