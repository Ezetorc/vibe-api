import zod from 'zod';
const LikeSchema = zod.object({
    id: zod.number().optional(),
    target_id: zod.number(),
    user_id: zod.number(),
    type: zod.enum(['comment', 'post']),
    created_at: zod.string().optional()
});
export function validateLike(object) {
    return LikeSchema.safeParse(object);
}
