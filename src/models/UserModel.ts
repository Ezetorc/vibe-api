import { User } from '../schemas/UserSchema.js'
import { SALT_ROUNDS } from '../settings.js'
import bcrypt from 'bcrypt'
import { Query } from '../structures/Query.js'
import { getDataByAmount } from '../utilities/getDataByAmount.js'
import { ResultSetHeader } from 'mysql2'
import { execute } from '../utilities/execute.js'

export class UserModel {
  static async getAll (args: { amount?: Query; page?: Query }): Promise<User[]> {
    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: 'SELECT * FROM users',
      page: Number(args.page),
      params: []
    })

    const { rows, failed } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as User[]
    }
  }

  static async nameExists (args: { name: string }): Promise<boolean> {
    const query = `SELECT COUNT(*) AS user_count FROM users WHERE name = ?`
    const params = [args.name]
    const { rows, failed } = await execute(query, params)

    return !failed && rows[0].user_count > 0
  }

  static async emailExists (args: { email: string }): Promise<boolean> {
    const query = `SELECT COUNT(*) AS user_count FROM users WHERE email = ?`
    const params = [args.email]
    const { rows, failed } = await execute(query, params)

    return !failed && rows[0].user_count > 0
  }

  static async getById (args: { id: number }): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?'
    const params = [args.id]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as User) : null
    }
  }

  static async likedPost (args: {
    postId: number
    userId: number
  }): Promise<boolean> {
    const query =
      'SELECT 1 FROM likes WHERE type = ? AND user_id = ? AND target_id = ?'
    const params = ['post', args.userId, args.postId]
    const { failed, rows } = await execute(query, params)

    return !failed && rows.length > 0
  }

  static async likedComment (args: {
    commentId: number
    userId: number
  }): Promise<boolean> {
    const query =
      'SELECT 1 FROM likes WHERE type = ? AND user_id = ? AND target_id = ?'
    const params = ['comment', args.userId, args.commentId]
    const { failed, rows } = await execute(query, params)

    return !failed && rows.length > 0
  }

  static async getByName (args: { name: string }): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE name = ?'
    const params = [args.name]
    const { error, rows } = await execute(query, params)

    if (error) {
      return null
    } else {
      return rows.length > 0 ? (rows[0] as User) : null
    }
  }

  static async search (args: {
    query: string
    amount: Query
    page: Query
  }): Promise<User[]> {
    const initialQuery =
      'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?'
    const initialParams = [
      `%${args.query}%`,
      `%${args.query}%`,
      `%${args.query}%`
    ]

    const { query, params } = getDataByAmount({
      amount: Number(args.amount),
      query: initialQuery,
      page: Number(args.page),
      params: initialParams
    })

    const { rows, failed } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as User[]
    }
  }

  static async register (args: {
    name: string
    email: string
    password: string
  }): Promise<User | null> {
    const user: User | null = await this.getByName({ name: args.name })
    const userExists: boolean = Boolean(user)

    if (userExists) return null

    const hashedPassword: string = await bcrypt.hash(args.password, SALT_ROUNDS)
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    const params = [args.name, args.email, hashedPassword]
    const { error, rows: result } = await execute<ResultSetHeader>(
      query,
      params
    )

    if (error) {
      return null
    } else {
      const user: User | null = await this.getById({ id: result.insertId })

      return user
    }
  }

  static async login (params: {
    name: string
    password: string
  }): Promise<User | null> {
    const user: User | null = await this.getByName({ name: params.name })
    const userExists: boolean = Boolean(user)

    if (!userExists) return null

    const isValid: boolean = await bcrypt.compare(
      params.password,
      user!.password
    )

    return isValid ? user : null
  }

  static async delete (args: { id: number }): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = ?'
    const params = [args.id]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async update (args: {
    id: number
    object: Partial<User>
  }): Promise<boolean> {
    if ('created_at' in args.object || 'id' in args.object) {
      return false
    }

    if (args.object.password) {
      args.object.password = bcrypt.hashSync(args.object.password, SALT_ROUNDS)
    }

    const setClause = Object.keys(args.object)
      .map(key => `${key} = ?`)
      .join(', ')
    if (!setClause) return false

    const params = [...Object.values(args.object), args.id]
    const query = `UPDATE users SET ${setClause} WHERE id = ?`

    const { failed } = await execute<ResultSetHeader>(query, params)

    return !failed
  }
}
