import { database } from '../app.js'

export class FollowersModel {
  static getAll () {
    return new Promise((resolve, reject) => {
      database.all('SELECT * FROM followers', [], (error, rows) => {
        if (error) reject(error)
        else resolve(rows)
      })
    })
  }

  static getUserFollowers ({ userId }) {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT follower_id FROM followers WHERE following_id = ?',
        [userId],
        (error, rows) => {
          if (error) reject(error)
          else resolve(rows.map(row => row.follower_id))
        }
      )
    })
  }

  static getUserFollowing (userId) {
    return new Promise((resolve, reject) => {
      database.all(
        'SELECT following_id FROM followers WHERE follower_id = ?',
        [userId],
        (error, rows) => {
          if (error) reject(error)
          else resolve(rows.map(row => row.following_id))
        }
      )
    })
  }

  static create ({ followerId, followingId }) {
    return new Promise((resolve, reject) => {
      database.run(
        'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
        [followerId, followingId],
        function (error) {
          if (error) reject(error)
          else resolve({ success: true, insertedId: this.lastID })
        }
      )
    })
  }

  static delete ({ followerId, followingId }) {
    return new Promise((resolve, reject) => {
      database.run(
        'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId],
        function (error) {
          if (error) reject(error)
          else resolve({ success: true, changes: this.changes })
        }
      )
    })
  }
}
