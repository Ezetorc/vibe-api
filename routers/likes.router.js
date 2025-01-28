import { Router } from 'express'
import { LikesController } from '../controllers/likes.controller.js'
import { tokenMiddleware } from '../middlewares/tokenMiddleware.js'

export const likesRouter = Router()

likesRouter.get('/', LikesController.getAll)

likesRouter.post('/', tokenMiddleware, LikesController.like)

likesRouter.delete('/id/:id', tokenMiddleware, LikesController.unlike)
