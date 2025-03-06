import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { sessionMiddleware } from '../middlewares/session.middleware.js';
export const PostRouter = Router();
// GET
PostRouter.get('/all', PostController.getAll);
PostRouter.get('/search', PostController.search);
PostRouter.get('/id', PostController.getById);
// POST
PostRouter.post('/', sessionMiddleware, PostController.create);
// DELETE
PostRouter.delete('/id', sessionMiddleware, PostController.delete);
// PATCH
PostRouter.patch('/id', sessionMiddleware, PostController.update);
