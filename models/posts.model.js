import { database } from '../app.js'

export class PostsModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM posts', [], (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static async getById ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM posts WHERE id = ?'
      const params = [id]

      database.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row)
        }
      })
    })
  }

  static async create ({ userId, content }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO posts (user_id, content)
        VALUES (?, ?)
      `
      const params = [userId, content]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve({
            id: this.lastID,
            content
          })
        }
      })
    })
  }

  static async delete ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM posts WHERE id = ?'
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

  static async update ({ id, object }) {
    return new Promise((resolve, reject) => {
      if (object.id) {
        return reject(new Error('"id" cannot be updated'))
      }

      if (object.created_at) {
        return reject(new Error('"created_at" cannot be updated'))
      }

      const setClause = Object.keys(object)
        .map(key => `${key} = ?`)
        .join(', ')
      const params = [...Object.values(object), id]
      const query = `UPDATE posts SET ${setClause} WHERE id = ?`

      database.run(query, params, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve({
            changes: this.changes,
            id,
            ...object
          })
        }
      })
    })
  }
}
