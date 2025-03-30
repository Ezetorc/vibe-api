import zod from 'zod'

const LikeSchema = zod.object({
  id: zod.number().optional(),
  target_id: zod.number(),
  user_id: zod.number(),
  type: zod.enum(['comment', 'post']),
  created_at: zod.string().optional()
})

export type Like = zod.infer<typeof LikeSchema>

export function validateLike (object: unknown) {
  return LikeSchema.safeParse(object)
}

export function validatePartialLike (object: unknown) {
  return LikeSchema.partial().safeParse(object)
}
