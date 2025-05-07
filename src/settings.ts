import mySQL from 'mysql2'
import cloudinary from 'cloudinary'
import { validateEnvData } from './schemas/EnvSchema.js'

const { success, error, data: envData } = validateEnvData()

if (!success) {
  console.error(
    '❌ Some .env variables are missing or incorrect: ',
    error.message
  )
  process.exit(1)
}

const database = mySQL.createConnection(envData.DATABASE_URL)

database.connect(error => {
  if (error) {
    console.error('❌ Database connection error: ' + error.message)
  } else {
    console.log('✅ Database connection established')
  }
})

cloudinary.v2.config({
  cloud_name: 'ddugvrea9',
  api_key: envData.CLOUD_API_KEY,
  api_secret: envData.CLOUD_API_SECRET
})

export const { SECRET_KEY, FRONTEND_URL } = envData
export const PORT = Number(envData.PORT)
export const SALT_ROUNDS = Number(envData.SALT_ROUNDS)
export const CLOUDINARY = cloudinary.v2
export const DATABASE = database
