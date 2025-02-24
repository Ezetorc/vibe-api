const sqlite3 = await import('sqlite3');
const { Database } = sqlite3.default;
const envData = process.env;
export const PORT = Number(envData.PORT) || 3000;
export const SALT_ROUNDS = Number(envData.SALT_ROUNDS) || 10;
export const SECRET_KEY = envData.SECRET_KEY || 'default_key';
export const DATABASE = new Database('C:/Users/ezepl/Documents/Code/Databases/vibedb.db', error => {
    if (error) {
        console.error('Connection error: ', error);
    }
    else {
        console.log('Connection successful');
        DATABASE.run('PRAGMA foreign_keys = ON');
    }
});
