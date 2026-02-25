// server/utils/db.ts
import postgres from "postgres"

let _sql: ReturnType<typeof postgres> | null = null

function sql() {
  if (_sql) return _sql
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  _sql = postgres(url, { ssl: "require" })
  return _sql
}

function exec(query: string) {
  return sql().unsafe(query)
}

function all<T = any>(query: string, params: any[] = []) {
  return sql().unsafe<T[]>(query, params)
}

async function get<T = any>(query: string, params: any[] = []) {
  const rows = await sql().unsafe<T[]>(query, params)
  return rows[0] ?? null
}

function run<T = any>(query: string, params: any[] = []) {
  return sql().unsafe<T[]>(query, params)
}

async function transaction<T>(fn: () => Promise<T>) {
  return sql().begin(async (tx) => {
    const prev = _sql
    _sql = tx as any
    try {
      return await fn()
    } finally {
      _sql = prev
    }
  })
}

export async function getDb() {
  sql()
  return { run, exec, all, get, transaction }
}