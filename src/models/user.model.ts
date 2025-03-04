import { User } from '../schemas/user.schema.js'
import { DATABASE, SALT_ROUNDS } from '../settings.js'
import bcrypt from 'bcrypt'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export class UserModel {
  static async getAll (args: { amount?: Query; page?: Query }): Promise<User[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM users',
      page: Number(args.page),
      params: []
    })

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, (error, rows: RowDataPacket[]) => {
        if (error) reject(error)
        else resolve(rows as User[])
      })
    })
  }

  static async getById (args: { id: number }): Promise<User | null> {
    return new Promise((resolve, reject) => {
      DATABASE.query(
        'SELECT * FROM users WHERE id = ?',
        [args.id],
        (error, rows: RowDataPacket[]) => {
          if (error) reject(error)
          else resolve(rows.length > 0 ? (rows[0] as User) : null)
        }
      )
    })
  }

  static async getByName (args: { name: string }): Promise<User | null> {
    return new Promise((resolve, reject) => {
      DATABASE.query(
        'SELECT * FROM users WHERE name = ?',
        [args.name],
        (error, rows: RowDataPacket[]) => {
          if (error) reject(error)
          else resolve(rows.length > 0 ? (rows[0] as User) : null)
        }
      )
    })
  }

  static async exists (args: {
    name?: string
    email?: string
  }): Promise<boolean> {
    let query = ''
    let params: string[] = []

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
      DATABASE.query(query, params, (error, rows: RowDataPacket[]) => {
        if (error) reject(error)
        else resolve(rows.length > 0)
      })
    })
  }

  static async search (args: { query: string }): Promise<User[]> {
    const query =
      'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?'
    const params = [`%${args.query}%`, `%${args.query}%`, `%${args.query}%`]

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, (error, rows: RowDataPacket[]) => {
        if (error) reject(error)
        else resolve(rows as User[])
      })
    })
  }

  static async register (args: {
    name: string
    email: string
    password: string
  }): Promise<User | null> {
    const userAlreadyExists = await this.exists({ name: args.name })
    if (userAlreadyExists) throw new Error('User already exists')

    const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS)
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    const params = [args.name, args.email, hashedPassword]

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, function (error, result: ResultSetHeader) {
        if (error) reject(error)
        else {
          DATABASE.query(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId],
            (err, rows: RowDataPacket[]) => {
              if (err) reject(err)
              else resolve(rows.length > 0 ? (rows[0] as User) : null)
            }
          )
        }
      })
    })
  }

  static async login (args: {
    name: string
    password: string
  }): Promise<User | null> {
    const user = await this.getByName({ name: args.name })
    if (!user) return null

    const isValid = await bcrypt.compare(args.password, user.password)
    return isValid ? user : null
  }

  static async delete (args: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      DATABASE.query('DELETE FROM users WHERE id = ?', [args.id], error => {
        if (error) reject(error)
        else resolve(true)
      })
    })
  }

  static async update (args: {
    id: number
    object: Partial<User>
  }): Promise<boolean> {
    if ('id' in args.object) throw new Error('"id" cannot be updated')
    if ('created_at' in args.object)
      throw new Error('"created_at" cannot be updated')

    if (args.object.password) {
      args.object.password = bcrypt.hashSync(args.object.password, SALT_ROUNDS)
    }

    const setClause = Object.keys(args.object)
      .map(key => `${key} = ?`)
      .join(', ')
    const params = [...Object.values(args.object), args.id]
    const query = `UPDATE users SET ${setClause} WHERE id = ?`

    return new Promise((resolve, reject) => {
      DATABASE.query(query, params, error => {
        if (error) reject(error)
        else resolve(true)
      })
    })
  }
}
