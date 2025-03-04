import { DATABASE } from '../settings.js';
export class FollowerModel {
    static async getAll() {
        const query = 'SELECT * FROM followers';
        const params = [];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    static async getUserFollowersIds(args) {
        const query = 'SELECT follower_id FROM followers WHERE following_id = ?';
        const params = [args.userId];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows.map(row => row.follower_id));
                }
            });
        });
    }
    static async getUserFollowing(args) {
        const query = 'SELECT following_id FROM followers WHERE follower_id = ?';
        const params = [args.userId];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows.map(row => row.following_id));
                }
            });
        });
    }
    static create(args) {
        const query = 'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)';
        const params = [args.followerId, args.followingId];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static delete(args) {
        const query = 'DELETE FROM followers WHERE follower_id = ? AND following_id = ?';
        const params = [args.followerId, args.followingId];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
