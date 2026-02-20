// server/api/admin/orders/[id].delete.ts
import { getRouterParam } from "h3"
import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = String(getRouterParam(event, "id") ?? "")
  const { run } = await getDb()

  await run(`DELETE FROM order_items WHERE orderId = ?`, [id])
  await run(`DELETE FROM orders WHERE id = ?`, [id])

  return { ok: true }
})
