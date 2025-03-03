import { Comment } from '../schemas/comment.schema.js';
import { Query } from '../structures/Query.js';
export declare class CommentModel {
    static getAll(args: {
        amount?: Query;
        page?: Query;
    }): Promise<Comment[]>;
    static create(args: {
        userId: number;
        postId: number;
        content: string;
    }): Promise<Comment | null>;
    static getById(args: {
        commentId: number;
    }): Promise<Comment>;
    static delete(args: {
        commentId: number;
    }): Promise<boolean>;
    static getAllOfPost(args: {
        postId: number;
    }): Promise<Comment[]>;
}
