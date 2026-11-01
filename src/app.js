import express from 'express'
import authRouter from './routes/routes.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))

app.use('/api/auth', authRouter)
export default app