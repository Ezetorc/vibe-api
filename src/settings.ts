import { config as setupEnvData } from 'dotenv'
import mySQL from 'mysql2'
import cloudinary from 'cloudinary'
setupEnvData()
const envData = process.env

if (
  !envData.CLOUD_NAME ||
  !envData.CLOUD_API_KEY ||
  !envData.CLOUD_API_SECRET
) {
  throw new Error('❌ Cloudinary env vars are missing')
}

if (!envData.DATABASE_URL) {
  throw new Error('❌ Database env vars are missing')
}

cloudinary.v2.config({
  cloud_name: envData.CLOUD_NAME,
  api_key: envData.CLOUD_API_KEY,
  api_secret: envData.CLOUD_API_SECRET
})

const database = mySQL.createConnection(envData.DATABASE_URL)

database.connect(error => {
  if (error) {
    console.error('❌ Database connection error: ' + error.message)
  } else {
    console.log('✅ Database connection established')
  }
})

export const ALLOWED_ORIGINS: string[] = [envData.FRONTEND_URL ?? '']
export const PORT: number = Number(envData.PORT) || 3000
export const SALT_ROUNDS: number = Number(envData.SALT_ROUNDS) || 10
export const SECRET_KEY: string = envData.SECRET_KEY ?? 'default_key'
export const CLOUDINARY = cloudinary.v2
export const DATABASE = database
