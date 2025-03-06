import { Router } from 'express';
import { LikeController } from '../controllers/like.controller.js';
export const LikeRouter = Router();
// GET
LikeRouter.get('/all', LikeController.getAll);
// POST
LikeRouter.post('/', LikeController.create);
// DELETE
LikeRouter.delete('/id', LikeController.delete);
