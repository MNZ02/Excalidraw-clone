import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { RegisterSchema, LoginSchema } from '@repo/common/types'
import { prismaClient } from '@repo/db/client'

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = RegisterSchema.safeParse(req.body)

    if (!parsedData.success) {
      res.status(400).json({ message: 'Zod validation failed' })
      return
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)


    const existingUser = await prismaClient.user.findUnique({
      where:{username: parsedData.data.username}
    })

    if(existingUser) {
      res.status(400).json({message: "Username already exists"})
      return
    }

    const user = await prismaClient.user.create({
      data: {
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        username: parsedData.data.username,
        password: hashedPassword || '',
      },
    })

    const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn:'1h'}) 
    if(!token) {
      res.status(411).json({message:'Unable to generate token'})
      return
    }
    res.status(201).json({ token })
  } catch (error) {
    console.error('Error registering user', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = LoginSchema.safeParse(req.body)

    if (!parsedData.success) {
      res.status(400).json({ message: 'Zod validation failed' })
      return
    }


    const user = await prismaClient.user.findUnique({
      where: {username: parsedData.data.username}
    })

    if(!user) {
      res.status(404).json({message: "User not found"})
      return
    }

    const comparePassword = await bcrypt.compare(parsedData.data.password, user.password);

    if(!comparePassword) {
      res.status(400).json({message: "Password donot match"});
      return
    }

    const token = jwt.sign({userId: user?.id}, JWT_SECRET, {expiresIn:"1h"})
    if(!token) {
      res.status(411).json({message:'Unable to generate token'})
      return
    }
   

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error while logging in', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
