import { Post } from '../schemas/post.schema.js'
import { DATABASE } from '../settings.js'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'

export class PostModel {
  static async getAll (args: { amount?: Query; page?: Query }): Promise<Post[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM posts',
      page: Number(args.page),
      params: []
    })

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Post[])
        }
      })
    })
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

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Post[])
        }
      })
    })
  }

  static async getById (args: { id: number }): Promise<Post> {
    const query: string = 'SELECT * FROM posts WHERE id = ?'
    const params: number[] = [args.id]

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row as Post)
        }
      })
    })
  }

  static async create (args: {
    userId: number
    content: string
  }): Promise<boolean> {
    const query: string = 'INSERT INTO posts (user_id, content) VALUES (?, ?)'
    const params = [args.userId, args.content]

    return new Promise((resolve, reject) => {
      DATABASE.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async delete (args: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query: string = 'DELETE FROM posts WHERE id = ?'
      const params: number[] = [args.id]

      DATABASE.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async update (args: {
    id: number
    object: Partial<Post>
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if ('id' in args.object) {
        return reject(new Error('"id" cannot be updated'))
      }

      if ('created_at' in args.object) {
        return reject(new Error('"created_at" cannot be updated'))
      }

      const clause: string = Object.keys(args.object)
        .map(key => `${key} = ?`)
        .join(', ')
      const query: string = `UPDATE posts SET ${clause} WHERE id = ?`
      const params = [...Object.values(args.object), args.id]

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
