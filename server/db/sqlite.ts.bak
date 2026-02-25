// server/db/sqlite.ts
import fs from "node:fs"
import path from "node:path"
import sqlite3 from "sqlite3"

sqlite3.verbose()

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, "forlove.sqlite")
export const db = new sqlite3.Database(dbPath)

// --- promisified helpers
export function run(sql: string, params: any[] = []) {
  return new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: (this as any).lastID, changes: (this as any).changes })
    })
  })
}

export function get<T = any>(sql: string, params: any[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row as T)
    })
  })
}

export function all<T = any>(sql: string, params: any[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows as T[])
    })
  })
}

export function exec(sql: string) {
  return new Promise<void>((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

// --- transaction helper (atomic operations)
export async function transaction<T>(fn: () => Promise<T>) {
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

// --- init tables
let inited = false
export async function initDb() {
  if (inited) return
  inited = true

  // IMPORTANT: foreign_keys ON (pentru cascade)
  await exec(`PRAGMA foreign_keys = ON;`)

  // orders (ai deja items_json — îl păstrăm)
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,

      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,

      delivery_type TEXT NOT NULL,
      delivery_address TEXT,
      delivery_distance_km INTEGER,
      delivery_fee INTEGER NOT NULL,

      prep_minutes INTEGER NOT NULL,
      ready_at TEXT NOT NULL,

      payment_method TEXT NOT NULL,
      payment_paid INTEGER NOT NULL DEFAULT 0,

      change_from INTEGER,
      change_due INTEGER,

      comment TEXT,

      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL
    )
  `)

  // items normalizate (cerut de /admin/stats și util pt /admin/orders)
  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      order_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      category TEXT,

      FOREIGN KEY(order_id) REFERENCES orders(public_id) ON DELETE CASCADE
    )
  `)

  // indexuri
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`)
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_paid ON orders(payment_paid)`)
  await run(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`)
}
