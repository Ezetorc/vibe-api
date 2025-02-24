import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { tokenMiddleware } from '../middlewares/token.middleware.js'

export const UserRouter = Router()

UserRouter.post('/register', UserController.register)
UserRouter.post('/login', UserController.login)
UserRouter.post('/logout', tokenMiddleware, UserController.logout)

UserRouter.get('/search/:query', UserController.search)
UserRouter.get('/', UserController.getAll)
UserRouter.get('/id/:id', UserController.getById)
UserRouter.get('/username/:username', UserController.getByUsername)
UserRouter.get('/emailExists/:email', UserController.emailExists)
UserRouter.get('/nameExists/:name', UserController.nameExists)

UserRouter.delete('/id/:id', tokenMiddleware, UserController.delete)

UserRouter.patch('/id/:id', tokenMiddleware, UserController.update)
