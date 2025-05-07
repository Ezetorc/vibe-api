import zod from 'zod'

const EnvSchema = zod.object({
  PORT: zod.string().default('3000'),
  SALT_ROUNDS: zod.string().default('10'),
  SECRET_KEY: zod
    .string({
      required_error: 'SECRET_KEY is required.',
      invalid_type_error: 'SECRET_KEY must be a string.'
    })
    .min(10, 'SECRET_KEY must be at least 10 characters long.'),
  CLOUD_API_KEY: zod
    .string({
      required_error: 'CLOUD_API_KEY is required.',
      invalid_type_error: 'CLOUD_API_KEY must be a string.'
    })
    .min(1, 'CLOUD_API_KEY is required'),
  CLOUD_API_SECRET: zod
    .string({
      required_error: 'CLOUD_API_SECRET is required.',
      invalid_type_error: 'CLOUD_API_SECRET must be a string.'
    })
    .min(1, 'CLOUD_API_SECRET is required'),
  DATABASE_URL: zod.string({
    required_error: 'DATABASE_URL is required.',
    invalid_type_error: 'DATABASE_URL must be a string.'
  }),
  FRONTEND_URL: zod.string().default('http://localhost:3000')
})

export function validateEnvData () {
  process.loadEnvFile()

  return EnvSchema.safeParse(process.env)
}
