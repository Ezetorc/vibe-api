import { DATABASE } from '../settings.js';
import { getDataByAmount } from '../utilities/getDataByAmount.js';
export class CommentModel {
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM comments',
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
    static async create(args) {
        const query = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
        const params = [args.userId, args.postId, args.content];
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
    static async getById(args) {
        const query = 'SELECT * FROM comments WHERE id = ?';
        const params = [args.commentId];
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
    static async delete(args) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM comments WHERE id = ?';
            const params = [args.commentId];
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
    static async getAllOfPost(args) {
        const query = 'SELECT * FROM comments WHERE post_id = ?';
        const params = [args.postId];
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
}
