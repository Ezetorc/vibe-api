import { DATABASE } from '../settings.js';
export function execute(query, params = []) {
    return new Promise(resolve => {
        DATABASE.query(query, params, (error, rows) => {
            if (error) {
                resolve({ error, rows: [], failed: true });
            }
            else {
                resolve({ error: null, rows: rows, failed: false });
            }
        });
    });
}
