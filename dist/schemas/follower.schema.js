import zod from 'zod';
const FollowerSchema = zod.object({
    follower_id: zod.number(),
    following_id: zod.number()
});
export function validateFollower(object) {
    return FollowerSchema.safeParse(object);
}
export function validatePartialFollower(object) {
    return FollowerSchema.partial().safeParse(object);
}
