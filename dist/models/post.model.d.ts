import { Post } from '../schemas/post.schema.js';
import { Query } from '../structures/Query.js';
export declare class PostModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
        userId?: number;
    }): Promise<Post[]>;
    static getCount(args: {
        userId: number;
    }): Promise<number>;
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
    }): Promise<Post | null>;
    static delete(args: {
        id: number;
    }): Promise<boolean>;
    static getPostUserId(args: {
        postId: number;
    }): Promise<number>;
    static update(args: {
        id: number;
        object: Partial<Post>;
    }): Promise<boolean>;
}
