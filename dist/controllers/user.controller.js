import { validatePartialUser } from '../schemas/user.schema.js';
import { UserModel } from '../models/user.model.js';
import { CLOUDINARY, COOKIES } from '../settings.js';
import { Data } from '../structures/Data.js';
import { getSessionCookie } from '../utilities/getSessionCookie.js';
export class UserController {
    static async exists(request, response) {
        const { name, email } = request.query;
        if (!name && !email) {
            response
                .status(400)
                .json(Data.failure('Any name or email has been passed'));
            return;
        }
        if (name) {
            const nameExists = await UserModel.nameExists({ name: String(name) });
            response.json(Data.success(nameExists));
        }
        else if (email) {
            const emailExists = await UserModel.emailExists({ email: String(email) });
            response.json(Data.success(emailExists));
        }
    }
    static async liked(request, response) {
        const { type, userId, targetId } = request.query;
        if (!type) {
            response.status(400).json(Data.failure('Type is missing'));
            return;
        }
        if (type !== 'comment' && type !== 'post') {
            response.status(400).json(Data.failure('Invalid type'));
            return;
        }
        if (!userId) {
            response.status(400).json(Data.failure('User ID is missing'));
            return;
        }
        if (!targetId) {
            response.status(400).json(Data.failure('Target ID is missing'));
            return;
        }
        if (type === 'comment') {
            const liked = await UserModel.likedComment({
                commentId: Number(targetId),
                userId: Number(userId)
            });
            response.json(Data.success(liked));
        }
        else if (type === 'post') {
            const liked = await UserModel.likedPost({
                postId: Number(targetId),
                userId: Number(userId)
            });
            response.json(Data.success(liked));
        }
    }
    static async getAll(request, response) {
        const { amount, page } = request.query;
        const users = await UserModel.getAll({ amount, page });
        response.json(Data.success(users));
    }
    static async search(request, response) {
        const { query } = request.query;
        if (!query) {
            response.status(400).json(Data.failure('Query parameter is missing'));
            return;
        }
        const users = await UserModel.search({ query: String(query) });
        response.json(Data.success(users));
    }
    static async getById(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const user = await UserModel.getById({ id: Number(id) });
        if (user) {
            response.json(Data.success(user));
        }
        else {
            response.status(404).json(Data.failure('User not found'));
        }
    }
    static async getByName(request, response) {
        const { name } = request.query;
        if (!name) {
            response.status(400).json(Data.failure('Name is missing'));
            return;
        }
        const user = await UserModel.getByName({ name: String(name) });
        if (user) {
            response.json(Data.success(user));
        }
        else {
            response.status(404).json(Data.failure('User not found'));
        }
    }
    static async getByEmail(request, response) {
        const { email } = request.query;
        if (!email) {
            response.status(400).json(Data.failure('Email is missing'));
            return;
        }
        const user = await UserModel.getByEmail({
            email: String(email)
        });
        if (user) {
            response.json(Data.success(user));
        }
        else {
            response.json(Data.failure('User not found'));
        }
    }
    static async register(request, response) {
        const { name, email, password } = request.body;
        const result = validatePartialUser({
            name,
            email,
            password
        });
        if (result.error) {
            response.status(400).json(Data.failure('Invalid user data'));
            return;
        }
        const user = await UserModel.register({
            name,
            email,
            password
        });
        if (!user) {
            response.status(400).json(Data.failure('Error during register'));
            return;
        }
        const sessionCookie = getSessionCookie(user);
        response
            .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
            .status(201)
            .json(Data.success(true));
    }
    static async login(request, response) {
        const { name, password } = request.body;
        const result = validatePartialUser({
            name,
            password
        });
        if (!result.success) {
            response.status(400).json(Data.failure('Invalid user data'));
            return;
        }
        const user = await UserModel.login({ name, password });
        if (!user) {
            response.json(false);
            return;
        }
        const sessionCookie = getSessionCookie(user);
        response
            .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
            .json(Data.success(true));
    }
    static async logout(_request, response) {
        response.clearCookie(COOKIES.SESSION).json(Data.success(true));
    }
    static async deleteImage(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const result = await CLOUDINARY.uploader.destroy(id);
        if (result.result === 'ok') {
            response.status(200).json(Data.success(true));
        }
        else {
            response
                .status(400)
                .json(Data.failure('Error during Cloudinary image destroy'));
        }
    }
    static async delete(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const deleteSuccess = await UserModel.delete({ id: Number(id) });
        if (!deleteSuccess) {
            response.status(404).json(Data.failure('User not found'));
            return;
        }
        response.json(Data.success(true));
    }
    static async update(request, response) {
        const { id } = request.query;
        if (!id) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const result = validatePartialUser(request.body);
        if (!result.success) {
            response.status(400).json(Data.failure(JSON.parse(result.error.message)));
            return;
        }
        const updateSuccess = await UserModel.update({
            id: Number(id),
            object: result.data
        });
        if (!updateSuccess) {
            response.status(404).json(Data.failure('No changes made'));
            return;
        }
        const user = await UserModel.getById({ id: Number(id) });
        if (!user) {
            response.json(Data.failure('User not found'));
            return;
        }
        const sessionCookie = getSessionCookie(user);
        response
            .cookie(COOKIES.SESSION, sessionCookie.token, sessionCookie.options)
            .json(Data.success(user));
    }
}
