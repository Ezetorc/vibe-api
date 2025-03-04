import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Comment } from '../schemas/comment.schema.js'
import { DATABASE } from '../settings.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'

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

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Comment[])
        }
      })
    })
  }

  static async create (args: {
    userId: number
    postId: number
    content: string
  }): Promise<Comment | null> {
    const query =
      'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)'
    const params = [args.userId, args.postId, args.content]

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, function (error, result: ResultSetHeader) {
        if (error) {
          reject(error)
        } else {
          const commentId = result.insertId

          DATABASE.query(
            'SELECT * FROM comments WHERE id = ?',
            [commentId],
            (error, rows: RowDataPacket[]) => {
              if (error) {
                reject(error)
              } else {
                resolve(rows[0] as Comment | null)
              }
            }
          )
        }
      })
    })
  }

  static async getById (args: { commentId: number }): Promise<Comment> {
    const query = 'SELECT * FROM comments WHERE id = ?'
    const params = [args.commentId]

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, (error, rows: RowDataPacket[]) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows[0] as Comment)
        }
      })
    })
  }

  static async delete (args: { commentId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query: string = 'DELETE FROM comments WHERE id = ?'
      const params = [args.commentId]

      DATABASE.query(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async getAllOfPost (args: { postId: number }): Promise<Comment[]> {
    const query: string = 'SELECT * FROM comments WHERE post_id = ?'
    const params = [args.postId]

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Comment[])
        }
      })
    })
  }
}
