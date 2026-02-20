<template>
  <div class="page">
    <main class="wrap">
      <section class="card">
        <div class="top">
          <div>
            <h1 class="title">Аналитика</h1>
            <p class="sub">Сводка по заказам (SQLite / сервер).</p>
          </div>

          <div class="topActions">
            <NuxtLink class="btn btn--ghost" to="/admin/orders">Заказы</NuxtLink>
                       <button class="btn btn--ghost" type="button" @click="refreshStats">Обновить</button>

          
            <button class="btn btn--ghost" type="button" @click="logout">Выйти</button>
          </div>
        </div>

        <div v-if="pending" class="empty">Загрузка…</div>

        <div v-else-if="errorText" class="empty">
          {{ errorText }}
        </div>

        <template v-else>
          <div class="grid">
            <div class="kpi">
              <div class="kpiLabel">Заказов</div>
              <div class="kpiValue">{{ stats?.summary.ordersCount ?? 0 }}</div>
            </div>

            <div class="kpi">
              <div class="kpiLabel">Выручка (всего)</div>
              <div class="kpiValue">{{ money(stats?.summary.revenue) }}</div>
            </div>

            <div class="kpi">
              <div class="kpiLabel">Оплачено</div>
              <div class="kpiValue">{{ money(stats?.summary.paidRevenue) }}</div>
            </div>

            <div class="kpi">
              <div class="kpiLabel">Ожидает оплаты</div>
              <div class="kpiValue">{{ money(stats?.summary.unpaidRevenue) }}</div>
            </div>
          </div>

          <div class="block">
            <div class="blockTitle">Топ товаров</div>

            <div v-if="!stats?.topItems?.length" class="emptyMini">
              Пока нет данных.
            </div>

            <div v-else class="table">
              <div class="thead">
                <div>Товар</div>
                <div class="right">Кол-во</div>
                <div class="right">Сумма</div>
              </div>

              <div v-for="t in stats.topItems" :key="t.title" class="trow">
                <div class="name">{{ t.title }}</div>
                <div class="right">{{ t.qty }}</div>
                <div class="right price">{{ money(t.sum) }}</div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Admin — Analytics" })

type Stats = {
    ok: boolean
    summary: {
        ordersCount: number
        revenue: number
        paidRevenue: number
        unpaidRevenue: number
    }
    topItems: Array<{ title: string; qty: number; sum: number }>
}

const { data, pending, error, refresh } = await useFetch<Stats>("/api/admin/stats", {
    server: false,
})

const stats = computed(() => data.value || null)

const errorText = computed(() => {
    const e: any = error.value
    if (!e) return ""
    if (e?.statusCode === 401) return "Нет доступа. Перезайди в админку."
    return "Ошибка загрузки аналитики."
})

function refreshStats() {
    refresh()
}

function money(v?: number | null) {
    const n = Number(v ?? 0)
    return `${n} MDL`
}

async function logout() {
    await $fetch("/api/admin/logout", { method: "POST" }).catch(() => null)
    navigateTo("/admin/login")
}
</script>


<style scoped>
.page {
  min-height: 100vh;
  padding: 90px 18px 64px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #241b18;
}

.wrap {
  max-width: 980px;
  margin: 0 auto;
}

.card {
  border-radius: 26px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(80, 55, 48, 0.12);
  box-shadow: 0 18px 50px rgba(32, 18, 14, 0.1);
  backdrop-filter: blur(10px);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 28px;
}

.sub {
  margin: 6px 0 0;
  opacity: 0.75;
}

.topActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 900;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.08);
  color: #111;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn--ghost { background: rgba(163, 147, 147, 0.08); }

.empty {
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 900;
  opacity: 0.85;
}

.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi {
  border-radius: 18px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.kpiLabel {
  font-weight: 900;
  font-size: 12px;
  opacity: 0.75;
}
.kpiValue {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 1000;
  color: #b24a4a;
}

.block {
  margin-top: 14px;
  border-radius: 22px;
  padding: 14px;
  border: 1px solid rgba(80, 55, 48, 0.12);
  background: rgba(255, 255, 255, 0.6);
}
.blockTitle {
  font-weight: 1000;
}

.table {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}
.thead, .trow {
  display: grid;
  grid-template-columns: 1fr 110px 140px;
  gap: 10px;
  align-items: center;
}
.thead {
  font-weight: 1000;
  font-size: 12px;
  opacity: 0.75;
  padding: 8px 10px;
}
.trow {
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(80, 55, 48, 0.10);
  background: rgba(255, 255, 255, 0.65);
  font-weight: 900;
  font-size: 13px;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right { text-align: right; }
.price { color: #b24a4a; }

.emptyMini {
  margin-top: 10px;
  font-weight: 900;
  opacity: 0.8;
}

@media (max-width: 980px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .grid { grid-template-columns: 1fr; }
  .thead, .trow { grid-template-columns: 1fr 90px 110px; }
}
</style>
