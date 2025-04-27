import zod from 'zod';
const UserSchema = zod.object({
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
    image: zod.string().nullable().optional(),
    description: zod
        .string({ invalid_type_error: 'Description must be a string' })
        .max(200, 'Description must be at most 200 characters')
        .nullable()
        .optional(),
    created_at: zod.string().optional()
});
export function validatePartialUser(object) {
    return UserSchema.partial().safeParse(object);
}
