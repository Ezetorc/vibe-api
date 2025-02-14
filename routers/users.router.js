import { Router } from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { tokenMiddleware } from '../middlewares/tokenMiddleware.js'

export const usersRouter = Router()

usersRouter.post('/register', UsersController.register)
usersRouter.post('/login', UsersController.login)
usersRouter.post('/logout', tokenMiddleware, UsersController.logout)

usersRouter.get('/search/:query', UsersController.search)
usersRouter.get('/', UsersController.getAll)
usersRouter.get('/id/:id', UsersController.getById)
usersRouter.get('/username/:username', UsersController.getByUsername)
usersRouter.get('/emailExists/:email', UsersController.emailExists)

usersRouter.delete('/id/:id', tokenMiddleware, UsersController.delete)

usersRouter.patch('/id/:id', tokenMiddleware, UsersController.update)
