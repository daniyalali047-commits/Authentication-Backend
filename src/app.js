import express from 'express'
import authRouter from './routes/routes.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))

app.use('/api/auth', authRouter)
export default app