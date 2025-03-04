import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

const mysql = await import('mysql2')
const cloudinary = await import('cloudinary')
const envData = process.env

cloudinary.v2.config({
  cloud_name: envData.CLOUD_NAME,
  api_key: envData.CLOUD_API_KEY,
  api_secret: envData.CLOUD_API_SECRET
})

export const PORT: number = Number(envData.PORT) || 3000
export const SALT_ROUNDS: number = Number(envData.SALT_ROUNDS) || 10
export const SECRET_KEY: string = envData.SECRET_KEY || 'default_key'
export const CLOUDINARY = cloudinary.v2

const mysqlUrl = envData.MYSQL_PUBLIC_URL
const mysqlConnection = mysql.createConnection(mysqlUrl!)

mysqlConnection.connect(error => {
  if (error) {
    console.error('MySQL Connection error: ', error)
  } else {
    console.log('MySQL Connection successful')
  }
})

export const DATABASE = mysqlConnection
