import express from 'express'
import { register } from '../controllers/auth'

const router: express.Router = express.Router()
router.post('/register', register)
// router.post('/login', login)

export default router
