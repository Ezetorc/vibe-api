import { Follower } from '../schemas/follower.schema.js'
import { DATABASE } from '../settings.js'

export class FollowerModel {
  static async getAll (): Promise<Follower[]> {
    const query: string = 'SELECT * FROM followers'
    const params: string[] = []

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows as Follower[])
        }
      })
    })
  }

  static async getUserFollowersIds (args: {
    userId: number
  }): Promise<number[]> {
    const query: string =
      'SELECT follower_id FROM followers WHERE following_id = ?'
    const params = [args.userId]

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows: Follower[]) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows.map(row => row.follower_id))
        }
      })
    })
  }

  static async getUserFollowing (args: { userId: number }): Promise<number[]> {
    const query: string =
      'SELECT following_id FROM followers WHERE follower_id = ?'
    const params = [args.userId]

    return new Promise((resolve, reject) => {
      DATABASE.all(query, params, (error, rows: Follower[]) => {
        if (error) {
          reject(error)
        } else {
          resolve(rows.map(row => row.following_id))
        }
      })
    })
  }

  static create (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)'
    const params = [args.followerId, args.followingId]

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

  static delete (args: {
    followerId: number
    followingId: number
  }): Promise<boolean> {
    const query: string =
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?'
    const params = [args.followerId, args.followingId]

    return new Promise((resolve, reject) => {
      DATABASE.run(query, params, function (error) {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }
}
