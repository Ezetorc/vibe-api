import { Router } from 'express'
import { FollowersController } from '../controllers/followers.controller.js'

export const followersRouter = Router()

followersRouter.get('/', FollowersController.getAll)
followersRouter.get('/user/:userId', FollowersController.getUserFollowers)

followersRouter.post('/', FollowersController.create)

followersRouter.delete('/', FollowersController.delete)
