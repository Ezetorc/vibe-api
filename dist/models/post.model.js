import { getDataByAmount } from '../utilities/getDataByAmount.js';
import { execute } from '../utilities/execute.js';
export class PostModel {
    static async getAll(args) {
        const initialQuery = args.userId
            ? 'SELECT * FROM posts WHERE user_id = ?'
            : 'SELECT * FROM posts';
        const initialParams = args.userId ? [args.userId] : [];
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: initialQuery,
            page: Number(args.page),
            params: initialParams
        });
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getAmount(args) {
        const query = `SELECT COUNT(*) as count FROM posts WHERE user_id = ?`;
        const params = [args.userId];
        const { failed, rows } = await execute(query, params);
        if (failed || rows.length === 0) {
            return 0;
        }
        else {
            return rows[0].count;
        }
    }
    static async search(args) {
        const query = args.userId
            ? 'SELECT * FROM posts WHERE content LIKE ? AND user_id = ?'
            : 'SELECT * FROM posts WHERE content LIKE ?';
        const params = args.userId
            ? [`%${args.query}%`, args.userId]
            : [`%${args.query}%`];
        const { rows, failed } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async getById(args) {
        const query = 'SELECT * FROM posts WHERE id = ?';
        const params = [args.id];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async create(args) {
        const query = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
        const params = [args.userId, args.content];
        const { error, rows: result } = await execute(query, params);
        if (error) {
            return null;
        }
        else {
            const post = await this.getById({ id: result.insertId });
            return post;
        }
    }
    static async delete(args) {
        const query = 'DELETE FROM posts WHERE id = ?';
        const params = [args.id];
        const { failed } = await execute(query, params);
        return !failed;
    }
    static async update(args) {
        if ('created_at' in args.object || 'id' in args.object) {
            return false;
        }
        const setClause = Object.keys(args.object)
            .map(key => `${key} = ?`)
            .join(', ');
        if (!setClause)
            return false;
        const params = [...Object.values(args.object), args.id];
        const query = `UPDATE posts SET ${setClause} WHERE id = ?`;
        const { failed } = await execute(query, params);
        return !failed;
    }
}
