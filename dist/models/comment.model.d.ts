import { Comment } from '../schemas/comment.schema.js';
import { Query } from '../structures/Query.js';
export declare class CommentModel {
    static getAllOfPost(args: {
        postId: number;
        amount?: Query;
        page?: Query;
    }): Promise<Comment[]>;
    static getCommentUserId(args: {
        commentId: number;
    }): Promise<number>;
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
    }): Promise<Comment | null>;
    static delete(args: {
        commentId: number;
    }): Promise<Comment | null>;
}
