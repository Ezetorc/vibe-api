import { database } from '../app.js'

export class LikesModel {
  static async getAllOfPost ({ postId }) {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT * FROM likes WHERE target_id = ? AND type = ?',
        [postId, 'post'],
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

  static async getAllOfComment ({ commentId }) {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT * FROM likes WHERE target_id = ? AND type = ?',
        [Number(commentId), 'comment'],
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

  static async getAllOfPosts () {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT * FROM likes WHERE type = ?',
        ['post'],
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

  static async getAllOfComments () {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT * FROM likes WHERE type = ?',
        ['comment'],
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

  static async create ({ targetId, type, userId }) {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO likes (target_id, type, user_id) VALUES (?, ?, ?)'
      const params = [targetId, type, userId]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  static async delete ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM likes WHERE id = ?'
      const params = [id]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }
}
