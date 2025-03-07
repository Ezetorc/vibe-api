import { execute } from '../utilities/execute.js';
export class FollowerModel {
    static async getAll() {
        const query = 'SELECT * FROM followers';
        const params = [];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getUserFollowers(args) {
        const query = 'SELECT * FROM followers WHERE following_id = ?';
        const params = [args.userId];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async create(args) {
        const query = 'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)';
        const params = [args.followerId, args.followingId];
        const { failed } = await execute(query, params);
        return !failed;
    }
    static async delete(args) {
        const query = 'DELETE FROM followers WHERE follower_id = ? AND following_id = ?';
        const params = [args.followerId, args.followingId];
        const { failed } = await execute(query, params);
        return !failed;
    }
    static async exists(args) {
        const query = 'SELECT 1 FROM followers WHERE follower_id = ? AND following_id = ?';
        const params = [args.followerId, args.followingId];
        const { failed, rows } = await execute(query, params);
        return !failed && rows.length > 0;
    }
}
