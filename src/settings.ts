import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

import mysql from 'mysql2'
import cloudinary from 'cloudinary'

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

const mysqlConnection = mysql.createConnection({
  host: envData.MYSQL_HOST,
  user: envData.MYSQL_USER,
  password: envData.MYSQL_PASSWORD,
  database: envData.MYSQL_DATABASE,
  port: Number(envData.MYSQL_PORT) || 3306
})

mysqlConnection.connect(error => {
  if (error) {
    console.error('MySQL Connection error: ', error)
  } else {
    console.log('MySQL Connection successful')
  }
})

export const DATABASE = mysqlConnection
