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
            DATABASE.query(query, params, (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    }
    static async getById(args) {
        return new Promise((resolve, reject) => {
            DATABASE.query('SELECT * FROM users WHERE id = ?', [args.id], (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows.length > 0 ? rows[0] : null);
            });
        });
    }
    static async getByName(args) {
        return new Promise((resolve, reject) => {
            DATABASE.query('SELECT * FROM users WHERE name = ?', [args.name], (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows.length > 0 ? rows[0] : null);
            });
        });
    }
    static async exists(args) {
        let query = '';
        let params = [];
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
            DATABASE.query(query, params, (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows.length > 0);
            });
        });
    }
    static async search(args) {
        const query = 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?';
        const params = [`%${args.query}%`, `%${args.query}%`, `%${args.query}%`];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        });
    }
    static async register(args) {
        const userAlreadyExists = await this.exists({ name: args.name });
        if (userAlreadyExists)
            throw new Error('User already exists');
        const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const params = [args.name, args.email, hashedPassword];
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, function (error, result) {
                if (error)
                    reject(error);
                else {
                    DATABASE.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, rows) => {
                        if (err)
                            reject(err);
                        else
                            resolve(rows.length > 0 ? rows[0] : null);
                    });
                }
            });
        });
    }
    static async login(args) {
        const user = await this.getByName({ name: args.name });
        if (!user)
            return null;
        const isValid = await bcrypt.compare(args.password, user.password);
        return isValid ? user : null;
    }
    static async delete(args) {
        return new Promise((resolve, reject) => {
            DATABASE.query('DELETE FROM users WHERE id = ?', [args.id], error => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    }
    static async update(args) {
        if ('id' in args.object)
            throw new Error('"id" cannot be updated');
        if ('created_at' in args.object)
            throw new Error('"created_at" cannot be updated');
        if (args.object.password) {
            args.object.password = bcrypt.hashSync(args.object.password, SALT_ROUNDS);
        }
        const setClause = Object.keys(args.object)
            .map(key => `${key} = ?`)
            .join(', ');
        const params = [...Object.values(args.object), args.id];
        const query = `UPDATE users SET ${setClause} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            DATABASE.query(query, params, error => {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        });
    }
}
