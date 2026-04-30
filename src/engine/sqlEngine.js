import initSqlJs from 'sql.js'

let dbInstance = null

export async function initDatabase() {
  // Fetch WASM binary directly to avoid MIME type issues
  const wasmResponse = await fetch('/sql-wasm.wasm')
  const wasmBinary = await wasmResponse.arrayBuffer()
  
  const SQL = await initSqlJs({
    wasmBinary
  })
  dbInstance = new SQL.Database()
  return dbInstance
}

export function getDb() {
  return dbInstance
}

export function executeQuery(sql) {
  if (!dbInstance) throw new Error('Database not initialized')
  const start = performance.now()
  try {
    const results = dbInstance.exec(sql)
    const end = performance.now()
    return {
      success: true,
      results: results,
      time: Math.round((end - start) * 100) / 100,
      rowCount: results.length > 0 ? results[0].values.length : 0
    }
  } catch (err) {
    const end = performance.now()
    return {
      success: false,
      error: err.message,
      time: Math.round((end - start) * 100) / 100
    }
  }
}

export function loadDatabaseSchema(db, schema) {
  // Execute all CREATE TABLE statements
  schema.tables.forEach(table => {
    db.run(table.createSQL)
  })
  // Insert seed data
  schema.seedData.forEach(sql => {
    db.run(sql)
  })
}

export function resetDatabase() {
  if (dbInstance) {
    dbInstance.close()
  }
  return initDatabase()
}

export function getTableInfo(tableName) {
  if (!dbInstance) return []
  try {
    const result = dbInstance.exec(`PRAGMA table_info(${tableName})`)
    if (result.length === 0) return []
    return result[0].values.map(row => ({
      cid: row[0],
      name: row[1],
      type: row[2],
      notNull: row[3],
      defaultValue: row[4],
      pk: row[5]
    }))
  } catch {
    return []
  }
}

export function getAllTables() {
  if (!dbInstance) return []
  try {
    const result = dbInstance.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    if (result.length === 0) return []
    return result[0].values.map(row => row[0])
  } catch {
    return []
  }
}

export function getRowCount(tableName) {
  if (!dbInstance) return 0
  try {
    const result = dbInstance.exec(`SELECT COUNT(*) FROM ${tableName}`)
    return result[0].values[0][0]
  } catch {
    return 0
  }
}
