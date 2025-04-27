import { Notification } from '../schemas/notification.schema.js';
import { Query } from '../structures/Query.js';
export declare class NotificationModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
        userId?: number;
    }): Promise<Notification[]>;
    static markAsSeen(args: {
        notificationsIds: number[];
    }): Promise<boolean>;
    static getById(args: {
        id: number;
    }): Promise<Notification | null>;
    static create(args: {
        senderId: number;
        targetId: number;
        type: 'comment' | 'like' | 'follow';
        data?: object | null;
    }): Promise<Notification | null>;
    static deleteOfUser(args: {
        userId: number;
    }): Promise<boolean>;
}
