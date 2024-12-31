import { Router } from 'express'
import { UsersController } from '../controllers/users.controller.js'

export const usersRouter = Router()

usersRouter.get('/', UsersController.getAll)
usersRouter.get('/:id', UsersController.getById)

usersRouter.post('/', UsersController.create)

usersRouter.delete('/:id', UsersController.delete)

usersRouter.patch('/:id', UsersController.update)
