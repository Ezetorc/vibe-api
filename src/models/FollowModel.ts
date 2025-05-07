import { Follow } from '../schemas/FollowSchema.js'
import { execute } from '../utilities/execute.js'

export class FollowModel {
  static async getAll (): Promise<Follow[]> {
    const query: string = 'SELECT * FROM follows'
    const { failed, rows } = await execute(query)

    if (failed) {
      return []
    } else {
      return rows as Follow[]
    }
  }

  static async getAmount (args: {
    userId: number
    type: 'follower' | 'following'
  }): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM follows WHERE ${args.type}_id = ?`
    const params = [args.userId]

    const { failed, rows } = await execute(query, params)

    if (failed || rows.length === 0) {
      return 0
    } else {
      return rows[0].count as number
    }
  }

  static async getUserFollows (args: { userId: number }): Promise<Follow[]> {
    const query: string = 'SELECT * FROM follows WHERE following_id = ?'
    const params = [args.userId]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Follow[]
    }
  }

  static async create (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)'
    const params = [args.followerId, args.followingId]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async delete (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?'
    const params = [args.followerId, args.followingId]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async exists (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query =
      'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?'
    const params = [args.followerId, args.followingId]
    const { failed, rows } = await execute(query, params)

    return !failed && rows.length > 0
  }
}
