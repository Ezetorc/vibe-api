import { Follower } from '../schemas/follower.schema.js'
import { execute } from '../utilities/execute.js'

export class FollowerModel {
  static async getAll (): Promise<Follower[]> {
    const query: string = 'SELECT * FROM followers'
    const params: string[] = []
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Follower[]
    }
  }

  static async getUserFollowers (args: { userId: number }): Promise<Follower[]> {
    const query: string =
      'SELECT * FROM followers WHERE following_id = ?'
    const params = [args.userId]
    const { failed, rows } = await execute(query, params)

    if (failed) {
      return []
    } else {
      return rows as Follower[]
    }
  }

  static async create (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)'
    const params = [args.followerId, args.followingId]
    const { failed } = await execute(query, params)

    return !failed
  }

  static async delete (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?'
    const params = [args.followerId, args.followingId]
    const { failed } = await execute(query, params)

    return !failed
  }
}
