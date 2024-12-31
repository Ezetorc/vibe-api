import { database } from '../app.js'

export class UsersModel {
  static async getAll () {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM users', [], (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows)
        }
      })
    })
  }

  static async getByEmail ({ email }) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?'
      const params = [email]

      database.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row)
        }
      })
    })
  }

  static async getById ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?'
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

  static async create ({ name, email, password, profileImageId, description }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (name, email, password, profile_image_id, description)
        VALUES (?, ?, ?, ?, ?)
      `
      const params = [name, email, password, profileImageId, description]

      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve({
            id: this.lastID,
            name,
            email,
            profileImageId,
            description
          })
        }
      })
    })
  }

  static async delete ({ id }) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users WHERE id = ?'
      const params = [id]

      database.run(query, params, function (error) {
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
      const query = `UPDATE users SET ${setClause} WHERE id = ?`

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
