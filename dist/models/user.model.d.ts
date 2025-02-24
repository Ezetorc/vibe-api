import { User } from '../schemas/user.schema.js';
import { Query } from '../structures/Query.js';
export declare class UserModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
    }): Promise<User[]>;
    static getById(args: {
        id: number;
    }): Promise<User>;
    static getByName(args: {
        name: string;
    }): Promise<User | null>;
    static exists(args: {
        name: string;
    }): Promise<boolean>;
    static exists(args: {
        email: string;
    }): Promise<boolean>;
    static search(args: {
        query: string;
    }): Promise<User[]>;
    static register(args: {
        name: string;
        email: string;
        password: string;
    }): Promise<boolean>;
    static login(args: {
        name: string;
        password: string;
    }): Promise<User | null>;
    static delete(args: {
        id: number;
    }): Promise<boolean>;
    static update(args: {
        id: number;
        object: Partial<User>;
    }): Promise<boolean>;
}
