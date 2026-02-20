import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const { get, all } = await getDb()

  const summaryRow = await get(`
    SELECT
      COUNT(*) as ordersCount,
      COALESCE(SUM(total), 0) as revenue,
      COALESCE(SUM(CASE WHEN paid = 1 THEN total ELSE 0 END), 0) as paidRevenue,
      COALESCE(SUM(CASE WHEN paid = 0 THEN total ELSE 0 END), 0) as unpaidRevenue
    FROM orders
  `)

  const topItems = await all(`
    SELECT
      title,
      COALESCE(SUM(qty), 0) as qty,
      COALESCE(SUM(qty * price), 0) as sum
    FROM order_items
    GROUP BY title
    ORDER BY sum DESC
    LIMIT 20
  `)

  return {
    ok: true,
    summary: {
      ordersCount: Number(summaryRow?.ordersCount ?? 0),
      revenue: Number(summaryRow?.revenue ?? 0),
      paidRevenue: Number(summaryRow?.paidRevenue ?? 0),
      unpaidRevenue: Number(summaryRow?.unpaidRevenue ?? 0),
    },
    topItems: topItems.map((t: any) => ({
      title: String(t.title),
      qty: Number(t.qty),
      sum: Number(t.sum),
    })),
  }
})
