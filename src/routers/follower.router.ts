import { Router } from 'express'
import { FollowerController } from '../controllers/follower.controller'

export const FollowerRouter = Router()

FollowerRouter.get('/', FollowerController.getAll)
FollowerRouter.get('/user/:userId', FollowerController.getUserFollowersIds)

FollowerRouter.post('/', FollowerController.create)

FollowerRouter.delete('/', FollowerController.delete)
