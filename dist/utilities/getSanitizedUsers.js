import { getSanitizedUser } from './getSanitizedUser.js';
export function getSanitizedUsers(users) {
    return users.map(user => getSanitizedUser(user));
}
