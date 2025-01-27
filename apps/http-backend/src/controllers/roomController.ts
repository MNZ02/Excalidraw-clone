import { Request, Response } from 'express'
import { CreateRoomSchema } from '@repo/common/types'
import { prismaClient } from '@repo/db/client'

export const createRoom = async (req: Request, res: Response) => {
  try {
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if (!parsedData.success) {
      res.status(400).json({ message: 'Zod validation failedCreateRoomSchema' })
      return
    }

    const userId = req.userId
    if (!userId) {
       res.status(401).json({ message: 'User is not authenticated' })
       return
    }

    const existingRoom = await prismaClient.room.findUnique({
      where: { slug: parsedData.data.name },
    })

    if (existingRoom) {
      res.status(400).json({ message: 'Room already exists' })
      return
    }
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    })

    res.status(201).json({ roomId: room.id })
  } catch (error) {
    console.error('Error creating room', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
