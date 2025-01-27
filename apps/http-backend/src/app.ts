import express from 'express'
import authRoutes from './routes/authRoutes'
import roomRoutes from './routes/roomRoutes'
import cors from 'cors'
const app: express.Application = express()

app.use(express.json())
app.use(
  cors({
    origin: true,
  }),
)

app.use('/auth', authRoutes)
app.use('/api', roomRoutes)

export default app
