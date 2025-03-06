import { getDataByAmount } from '../utilities/getDataByAmount.js';
import { execute } from '../utilities/execute.js';
export class PostModel {
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM posts',
            page: Number(args.page),
            params: []
        });
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
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
        const { failed } = await execute(query, params);
        return !failed;
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
