import { Router } from 'express'
import { UsersController } from '../controllers/user.controller.js'
import { tokenMiddleware } from '../middlewares/token.middleware.ts'

export const UserRouter = Router()

UserRouter.post('/register', UsersController.register)
UserRouter.post('/login', UsersController.login)
UserRouter.post('/logout', tokenMiddleware, UsersController.logout)

UserRouter.get('/search/:query', UsersController.search)
UserRouter.get('/', UsersController.getAll)
UserRouter.get('/id/:id', UsersController.getById)
UserRouter.get('/username/:username', UsersController.getByUsername)
UserRouter.get('/emailExists/:email', UsersController.emailExists)

UserRouter.delete('/id/:id', tokenMiddleware, UsersController.delete)

UserRouter.patch('/id/:id', tokenMiddleware, UsersController.update)
