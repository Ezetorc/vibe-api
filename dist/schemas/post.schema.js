import zod from 'zod';
const PostSchema = zod.object({
    id: zod.number().optional(),
    user_id: zod.number(),
    content: zod
        .string({
        invalid_type_error: 'Content must be a string',
        required_error: 'Content is required'
    })
        .min(1, 'Content must be at minimum 1 character.')
        .max(200, 'Content must be at most 300 characters.'),
    created_at: zod.string().optional()
});
export function validatePartialPost(object) {
    return PostSchema.partial().safeParse(object);
}
