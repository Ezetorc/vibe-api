import { Like } from '../schemas/like.schema.js'
import { ResultSetHeader } from 'mysql2'
import { execute } from '../utilities/execute.js'

export class LikeModel {
  static async getAllOfPost (args: { postId: number }): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE target_id = ? AND type = ?'
    const params = [args.postId, 'post']
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Like[]
    }
  }

  static async getAmount (args: {
    targetId: number
    type: 'comment' | 'post'
  }): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM likes WHERE target_id = ? AND type = ?`
    const params = [args.targetId, args.type]

    const { failed, rows } = await execute(query, params)

    if (failed || rows.length === 0) {
      return 0
    } else {
      return rows[0].count as number
    }
  }

  static async getAllOfComment (args: { commentId: number }): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE target_id = ? AND type = ?'
    const params = [Number(args.commentId), 'comment']
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Like[]
    }
  }

  static async getAllOfPosts (): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE type = ?'
    const params = ['post']

    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Like[]
    }
  }

  static async getAllOfComments (): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE type = ?'
    const params = ['comment']
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Like[]
    }
  }

  static async getById (args: { id: number }): Promise<Like | null> {
    const query = 'SELECT * FROM likes WHERE id = ?'
    const params = [args.id]
    const { error, rows } = await execute(query, params)

    if (error) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as Like) : null
    }
  }

  static async create (args: {
    targetId: number
    type: 'post' | 'comment'
    userId: number
  }): Promise<Like | null> {
    const query =
      'INSERT INTO likes (target_id, type, user_id) VALUES (?, ?, ?)'
    const params = [args.targetId, args.type, args.userId]
    const { failed, rows: result } = await execute<ResultSetHeader>(
      query,
      params
    )

    if (failed) {
      return null
    } else {
      const like: Like | null = await this.getById({ id: result.insertId })
      return like
    }
  }

  static async delete (args: { id: number }): Promise<boolean> {
    const query: string = 'DELETE FROM likes WHERE id = ?'
    const params = [args.id]
    const { failed } = await execute(query, params)

    return !failed
  }
}
