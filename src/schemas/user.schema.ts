import zod from 'zod'

export const UserSchema = zod.object({
  id: zod.number().optional(),
  name: zod
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required'
    })
    .min(3, 'Name must be at minimum 3 character.')
    .max(20, 'Name must be at most 20 characters'),
  email: zod
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required'
    })
    .email('Invalid email format'),
  password: zod
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required'
    })
    .min(6, 'Password must be at minimum 6 characters.')
    .max(30, 'Password must be at most 30 characters'),
  profile_image_id: zod.string().nullable().optional(),
  description: zod
    .string({ invalid_type_error: 'Description must be a string' })
    .max(200, 'Description must be at most 200 characters')
    .nullable()
    .optional(),
  created_at: zod.string().optional()
})

export type User = zod.infer<typeof UserSchema>

export function validateUser (object: any) {
  return UserSchema.safeParse(object)
}

export function validatePartialUser (object: any) {
  return UserSchema.partial().safeParse(object)
}
