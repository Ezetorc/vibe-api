import { config as dotenvConfig } from 'dotenv';
import mysql from 'mysql2';
import cloudinary from 'cloudinary';
dotenvConfig();
const envData = process.env;
cloudinary.v2.config({
    cloud_name: envData.CLOUD_NAME,
    api_key: envData.CLOUD_API_KEY,
    api_secret: envData.CLOUD_API_SECRET
});
const mysqlPool = mysql.createPool({
    uri: envData.MYSQL_PUBLIC_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
mysqlPool.getConnection((error, connection) => {
    if (connection) {
        console.log('✅ MySQL pool connection established!');
        connection.release();
    }
    else if (error) {
        console.error('❌ MySQL pool connection error:', error);
    }
});
export const ALLOWED_ORIGINS = [envData.FRONTEND_URL ?? ''];
export const PORT = Number(envData.PORT) || 3000;
export const SALT_ROUNDS = Number(envData.SALT_ROUNDS) || 10;
export const SECRET_KEY = envData.SECRET_KEY || 'default_key';
export const CLOUDINARY = cloudinary.v2;
export const DATABASE = mysqlPool;
