import { Router } from 'express'
import { LikesController } from '../controllers/likes.controller.js'

export const likesRouter = Router()

likesRouter.get('/posts', LikesController.getAllOfPosts)
likesRouter.get('/comments', LikesController.getAllOfComments)
likesRouter.get('/posts/id/:id', LikesController.getAllOfPost)
likesRouter.get('/comments/id/:id', LikesController.getAllOfComment)

likesRouter.post('/', LikesController.create)

likesRouter.delete('/id/:id', LikesController.delete)
