import express from 'express'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
const app: express.Application = express();

app.use(express.json())
app.use(
  cors({
    origin: true
  })
)

app.use('/auth', authRoutes)

export default app