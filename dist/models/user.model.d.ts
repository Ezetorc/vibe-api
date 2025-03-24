import { User } from '../schemas/user.schema.js';
import { Query } from '../structures/Query.js';
export declare class UserModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
    }): Promise<User[]>;
    static nameExists(args: {
        name: string;
    }): Promise<boolean>;
    static emailExists(args: {
        email: string;
    }): Promise<boolean>;
    static getById(args: {
        id: number;
    }): Promise<User | null>;
    static likedPost(args: {
        postId: number;
        userId: number;
    }): Promise<boolean>;
    static likedComment(args: {
        commentId: number;
        userId: number;
    }): Promise<boolean>;
    static getByName(args: {
        name: string;
    }): Promise<User | null>;
    static getByEmail(args: {
        email: string;
    }): Promise<User | null>;
    static search(args: {
        query: string;
    }): Promise<User[]>;
    static register(args: {
        name: string;
        email: string;
        password: string;
    }): Promise<User | null>;
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
