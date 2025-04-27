import { execute } from '../utilities/execute.js';
import { getDataByAmount } from '../utilities/getDataByAmount.js';
export class NotificationModel {
    static async getAll(args) {
        const initialQuery = args.userId
            ? 'SELECT * FROM notifications WHERE target_id = ?'
            : 'SELECT * FROM notifications';
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
    static async markAsSeen(args) {
        if (!args.notificationsIds.length)
            return true;
        const placeholders = args.notificationsIds.map(() => '?').join(', ');
        const query = `UPDATE notifications SET seen = true WHERE id IN (${placeholders})`;
        const params = args.notificationsIds;
        const { failed } = await execute(query, params);
        return !failed;
    }
    static async getById(args) {
        const query = 'SELECT * FROM notifications WHERE id = ?';
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
        const query = `INSERT INTO notifications (sender_id, target_id, type, data) VALUES (?, ?, ?, ?)`;
        const params = [
            args.senderId,
            args.targetId,
            args.type,
            args.data ? JSON.stringify(args.data) : null
        ];
        const { failed, rows: result } = await execute(query, params);
        if (failed) {
            return null;
        }
        else {
            const notification = await this.getById({
                id: result.insertId
            });
            return notification;
        }
    }
    static async deleteOfUser(args) {
        const query = 'DELETE FROM notifications WHERE target_id = ?';
        const params = [args.userId];
        const { failed } = await execute(query, params);
        return !failed;
    }
}
