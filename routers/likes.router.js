import { Router } from 'express'
import { LikesController } from '../controllers/likes.controller.js'

export const likesRouter = Router()

likesRouter.get('/', LikesController.getAll)

likesRouter.post('/', LikesController.like)

likesRouter.delete('/:id', LikesController.unlike)
