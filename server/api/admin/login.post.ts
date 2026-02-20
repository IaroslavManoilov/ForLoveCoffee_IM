import crypto from "node:crypto"
import { readBody, setCookie, createError } from "h3"

const COOKIE_NAME = "admin_session"

function b64url(buf: Buffer) {
  return buf.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}
function sign(data: string, secret: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest())
}

function makeSessionToken(secret: string, days = 30) {
  const payload = { v: "ok" as const, exp: Date.now() + days * 24 * 60 * 60 * 1000 }
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"))
  const sig = sign(body, secret)
  return `${body}.${sig}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)

  const login = String(body?.login ?? "")
  const password = String(body?.password ?? "")

  const cfg = useRuntimeConfig()
  const adminLogin = String(cfg.ADMIN_LOGIN || "")
  const adminPassword = String(cfg.ADMIN_PASSWORD || "")
  const secret = String(cfg.ADMIN_SECRET || "")

  if (!secret) throw createError({ statusCode: 500, statusMessage: "ADMIN_SECRET is not set" })

  if (login !== adminLogin || password !== adminPassword) {
    throw createError({ statusCode: 401, statusMessage: "Bad credentials" })
  }

  const token = makeSessionToken(secret, 30)

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false, // dev
    maxAge: 60 * 60 * 24 * 30,
  })

  return { ok: true }
})
