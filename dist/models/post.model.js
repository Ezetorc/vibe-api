import { DATABASE } from '../settings.js';
import { getDataByAmount } from '../utilities/getDataByAmount.js';
export class PostModel {
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM posts',
            page: Number(args.page),
            params: []
        });
        return new Promise((resolve, reject) => {
            DATABASE.all(query, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    static async search(args) {
        const query = args.userId
            ? 'SELECT * FROM posts WHERE content LIKE ? AND user_id = ?'
            : 'SELECT * FROM posts WHERE content LIKE ?';
        const params = args.userId
            ? [`%${args.query}%`, args.userId]
            : [`%${args.query}%`];
        return new Promise((resolve, reject) => {
            DATABASE.all(query, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    static async getById(args) {
        const query = 'SELECT * FROM posts WHERE id = ?';
        const params = [args.id];
        return new Promise((resolve, reject) => {
            DATABASE.get(query, params, (error, row) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
    static async create(args) {
        const query = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
        const params = [args.userId, args.content];
        return new Promise((resolve, reject) => {
            DATABASE.run(query, params, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static async delete(args) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM posts WHERE id = ?';
            const params = [args.id];
            DATABASE.run(query, params, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static async update(args) {
        return new Promise((resolve, reject) => {
            if ('id' in args.object) {
                return reject(new Error('"id" cannot be updated'));
            }
            if ('created_at' in args.object) {
                return reject(new Error('"created_at" cannot be updated'));
            }
            const clause = Object.keys(args.object)
                .map(key => `${key} = ?`)
                .join(', ');
            const query = `UPDATE posts SET ${clause} WHERE id = ?`;
            const params = [...Object.values(args.object), args.id];
            DATABASE.run(query, params, error => {
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
