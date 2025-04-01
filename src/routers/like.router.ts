import { Router } from 'express'
import { LikeController } from '../controllers/like.controller.js'
import { sessionMiddleware } from '../middlewares/session.middleware.js'

export const LikeRouter = Router()

// GET
LikeRouter.get('/', LikeController.getAll)
LikeRouter.get('/count', LikeController.getCount)

// POST
LikeRouter.post('/', sessionMiddleware, LikeController.create)

// DELETE
LikeRouter.delete('/:id', sessionMiddleware, LikeController.delete)
