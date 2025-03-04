import { DATABASE } from '../settings.js';
export class LikeModel {
    static async getAllOfPost(args) {
        const query = 'SELECT * FROM likes WHERE target_id = ? AND type = ?';
        const params = [args.postId, 'post'];
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
    static async getAllOfComment(args) {
        const query = 'SELECT * FROM likes WHERE target_id = ? AND type = ?';
        const params = [Number(args.commentId), 'comment'];
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
    static async getAllOfPosts() {
        const query = 'SELECT * FROM likes WHERE type = ?';
        const params = ['post'];
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
    static async getAllOfComments() {
        const query = 'SELECT * FROM likes WHERE type = ?';
        const params = ['comment'];
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
    static async create(args) {
        const query = 'INSERT INTO likes (target_id, type, user_id) VALUES (?, ?, ?)';
        const params = [args.targetId, args.type, args.userId];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    const likeId = result.insertId;
                    DATABASE.query('SELECT * FROM likes WHERE id = ?', [likeId], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(row || null);
                        }
                    });
                }
            });
        });
    }
    static async delete(args) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM likes WHERE id = ?';
            const params = [args.id];
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
}
