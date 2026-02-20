import { clearAdminCookie } from "~~/server/utils/requireAdmin"

export default defineEventHandler((event) => {
  clearAdminCookie(event)
  return { ok: true }
})
