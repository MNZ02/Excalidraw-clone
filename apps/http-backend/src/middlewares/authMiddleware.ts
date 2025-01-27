import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'

interface Decoded {
  userId: string
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(403).json({ message: 'Invalid token' })
    return
  }
  const token = authHeader?.split(' ')[1]

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET)
    req.userId = (decoded as Decoded).userId
    next()
  } catch (error) {
    res.status(403).json({ message: 'Error decoding auth token' })
  }
}
