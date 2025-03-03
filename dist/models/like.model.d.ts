import { Like } from '../schemas/like.schema.js';
export declare class LikeModel {
    static getAllOfPost(args: {
        postId: number;
    }): Promise<Like[]>;
    static getAllOfComment(args: {
        commentId: number;
    }): Promise<Like[]>;
    static getAllOfPosts(): Promise<Like[]>;
    static getAllOfComments(): Promise<Like[]>;
    static create(args: {
        targetId: number;
        type: 'post' | 'comment';
        userId: number;
    }): Promise<Like | null>;
    static delete(args: {
        id: number;
    }): Promise<boolean>;
}
