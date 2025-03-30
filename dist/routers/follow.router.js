import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller.js';
import { sessionMiddleware } from '../middlewares/session.middleware.js';
export const FollowRouter = Router();
// GET
FollowRouter.get('/', FollowController.getAll);
FollowRouter.get('/count', FollowController.getAmount);
FollowRouter.get('/exists', FollowController.exists);
// POST
FollowRouter.post('/:followingId', sessionMiddleware, FollowController.create);
// DELETE
FollowRouter.delete('/:followingId', sessionMiddleware, FollowController.delete);
