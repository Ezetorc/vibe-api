import { database } from '../app.js'

export class LikesModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM likes'

      database.all(query, [], (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static async like ({ postId, userId }) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)'
      const params = [postId, userId]

      database.run(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static async unlike ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM likes WHERE id = ?'
      const params = [id]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(this.changes)
        }
      })
    })
  }
}
