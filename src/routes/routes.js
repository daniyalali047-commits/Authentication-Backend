import {Router} from 'express'
import * as authcontroller from '../controllers/authcontroller.js'  
const authRouter = Router()

//POST /api/auth/register
authRouter.post('/register', authcontroller.register)

//get api for login
authRouter.post('/login' , authcontroller.login)

//GET /api/auth/get-me
authRouter.get('/get-me', authcontroller.getMe)

//get route for ref
authRouter.get('/refresh-token', authcontroller.refreshToken)

//get api for logout
authRouter.get('/logout', authcontroller.logout)

//get api for logout all
authRouter.get('/logout-all', authcontroller.logoutAll)


export default authRouter

