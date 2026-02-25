import { createError } from "h3"
import { getRouterParam } from "h3"
import { getDb } from "~~/server/utils/db"

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, "id") ?? "").trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" })

  const { transaction, run } = await getDb()

  await transaction(async () => {
    await run(`DELETE FROM order_items WHERE "orderId" = $1`, [id])
    const rows = await run(`DELETE FROM orders WHERE id = $1 RETURNING id`, [id])
    if (!rows || rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Order not found" })
    }
  })

  return { ok: true }
})
