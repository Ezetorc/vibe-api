import { ResultSetHeader } from 'mysql2'
import { Post } from '../schemas/post.schema.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { execute } from '../utilities/execute.js'

export class PostModel {
  static async getAll (args: { amount?: Query; page?: Query }): Promise<Post[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM posts',
      page: Number(args.page),
      params: []
    })

    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Post[]
    }
  }

  static async search (args: {
    query: string
    userId?: Query
  }): Promise<Post[]> {
    const query = args.userId
      ? 'SELECT * FROM posts WHERE content LIKE ? AND user_id = ?'
      : 'SELECT * FROM posts WHERE content LIKE ?'

    const params = args.userId
      ? [`%${args.query}%`, args.userId]
      : [`%${args.query}%`]

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
  }): Promise<boolean> {
    const query: string = 'INSERT INTO posts (user_id, content) VALUES (?, ?)'
    const params = [args.userId, args.content]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async delete (args: { id: number }): Promise<boolean> {
    const query: string = 'DELETE FROM posts WHERE id = ?'
    const params: number[] = [args.id]
    const { failed } = await execute(query, params)

    return !failed
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

    const { failed } = await execute<ResultSetHeader>(query, params)

    return !failed
  }
}
