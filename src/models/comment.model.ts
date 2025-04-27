import { ResultSetHeader } from 'mysql2'
import { Comment } from '../schemas/comment.schema.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { execute } from '../utilities/execute.js'

export class CommentModel {
  static async getAllOfPost (args: {
    postId: number
    amount?: Query
    page?: Query
  }): Promise<Comment[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM comments WHERE post_id = ?',
      page: Number(args.page),
      params: [args.postId]
    })
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Comment[]
    }
  }

  static async getAmountOfPost (args: { postId: number }): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM comments WHERE post_id = ?`
    const params = [args.postId]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return -1
    } else {
      return rows[0].count as number
    }
  }

  static async getCommentUserId (args: { commentId: number }): Promise<number> {
    const query: string = `SELECT user_id FROM comments WHERE id = ?`
    const params = [args.commentId]
    const { failed, rows } = await execute(query, params)

    if (failed || rows.length === 0) {
      return -1
    } else {
      return rows[0].user_id
    }
  }

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

  static async delete (args: { commentId: number }): Promise<Comment | null> {
    const comment: Comment | null = await this.getById({
      commentId: args.commentId
    })

    if (!comment) return null

    const query: string = 'DELETE FROM comments WHERE id = ?'
    const params = [args.commentId]
    const { failed } = await execute<ResultSetHeader>(query, params)

    if (failed) {
      return null
    }

    return comment
  }
}
