import { Like } from '../schemas/like.schema.js'
import { DATABASE } from '../settings.js'

export class LikeModel {
  static async getAllOfPost (args: { postId: number }): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE target_id = ? AND type = ?'
    const params = [args.postId, 'post']

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Like[])
        }
      })
    })
  }

  static async getAllOfComment (args: { commentId: number }): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE target_id = ? AND type = ?'
    const params = [Number(args.commentId), 'comment']

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Like[])
        }
      })
    })
  }

  static async getAllOfPosts (): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE type = ?'
    const params = ['post']

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Like[])
        }
      })
    })
  }

  static async getAllOfComments (): Promise<Like[]> {
    const query: string = 'SELECT * FROM likes WHERE type = ?'
    const params = ['comment']

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Like[])
        }
      })
    })
  }

  static async create (args: {
    targetId: number
    type: 'post' | 'comment'
    userId: number
  }): Promise<Like | null> {
    const query =
      'INSERT INTO likes (target_id, type, user_id) VALUES (?, ?, ?)'
    const params = [args.targetId, args.type, args.userId]

    return new Promise((resolve, reject) => {
      DATABASE.run(query, params, function (error) {
        if (error) {
          reject(error)
        } else {
          const likeId = this.lastID

          DATABASE.get(
            'SELECT * FROM likes WHERE id = ?',
            [likeId],
            (err, row) => {
              if (err) {
                reject(err)
              } else {
                resolve(row as Like | null)
              }
            }
          )
        }
      })
    })
  }

  static async delete (args: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query: string = 'DELETE FROM likes WHERE id = ?'
      const params = [args.id]

      DATABASE.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }
}
