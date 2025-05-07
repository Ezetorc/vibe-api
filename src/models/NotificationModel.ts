import { ResultSetHeader } from 'mysql2'
import { execute } from '../utilities/execute.js'
import { Notification } from '../schemas/NotificationSchema.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'

export class NotificationModel {
  static async getAll (args: {
    amount?: Query
    page?: Query
    userId?: number
  }): Promise<Notification[]> {
    const initialQuery = args.userId
      ? 'SELECT * FROM notifications WHERE target_id = ?'
      : 'SELECT * FROM notifications'
    const initialParams = args.userId ? [args.userId] : []
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: initialQuery,
      page: Number(args.page),
      params: initialParams
    })

    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Notification[]
    }
  }

  static async markAsSeen (args: {
    notificationsIds: number[]
  }): Promise<boolean> {
    if (!args.notificationsIds.length) return true

    const placeholders = args.notificationsIds.map(() => '?').join(', ')
    const query = `UPDATE notifications SET seen = true WHERE id IN (${placeholders})`
    const params = args.notificationsIds

    const { failed } = await execute(query, params)

    return !failed
  }

  static async getById (args: { id: number }): Promise<Notification | null> {
    const query: string = 'SELECT * FROM notifications WHERE id = ?'
    const params: number[] = [args.id]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as Notification) : null
    }
  }

  static async create (args: {
    senderId: number
    targetId: number
    type: 'comment' | 'like' | 'follow'
    data?: object | null
  }): Promise<Notification | null> {
    const query = `INSERT INTO notifications (sender_id, target_id, type, data) VALUES (?, ?, ?, ?)`
    const params = [
      args.senderId,
      args.targetId,
      args.type,
      args.data ? JSON.stringify(args.data) : null
    ]

    const { failed, rows: result } = await execute<ResultSetHeader>(
      query,
      params
    )

    if (failed) {
      return null
    } else {
      const notification: Notification | null = await this.getById({
        id: result.insertId
      })

      return notification
    }
  }

  static async deleteOfUser (args: { userId: number }): Promise<boolean> {
    const query: string = 'DELETE FROM notifications WHERE target_id = ?'
    const params: number[] = [args.userId]
    const { failed } = await execute(query, params)

    return !failed
  }
}
