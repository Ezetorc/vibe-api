import { Post } from '../schemas/post.schema.js';
import { Query } from '../structures/Query.js';
export declare class PostModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
    }): Promise<Post[]>;
    static search(args: {
        query: string;
        userId?: Query;
    }): Promise<Post[]>;
    static getById(args: {
        id: number;
    }): Promise<Post | null>;
    static create(args: {
        userId: number;
        content: string;
    }): Promise<boolean>;
    static delete(args: {
        id: number;
    }): Promise<boolean>;
    static update(args: {
        id: number;
        object: Partial<Post>;
    }): Promise<boolean>;
}
