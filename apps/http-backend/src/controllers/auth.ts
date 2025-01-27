import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { RegisterSchema,LoginSchema } from '@repo/common/types'
import {prismaClient} from '@repo/db/client'

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = RegisterSchema.safeParse(req.body);

    if(!parsedData.success) {
      res.status(400).json({message: "Zod validation failed"})
      return
    }

    try {
     await prismaClient.user.create({
      data: {
       firstName: parsedData.data.firstName,
       lastName: parsedData.data.lastName,
       username: parsedData.data.username,
       password: parsedData.data.password  || ''
      }
     }) 
    } catch (error) {
      res.status(411).json({message: "User already exists with this username"})
    }
 


    res.status(201).json({ userId:'123' })
  } catch (error) {
    console.error('Error registering user', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const schema = LoginSchema.safeParse(req.body);

    if(!schema.success) {
      res.status(400).json({message: "Zod validation failed"})
    }

    if (!username || !password) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const existingUser = await User.findOne({ username })
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const comparedPassword = bcrypt.compare(
      password,
      existingUser?.password as string
    )
    if (!comparedPassword) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { userId: existingUser?._id, username },
      JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error while logging in', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
