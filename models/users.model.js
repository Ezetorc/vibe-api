import { database } from '../app.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config.js'

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

  static async getById ({ id }) {
    const query = 'SELECT * FROM users WHERE id = ?'
    const params = [id]

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

  static async getByName ({ name }) {
    const query = 'SELECT * FROM users WHERE name = ?'
    const params = [name]

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

  static async exists ({ name, email }) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 1 
        FROM users 
        WHERE name = ? AND email = ?
      `
      const params = [name, email]

      database.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(!!row)
        }
      })
    })
  }

  static async register ({ name, email, password }) {
    const userAlreadyExists = await this.exists({ name, email })

    if (userAlreadyExists) throw new Error('User already exists')

    const query = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const params = [name, email, hashedPassword]

    return new Promise((resolve, reject) => {
      database.run(query, params, error => {
        if (error) {
          reject(error)
        } else {
          resolve({
            id: this.lastID,
            name,
            email,
            password: hashedPassword
          })
        }
      })
    })
  }

  static async login ({ name, password }) {
    const user = await this.getByName({ name })

    if (!user) {
      throw new Error("User doesn't exist")
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid password')
    }

    return user
  }

  static async delete ({ id }) {
    const query = 'DELETE FROM users WHERE id = ?'
    const params = [id]

    return new Promise((resolve, reject) => {
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
