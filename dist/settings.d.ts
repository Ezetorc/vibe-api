import cloudinary from 'cloudinary';
export declare const PORT: number;
export declare const SALT_ROUNDS: number;
export declare const SECRET_KEY: string;
export declare const CLOUDINARY: typeof cloudinary.v2;
export declare const DATABASE: import("mysql2/typings/mysql/lib/Connection").Connection;
export declare const COOKIES: {
    SESSION: string;
};
export declare const NODE_ENV: string | undefined;
