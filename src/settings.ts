import { config as dotenvConfig } from 'dotenv'
import mysql from 'mysql2'
import cloudinary from 'cloudinary'
dotenvConfig()
const envData = process.env

cloudinary.v2.config({
  cloud_name: envData.CLOUD_NAME,
  api_key: envData.CLOUD_API_KEY,
  api_secret: envData.CLOUD_API_SECRET
})

const mysqlConnection = mysql.createConnection(envData.MYSQL_PUBLIC_URL!)
mysqlConnection.connect(error => {
  if (error) {
    console.error('❌ MySQL Connection error: ', error)
  }
})

export const ALLOWED_ORIGINS: string[] = [envData.API_URL ?? '']
export const PORT: number = Number(envData.PORT) || 3000
export const SALT_ROUNDS: number = Number(envData.SALT_ROUNDS) || 10
export const SECRET_KEY: string = envData.SECRET_KEY || 'default_key'
export const CLOUDINARY = cloudinary.v2
export const DATABASE = mysqlConnection
export const NODE_ENV = envData.NODE_ENV
