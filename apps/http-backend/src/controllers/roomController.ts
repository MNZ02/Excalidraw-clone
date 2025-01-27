import { Request, Response } from 'express'
import { CreateRoomSchema } from '@repo/common/types'

export const createRoom = async (req: Request, res: Response) => {
  try {
    const data = CreateRoomSchema.safeParse(req.body)
    if (!data.success) {
      res.status(400).json({ message: 'Zod validation failedCreateRoomSchema' })
      return
    }
  } catch (error) {}
}
