// server/utils/db.ts
import sqlite3 from "sqlite3"
import { join } from "node:path"

sqlite3.verbose()

let db: sqlite3.Database | null = null

export type RunResult = { lastID: number; changes: number }

function ensureDb() {
  if (!db) throw new Error("DB not initialized")
  return db
}

function run(sql: string, params: any[] = []) {
  return new Promise<RunResult>((resolve, reject) => {
    ensureDb().run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: (this as any).lastID, changes: (this as any).changes })
    })
  })
}

function exec(sql: string) {
  return new Promise<void>((resolve, reject) => {
    ensureDb().exec(sql, (err) => (err ? reject(err) : resolve()))
  })
}

function all(sql: string, params: any[] = []) {
  return new Promise<any[]>((resolve, reject) => {
    ensureDb().all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as any[])))
  })
}

function get(sql: string, params: any[] = []) {
  return new Promise<any | null>((resolve, reject) => {
    ensureDb().get(sql, params, (err, row) => (err ? reject(err) : resolve(row ?? null)))
  })
}

async function initDb() {
  const file = join(process.cwd(), "data.sqlite")
  db = new sqlite3.Database(file)

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      deliveryType TEXT NOT NULL,
      deliveryAddress TEXT NOT NULL,
      deliveryDistanceKm INTEGER NOT NULL,
      deliveryFee INTEGER NOT NULL,
      prepMinutes INTEGER NOT NULL,
      readyAt TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      changeFrom INTEGER,
      changeDue INTEGER,
      comment TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      orderId TEXT NOT NULL,
      id TEXT NOT NULL,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      category TEXT,
      PRIMARY KEY(orderId, id)
    )
  `)

  await run(`CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt)`)
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_paid ON orders(paid)`)
  await run(`CREATE INDEX IF NOT EXISTS idx_items_orderId ON order_items(orderId)`)
}

async function transaction<T>(fn: () => Promise<T>) {
  await exec("BEGIN")
  try {
    const res = await fn()
    await exec("COMMIT")
    return res
  } catch (e) {
    await exec("ROLLBACK")
    throw e
  }
}

export async function getDb() {
  if (!db) await initDb()
  return { run, exec, all, get, transaction }
}
