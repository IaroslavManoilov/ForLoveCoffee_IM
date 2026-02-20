import crypto from "node:crypto"
import { getCookie, createError, H3Event } from "h3"

const COOKIE_NAME = "admin_session"

type SessionPayload = { v: "ok"; exp: number }

function b64url(buf: Buffer) {
  return buf.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}
function b64urlDecode(s: string) {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : ""
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/") + pad
  return Buffer.from(b64, "base64")
}
function sign(data: string, secret: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest())
}

function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const [body, sig] = (token || "").split(".")
  if (!body || !sig) return null

  const expected = sign(body, secret)

  const a = Buffer.from(sig, "utf8")
  const b = Buffer.from(expected, "utf8")
  const len = Math.max(a.length, b.length)
  const ap = Buffer.concat([a, Buffer.alloc(len - a.length)])
  const bp = Buffer.concat([b, Buffer.alloc(len - b.length)])

  if (!crypto.timingSafeEqual(ap, bp) || a.length !== b.length) return null

  try {
    const json = b64urlDecode(body).toString("utf8")
    const data = JSON.parse(json) as SessionPayload
    if (data?.v !== "ok" || typeof data.exp !== "number") return null
    if (Date.now() > data.exp) return null
    return data
  } catch {
    return null
  }
}

export function requireAdmin(event: H3Event) {
  const cfg = useRuntimeConfig()
  const secret = String(cfg.ADMIN_SECRET || "")
  if (!secret) throw createError({ statusCode: 500, statusMessage: "ADMIN_SECRET is not set" })

  const token = getCookie(event, COOKIE_NAME) || ""
  const ok = verifySessionToken(token, secret)
  if (!ok) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  return ok
}

export function clearAdminCookie(event: H3Event) {
  // чтобы logout работал и в dev
  event.node.res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  )
}
