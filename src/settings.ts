import { config as dotenvConfig } from 'dotenv'
import mysql from 'mysql2'
import cloudinary from 'cloudinary'
dotenvConfig()
const envData = process.env

console.log('🔍 Variables de entorno disponibles:', envData)
console.log('2 🔍 MYSQL_PUBLIC_URL:', envData.MYSQL_PUBLIC_URL)

cloudinary.v2.config({
  cloud_name: envData.CLOUD_NAME,
  api_key: envData.CLOUD_API_KEY,
  api_secret: envData.CLOUD_API_SECRET
})

export const PORT: number = Number(envData.PORT) || 3000
export const SALT_ROUNDS: number = Number(envData.SALT_ROUNDS) || 10
export const SECRET_KEY: string = envData.SECRET_KEY || 'default_key'
export const CLOUDINARY = cloudinary.v2

const mysqlUrl =
  process.env.MYSQL_PUBLIC_URL || 'mysql://root:password@host:port/database'

console.log('1 🔍 MYSQL_PUBLIC_URL:', mysqlUrl)

const mysqlConnection = mysql.createConnection(mysqlUrl)

mysqlConnection.connect(error => {
  if (error) {
    console.error('❌ MySQL Connection error: ', error)
  } else {
    console.log('✅ MySQL Connection successful')
  }
})

export const DATABASE = mysqlConnection
