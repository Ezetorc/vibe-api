import zod from 'zod';
declare const FollowerSchema: zod.ZodObject<{
    follower_id: zod.ZodNumber;
    following_id: zod.ZodNumber;
}, "strip", zod.ZodTypeAny, {
    follower_id: number;
    following_id: number;
}, {
    follower_id: number;
    following_id: number;
}>;
export type Follower = zod.infer<typeof FollowerSchema>;
export declare function validateFollower(object: unknown): zod.SafeParseReturnType<{
    follower_id: number;
    following_id: number;
}, {
    follower_id: number;
    following_id: number;
}>;
export {};
