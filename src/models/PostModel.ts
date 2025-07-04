import { ResultSetHeader } from 'mysql2'
import { Post } from '../schemas/PostSchema.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { execute } from '../utilities/execute.js'

export class PostModel {
  static async getAll (args: {
    amount?: Query
    page?: Query
    userId?: number
  }): Promise<Post[]> {
    const initialQuery = args.userId
      ? 'SELECT * FROM posts WHERE user_id = ?'
      : 'SELECT * FROM posts'
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
      return rows as Post[]
    }
  }

  static async getCount (args: { userId: number }): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM posts WHERE user_id = ?`
    const params = [args.userId]

    const { failed, rows } = await execute(query, params)

    if (failed || rows.length === 0) {
      return 0
    } else {
      return rows[0].count as number
    }
  }

  static async search (args: {
    query: string
    userId?: Query
    amount?: Query
    page?: Query
  }): Promise<Post[]> {
    const initialQuery = args.userId
      ? 'SELECT * FROM posts WHERE content LIKE ? AND user_id = ?'
      : 'SELECT * FROM posts WHERE content LIKE ?'

    const initialParams = args.userId
      ? [`%${args.query}%`, args.userId]
      : [`%${args.query}%`]

    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: initialQuery,
      page: Number(args.page),
      params: initialParams
    })

    const { rows, failed } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Post[]
    }
  }

  static async getById (args: { id: number }): Promise<Post | null> {
    const query: string = 'SELECT * FROM posts WHERE id = ?'
    const params: number[] = [args.id]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as Post) : null
    }
  }

  static async create (args: {
    userId: number
    content: string
  }): Promise<Post | null> {
    const query: string = 'INSERT INTO posts (user_id, content) VALUES (?, ?)'
    const params = [args.userId, args.content]
    const { failed, rows: result } = await execute<ResultSetHeader>(
      query,
      params
    )

    if (failed) {
      return null
    } else {
      const post: Post | null = await this.getById({ id: result.insertId })

      return post
    }
  }

  static async delete (args: { id: number }): Promise<boolean> {
    const query: string = 'DELETE FROM posts WHERE id = ?'
    const params: number[] = [args.id]
    const { success } = await execute(query, params)

    return success
  }

  static async getPostUserId (args: { postId: number }): Promise<number> {
    const query: string = `SELECT user_id FROM posts WHERE id = ?`
    const params = [args.postId]
    const { failed, rows } = await execute(query, params)

    if (failed || rows.length === 0) {
      return -1
    } else {
      return rows[0].user_id
    }
  }

  static async update (args: {
    id: number
    object: Partial<Post>
  }): Promise<boolean> {
    if ('created_at' in args.object || 'id' in args.object) {
      return false
    }

    const setClause = Object.keys(args.object)
      .map(key => `${key} = ?`)
      .join(', ')
    if (!setClause) return false

    const params = [...Object.values(args.object), args.id]
    const query = `UPDATE posts SET ${setClause} WHERE id = ?`

    const { success } = await execute<ResultSetHeader>(query, params)

    return success
  }
}
