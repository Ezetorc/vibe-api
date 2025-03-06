import { ResultSetHeader } from 'mysql2'
import { Comment } from '../schemas/comment.schema.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { execute } from '../utilities/execute.js'

export class CommentModel {
  static async getAll (args: {
    amount?: Query
    page?: Query
  }): Promise<Comment[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM comments',
      page: Number(args.page),
      params: []
    })

    const { rows, failed } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Comment[]
    }
  }

  static async create (args: {
    userId: number
    postId: number
    content: string
  }): Promise<Comment | null> {
    const query =
      'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)'
    const params = [args.userId, args.postId, args.content]
    const { failed, rows: result } = await execute<ResultSetHeader>(
      query,
      params
    )

    if (failed) {
      return null
    } else {
      const commentId: number = result.insertId
      const comment: Comment | null = await this.getById({ commentId })

      return comment
    }
  }

  static async getById (args: { commentId: number }): Promise<Comment | null> {
    const query = 'SELECT * FROM comments WHERE id = ?'
    const params = [args.commentId]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as Comment) : null
    }
  }

  static async delete (args: { commentId: number }): Promise<boolean> {
    const query: string = 'DELETE FROM comments WHERE id = ?'
    const params = [args.commentId]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async getAllOfPost (args: { postId: number }): Promise<Comment[]> {
    const query: string = 'SELECT * FROM comments WHERE post_id = ?'
    const params = [args.postId]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Comment[]
    }
  }
}
