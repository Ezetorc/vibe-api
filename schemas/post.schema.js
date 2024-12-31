import zod from 'zod'

const postSchema = zod.object({
  id: zod.number().optional(),
  user_id: zod.number().optional(),
  content: zod
    .string({
      invalid_type_error: 'Content must be a string',
      required_error: 'Content is required'
    })
    .min(1, 'Content must be at minimum 1 character.')
    .max(300, 'Content must be at most 300 characters.'),
  created_at: zod.string().optional()
})

export function validatePost (object) {
  return postSchema.safeParse(object)
}

export function validatePartialPost (object) {
  return postSchema.partial().safeParse(object)
}
