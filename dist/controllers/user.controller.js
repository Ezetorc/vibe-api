import { validatePartialUser } from '../schemas/user.schema.js';
import { UserModel } from '../models/user.model.js';
import { CLOUDINARY } from '../settings.js';
import { Data } from '../structures/Data.js';
import { getAuthorization } from '../utilities/getAuthorization.js';
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
        const { id } = request.params;
        const { type, targetId } = request.query;
        if (!type) {
            response.status(400).json(Data.failure('Type is missing'));
            return;
        }
        if (type !== 'comment' && type !== 'post') {
            response.status(400).json(Data.failure('Invalid type'));
            return;
        }
        if (!id) {
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
                userId: Number(id)
            });
            response.json(Data.success(liked));
        }
        else if (type === 'post') {
            const liked = await UserModel.likedPost({
                postId: Number(targetId),
                userId: Number(id)
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
        const { query } = request.params;
        const { amount, page } = request.query;
        if (!query) {
            response.status(400).json(Data.failure('Query parameter is missing'));
            return;
        }
        const users = await UserModel.search({
            query: String(query),
            amount,
            page
        });
        response.json(Data.success(users));
    }
    static async getById(request, response) {
        const { id } = request.params;
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
    static async register(request, response) {
        const result = validatePartialUser(request.body);
        if (result.error ||
            !result.data.name ||
            !result.data.email ||
            !result.data.password) {
            response.status(400).json(Data.failure('Invalid user data'));
            return;
        }
        const user = await UserModel.register({
            name: result.data.name,
            email: result.data.email,
            password: result.data.password
        });
        if (!user) {
            response.status(401).json(Data.failure('Error during register'));
            return;
        }
        const authorization = getAuthorization(user.id);
        response
            .setHeader('Authorization', `Bearer ${authorization}`)
            .setHeader('Access-Control-Expose-Headers', 'Authorization')
            .json(Data.success({ user }));
    }
    static async login(request, response) {
        const result = validatePartialUser(request.body);
        if (!result.success || !result.data.name || !result.data.password) {
            response.status(400).json(Data.failure('Invalid user data'));
            return;
        }
        const user = await UserModel.login({
            name: result.data.name,
            password: result.data.password
        });
        if (!user) {
            response.json(Data.success(false));
            return;
        }
        const authorization = getAuthorization(user.id);
        response
            .setHeader('Authorization', `Bearer ${authorization}`)
            .setHeader('Access-Control-Expose-Headers', 'Authorization')
            .json(Data.success(true));
    }
    static async deleteImage(request, response) {
        const publicId = request.params;
        if (!publicId) {
            response.status(400).json(Data.failure('ID is missing'));
            return;
        }
        const result = await CLOUDINARY.uploader.destroy(String(publicId.publicId));
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
        const id = request.userId;
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
        const id = request.userId;
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
        response.json(Data.success(user));
    }
}
