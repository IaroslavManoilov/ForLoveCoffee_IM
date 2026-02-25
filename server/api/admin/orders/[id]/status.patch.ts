import { getDb } from "~~/server/utils/db"
import { requireAdmin } from "~~/server/utils/requireAdmin"
import { readBody, createError } from "h3"

const allowed = new Set(["new", "preparing", "ready", "done", "cancelled"])

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing id" })
  }

  const body = await readBody(event)
  const status = body?.status

  if (!allowed.has(status)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid status" })
  }

  const { run } = await getDb()

  await run(
    `UPDATE public.orders SET status = ? WHERE id = ?`,
    [status, id]
  )

  return { ok: true }
})