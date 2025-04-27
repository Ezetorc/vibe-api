import zod from 'zod';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotificationSchema = zod.object({
    id: zod.number().optional(),
    sender_id: zod.number(),
    target_id: zod.number(),
    type: zod.enum(['comment', 'follow', 'like']),
    data: zod
        .object({
        post_id: zod.number().optional(),
        comment_id: zod.number().optional()
    })
        .nullable()
        .optional(),
    created_at: zod.string().optional(),
    seen: zod.boolean().default(false).optional()
});
export function validateNotification(object) {
    return NotificationSchema.safeParse(object);
}
