import {Router} from 'express'
import * as authcontroller from '../controllers/authcontroller.js'  
const authRouter = Router()

//POST /api/auth/register
authRouter.post('/register', authcontroller.register)

//GET /api/auth/get-me
authRouter.get('/get-me', authcontroller.getMe)

//get route for ref
authRouter.get('/refresh-token', authcontroller.refreshToken)
export default authRouter