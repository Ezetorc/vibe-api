import zod from 'zod'

const likeSchema = zod.object({
  id: zod.number().optional(),
  post_id: zod.number(),
  user_id: zod.number()
})

export function validateLike (object) {
  return likeSchema.safeParse(object)
}
