import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware';
import { createRoom } from '../controllers/roomController';

const router = express.Router();


router.post('/room', authMiddleware, createRoom)


export default router;