import { database } from '../app.js'

export class CommentsModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM comments', [], (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static async getById ({ commentId }) {
    const query = 'SELECT * FROM comments WHERE id = ?'
    const params = [commentId]

    return new Promise((resolve, reject) => {
      database.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row)
        }
      })
    })
  }

  static async delete ({ commentId }) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM comments WHERE id = ?'
      const params = [commentId]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async getAllOfPost ({ postId }) {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT * FROM comments WHERE post_id = ?',
        [postId],
        (error, rows) => {
          if (error) {
            reject(error)
          } else {
            resolve(rows)
          }
        }
      )
    })
  }
}
