import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const { run } = await getDb()

  await run(`DELETE FROM order_items`)
  await run(`DELETE FROM orders`)

  return { ok: true }
})
