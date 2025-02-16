import { Comment } from '../schemas/comment.schema'
import { DATABASE } from '../settings'

export class CommentModel {
  static async getAll (): Promise<Comment[]> {
    const query: string = 'SELECT * FROM comments'
    const params: string[] = []

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Comment[])
        }
      })
    })
  }

  static async getById (args: { commentId: number }): Promise<Comment> {
    const query = 'SELECT * FROM comments WHERE id = ?'
    const params = [args.commentId]

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row as Comment)
        }
      })
    })
  }

  static async delete (args: { commentId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query: string = 'DELETE FROM comments WHERE id = ?'
      const params = [args.commentId]

      DATABASE.run(query, params, error => {
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
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Comment[])
        }
      })
    })
  }
}
