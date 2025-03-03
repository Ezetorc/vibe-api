const dotenv = await import('dotenv');
dotenv.config();
const sqlite3 = await import('sqlite3');
const cloudinary = await import('cloudinary');
const { Database } = sqlite3.default;
const envData = process.env;
cloudinary.v2.config({
    cloud_name: envData.CLOUD_NAME,
    api_key: envData.CLOUD_API_KEY,
    api_secret: envData.CLOUD_API_SECRET
});
export const PORT = Number(envData.PORT) || 3000;
export const SALT_ROUNDS = Number(envData.SALT_ROUNDS) || 10;
export const SECRET_KEY = envData.SECRET_KEY || 'default_key';
export const CLOUDINARY = cloudinary.v2;
export const DATABASE = new Database('C:/Users/ezepl/Documents/Code/Databases/vibedb.db', error => {
    if (error) {
        console.error('Connection error: ', error);
    }
    else {
        console.log('Connection successful');
        DATABASE.run('PRAGMA foreign_keys = ON');
    }
});
