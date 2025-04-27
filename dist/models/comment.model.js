import { getDataByAmount } from '../utilities/getDataByAmount.js';
import { execute } from '../utilities/execute.js';
export class CommentModel {
    static async getAllOfPost(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM comments WHERE post_id = ?',
            page: Number(args.page),
            params: [args.postId]
        });
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getAmountOfPost(args) {
        const query = `SELECT COUNT(*) as count FROM comments WHERE post_id = ?`;
        const params = [args.postId];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return -1;
        }
        else {
            return rows[0].count;
        }
    }
    static async getCommentUserId(args) {
        const query = `SELECT user_id FROM comments WHERE id = ?`;
        const params = [args.commentId];
        const { failed, rows } = await execute(query, params);
        if (failed || rows.length === 0) {
            return -1;
        }
        else {
            return rows[0].user_id;
        }
    }
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM comments',
            page: Number(args.page),
            params: []
        });
        const { rows, failed } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async create(args) {
        const query = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
        const params = [args.userId, args.postId, args.content];
        const { failed, rows: result } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            const commentId = result.insertId;
            const comment = await this.getById({ commentId });
            return comment;
        }
    }
    static async getById(args) {
        const query = 'SELECT * FROM comments WHERE id = ?';
        const params = [args.commentId];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async delete(args) {
        const comment = await this.getById({
            commentId: args.commentId
        });
        if (!comment)
            return null;
        const query = 'DELETE FROM comments WHERE id = ?';
        const params = [args.commentId];
        const { failed } = await execute(query, params);
        if (failed) {
            return null;
        }
        return comment;
    }
}
