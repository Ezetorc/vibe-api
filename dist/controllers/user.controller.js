import { validatePartialUser } from '../schemas/user.schema.js';
import { getAccessToken } from '../utilities/getAccessToken.js';
import { UserModel } from '../models/user.model.js';
export class UserController {
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const users = await UserModel.getAll({ amount, page });
        response.json(users);
    }
    static async emailExists(request, response) {
        const { email } = request.params;
        const emailExists = await UserModel.exists({ email });
        response.json(emailExists);
    }
    static async nameExists(request, response) {
        const { name } = request.params;
        const nameExists = await UserModel.exists({ name });
        response.json(nameExists);
    }
    static async getByUsername(request, response) {
        const { username } = request.params;
        const user = await UserModel.getByName({ name: username });
        response.json(user);
    }
    static async getById(request, response) {
        const { id } = request.params;
        const users = await UserModel.getById({ id: Number(id) });
        response.json(users);
    }
    static async search(request, response) {
        const { query } = request.params;
        if (!query || query.trim() === '') {
            response.status(400).json({ error: 'Query parameter is required' });
            return;
        }
        const users = await UserModel.search({ query });
        response.json(users);
    }
    static async register(request, response) {
        const { name, email, password } = request.body;
        const result = validatePartialUser({
            name,
            email,
            password
        });
        if (result.error) {
            response.status(400).json({ error: JSON.parse(result.error.message) });
            return;
        }
        const registered = await UserModel.register({
            name,
            email,
            password
        });
        if (!registered) {
            response.status(400).json({ message: 'Error when registering' });
            return;
        }
        const registeredUser = await UserModel.getByName({ name });
        if (!registeredUser) {
            response.status(400).json({ message: 'User not found' });
            return;
        }
        const accessToken = getAccessToken(registeredUser);
        response
            .cookie('access_token', accessToken.token, accessToken.config)
            .status(201)
            .json({ success: true, id: registeredUser.id });
    }
    static async login(request, response) {
        const { name, password } = request.body;
        const result = validatePartialUser({
            name,
            password
        });
        if (!result.success) {
            response.status(400).json({ error: "Invalid name or password" });
            return;
        }
        const user = await UserModel.login({ name, password });
        if (!user) {
            response.json({ success: false });
            return;
        }
        const accessToken = getAccessToken(user);
        response
            .cookie('access_token', accessToken.token, accessToken.config)
            .json({ success: true, user });
    }
    static async logout(_request, response) {
        response.clearCookie('access_token').json({ message: 'Logged out' });
    }
    static async delete(request, response) {
        const { id } = request.params;
        const userDeleted = await UserModel.delete({ id: Number(id) });
        if (!userDeleted) {
            response.status(404).json({ message: 'User not found' });
            return;
        }
        response.json({ message: 'User deleted successfully' });
    }
    static async update(request, response) {
        const result = validatePartialUser(request.body);
        if (!result.success) {
            response.status(400).json({ error: JSON.parse(result.error.message) });
            return;
        }
        const { id } = request.params;
        const userUpdate = await UserModel.update({
            id: Number(id),
            object: result.data
        });
        if (!userUpdate) {
            response
                .status(404)
                .json({ message: 'User not found or no changes made' });
            return;
        }
        const updatedUser = await UserModel.getById({ id: Number(id) });
        const accessToken = getAccessToken(updatedUser);
        response
            .cookie('access_token', accessToken.token, accessToken.config)
            .json({
            message: 'User updated successfully',
            user: updatedUser
        });
    }
}
