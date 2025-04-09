import zod from 'zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FollowerSchema = zod.object({
    follower_id: zod.number(),
    following_id: zod.number()
});
