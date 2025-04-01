import { execute } from '../utilities/execute.js';
export class LikeModel {
    static async getAllOfPost(args) {
        const query = 'SELECT * FROM likes WHERE target_id = ? AND type = ?';
        const params = [args.postId, 'post'];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getLikeUserId(args) {
        const query = `SELECT user_id FROM likes WHERE id = ?`;
        const params = [args.likeId];
        const { failed, rows } = await execute(query, params);
        if (failed || rows.length === 0) {
            return -1;
        }
        else {
            return rows[0].user_id;
        }
    }
    static async getAmount(args) {
        const query = `SELECT COUNT(*) as count FROM likes WHERE target_id = ? AND type = ?`;
        const params = [args.targetId, args.type];
        const { failed, rows } = await execute(query, params);
        if (failed || rows.length === 0) {
            return 0;
        }
        else {
            return rows[0].count;
        }
    }
    static async getAllOfComment(args) {
        const query = 'SELECT * FROM likes WHERE target_id = ? AND type = ?';
        const params = [Number(args.commentId), 'comment'];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getAllOfPosts() {
        const query = 'SELECT * FROM likes WHERE type = ?';
        const params = ['post'];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getAllOfComments() {
        const query = 'SELECT * FROM likes WHERE type = ?';
        const params = ['comment'];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getById(args) {
        const query = 'SELECT * FROM likes WHERE id = ?';
        const params = [args.id];
        const { error, rows } = await execute(query, params);
        if (error) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async create(args) {
        const query = 'INSERT INTO likes (target_id, type, user_id) VALUES (?, ?, ?)';
        const params = [args.targetId, args.type, args.userId];
        const { failed, rows: result } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            const like = await this.getById({ id: result.insertId });
            return like;
        }
    }
    static async delete(args) {
        const query = 'DELETE FROM likes WHERE id = ?';
        const params = [args.id];
        const { failed } = await execute(query, params);
        return !failed;
    }
}
