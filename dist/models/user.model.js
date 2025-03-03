import { DATABASE, SALT_ROUNDS } from '../settings.js';
import bcrypt from 'bcrypt';
import { getDataByAmount } from '../utilities/getDataByAmount.js';
export class UserModel {
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM users',
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
    static async getById(args) {
        const query = 'SELECT * FROM users WHERE id = ?';
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
    static async getByName(args) {
        const query = 'SELECT * FROM users WHERE name = ?';
        const params = [args.name];
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
    static async exists(args) {
        let query;
        let params;
        if (args.name) {
            query = 'SELECT 1 FROM users WHERE name = ?';
            params = [args.name];
        }
        else if (args.email) {
            query = 'SELECT 1 FROM users WHERE email = ?';
            params = [args.email];
        }
        else {
            return false;
        }
        return new Promise((resolve, reject) => {
            DATABASE.get(query, params, (error, row) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(Boolean(row));
                }
            });
        });
    }
    static async search(args) {
        const query = 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?';
        const params = [
            `%${args.query}%`,
            `%${args.query}%`,
            `%${args.query}%`
        ];
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
    static async register(args) {
        const userAlreadyExists = await this.exists({ name: args.name });
        if (userAlreadyExists)
            throw new Error('User already exists');
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);
        const params = [args.name, args.email, hashedPassword];
        return new Promise((resolve, reject) => {
            DATABASE.get(query, params, (error, row) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(row ? row : null);
                }
            });
        });
    }
    static async login(args) {
        const user = await this.getByName({ name: args.name });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(args.password, user.password);
        if (!isValid)
            return null;
        return user;
    }
    static async delete(args) {
        const query = 'DELETE FROM users WHERE id = ?';
        const params = [args.id];
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
    static async update(args) {
        return new Promise((resolve, reject) => {
            if ('id' in args.object) {
                return reject(new Error('"id" cannot be updated'));
            }
            if ('created_at' in args.object) {
                return reject(new Error('"created_at" cannot be updated'));
            }
            if (args.object.password) {
                args.object.password = bcrypt.hashSync(args.object.password, SALT_ROUNDS);
            }
            const setClause = Object.keys(args.object)
                .map(key => `${key} = ?`)
                .join(', ');
            const params = [...Object.values(args.object), args.id];
            const query = `UPDATE users SET ${setClause} WHERE id = ?`;
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
