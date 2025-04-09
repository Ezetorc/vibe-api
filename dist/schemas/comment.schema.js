import zod from 'zod';
const CommentSchema = zod.object({
    id: zod.number().optional(),
    user_id: zod.number(),
    post_id: zod.number(),
    content: zod
        .string({
        invalid_type_error: 'Content must be a string',
        required_error: 'Content is required'
    })
        .min(1, 'Content must be at minimum 1 character.')
        .max(200, 'Content must be at most 200 characters.'),
    created_at: zod.string().optional()
});
export function validatePartialComment(object) {
    return CommentSchema.partial().safeParse(object);
}
