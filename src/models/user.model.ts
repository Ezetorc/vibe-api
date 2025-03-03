import { User } from '../schemas/user.schema.js'
import { DATABASE, SALT_ROUNDS } from '../settings.js'
import bcrypt from 'bcrypt'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'

export class UserModel {
  static async getAll (args: { amount?: Query; page?: Query }): Promise<User[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM users',
      page: Number(args.page),
      params: []
    })

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as User[])
        }
      })
    })
  }

  static async getById (args: { id: number }): Promise<User | null> {
    const query: string = 'SELECT * FROM users WHERE id = ?'
    const params: number[] = [args.id]

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row as User | null)
        }
      })
    })
  }

  static async getByName (args: { name: string }): Promise<User | null> {
    const query: string = 'SELECT * FROM users WHERE name = ?'
    const params: string[] = [args.name]

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row as User | null)
        }
      })
    })
  }

  static async exists(args: { name: string }): Promise<boolean>
  static async exists(args: { email: string }): Promise<boolean>

  static async exists (args: {
    name?: string
    email?: string
  }): Promise<boolean> {
    let query: string
    let params: string[]

    if (args.name) {
      query = 'SELECT 1 FROM users WHERE name = ?'
      params = [args.name]
    } else if (args.email) {
      query = 'SELECT 1 FROM users WHERE email = ?'
      params = [args.email]
    } else {
      return false
    }

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(Boolean(row))
        }
      })
    })
  }

  static async search (args: { query: string }): Promise<User[]> {
    const query: string =
      'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?'
    const params: string[] = [
      `%${args.query}%`,
      `%${args.query}%`,
      `%${args.query}%`
    ]

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as User[])
        }
      })
    })
  }

  static async register (args: {
    name: string
    email: string
    password: string
  }): Promise<User | null> {
    const userAlreadyExists: boolean = await this.exists({ name: args.name })

    if (userAlreadyExists) throw new Error('User already exists')

    const query: string =
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    const hashedPassword: string = await bcrypt.hash(args.password, SALT_ROUNDS)
    const params: string[] = [args.name, args.email, hashedPassword]

    return new Promise((resolve, reject) => {
      DATABASE.get(query, params, (error, row) => {
        if (error) {
          reject(error)
        } else {
          resolve(row ? (row as User) : null)
        }
      })
    })
  }

  static async login (args: {
    name: string
    password: string
  }): Promise<User | null> {
    const user: User | null = await this.getByName({ name: args.name })

    if (!user) return null

    const isValid: boolean = await bcrypt.compare(args.password, user.password)

    if (!isValid) return null

    return user
  }

  static async delete (args: { id: number }): Promise<boolean> {
    const query: string = 'DELETE FROM users WHERE id = ?'
    const params: number[] = [args.id]

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

  static async update (args: {
    id: number
    object: Partial<User>
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if ('id' in args.object) {
        return reject(new Error('"id" cannot be updated'))
      }

      if ('created_at' in args.object) {
        return reject(new Error('"created_at" cannot be updated'))
      }

      if (args.object.password) {
        args.object.password = bcrypt.hashSync(
          args.object.password,
          SALT_ROUNDS
        )
      }

      const setClause: string = Object.keys(args.object)
        .map(key => `${key} = ?`)
        .join(', ')
      const params = [...Object.values(args.object), args.id]
      const query: string = `UPDATE users SET ${setClause} WHERE id = ?`

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
