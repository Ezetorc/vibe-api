import { SALT_ROUNDS } from '../settings.js';
import bcrypt from 'bcrypt';
import { getDataByAmount } from '../utilities/getDataByAmount.js';
import { execute } from '../utilities/execute.js';
export class UserModel {
    static async getAll(args) {
        const { query, params } = getDataByAmount({
            amount: Number(args.amount),
            query: 'SELECT * FROM users',
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
    static async getById(args) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const params = [args.id];
        const { failed, rows } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async getByName(args) {
        const query = 'SELECT * FROM users WHERE name = ?';
        const params = [args.name];
        const { error, rows } = await execute(query, params);
        if (error) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async getByEmail(args) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const params = [args.email];
        const { error, rows } = await execute(query, params);
        if (error) {
            return null;
        }
        else {
            return rows.length > 0 ? rows[0] : null;
        }
    }
    static async search(args) {
        const query = 'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR description LIKE ?';
        const params = [`%${args.query}%`, `%${args.query}%`, `%${args.query}%`];
        const { rows, failed } = await execute(query, params);
        if (failed) {
            return [];
        }
        else {
            return rows;
        }
    }
    static async register(args) {
        const user = await this.getByName({ name: args.name });
        const userExists = Boolean(user);
        if (userExists)
            return null;
        const hashedPassword = await bcrypt.hash(args.password, SALT_ROUNDS);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const params = [args.name, args.email, hashedPassword];
        const { error, rows: result } = await execute(query, params);
        if (error) {
            return null;
        }
        else {
            const user = await this.getById({ id: result.insertId });
            return user;
        }
    }
    static async login(args) {
        const user = await this.getByName({ name: args.name });
        const userExists = Boolean(user);
        if (!userExists)
            return null;
        const isValid = await bcrypt.compare(args.password, user.password);
        return isValid ? user : null;
    }
    static async delete(args) {
        const query = 'DELETE FROM users WHERE id = ?';
        const params = [args.id];
        const { error } = await execute(query, params);
        return !Boolean(error);
    }
    static async update(args) {
        if ('created_at' in args.object || 'id' in args.object) {
            return false;
        }
        if (args.object.password) {
            args.object.password = bcrypt.hashSync(args.object.password, SALT_ROUNDS);
        }
        const setClause = Object.keys(args.object)
            .map(key => `${key} = ?`)
            .join(', ');
        if (!setClause)
            return false;
        const params = [...Object.values(args.object), args.id];
        const query = `UPDATE users SET ${setClause} WHERE id = ?`;
        const { failed } = await execute(query, params);
        return !failed;
    }
}
