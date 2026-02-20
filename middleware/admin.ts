type AdminAuth = { v: "ok"; exp: number }

function getAuth(): AdminAuth | null {
  try {
    const raw = localStorage.getItem("admin_auth")
    if (!raw) return null
    const data = JSON.parse(raw) as AdminAuth
    if (data?.v !== "ok" || typeof data.exp !== "number") return null
    if (Date.now() > data.exp) {
      localStorage.removeItem("admin_auth")
      return null
    }
    return data
  } catch {
    localStorage.removeItem("admin_auth")
    return null
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const isAdmin = to.path.startsWith("/admin")
  if (!isAdmin) return

  // чтобы не дергать API по кругу при навигации:
  // можно кешировать в памяти на 2-5 сек, но пока без усложнений.
  const me = await $fetch<{ ok: boolean }>("/api/admin/me").catch(() => ({ ok: false }))

  if (!me.ok && to.path !== "/admin/login") {
    return navigateTo("/admin/login")
  }

  if (me.ok && to.path === "/admin/login") {
    return navigateTo("/admin/orders")
  }
})
