import { Router } from 'express'
import { CommentsController } from '../controllers/comments.controller.js'

export const commentsRouter = Router()

commentsRouter.get('/', CommentsController.getAll)
commentsRouter.get('/id/:id', CommentsController.getById)
commentsRouter.get('/post/:id', CommentsController.getAllOfPost)

commentsRouter.delete('/id/:id', CommentsController.delete)
