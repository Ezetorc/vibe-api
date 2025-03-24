import { Follower } from '../schemas/follower.schema.js';
export declare class FollowerModel {
    static getAll(): Promise<Follower[]>;
    static getAmount(args: {
        userId: number;
        type: 'follower' | 'following';
    }): Promise<number>;
    static getUserFollowers(args: {
        userId: number;
    }): Promise<Follower[]>;
    static create(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
    static delete(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
    static exists(args: {
        followerId: number;
        followingId: number;
    }): Promise<boolean>;
}
