import { RowDataPacket } from 'mysql2';
export declare function execute<T = RowDataPacket[]>(query: string, params?: unknown[]): Promise<{
    error: Error | null;
    rows: T;
    failed: boolean;
}>;
