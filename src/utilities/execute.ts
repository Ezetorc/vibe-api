import { RowDataPacket } from 'mysql2'
import { DATABASE } from '../settings.js'

export function execute<T = RowDataPacket[]> (
  query: string,
  params: unknown[]
): Promise<{ error: Error | null; rows: T; failed: boolean }> {
  return new Promise(resolve => {
    DATABASE.query(query, params, (error, rows) => {
      if (error) {
        resolve({ error, rows: [] as T, failed: true })
      } else {
        resolve({ error: null, rows: rows as T, failed: false })
      }
    })
  })
}
