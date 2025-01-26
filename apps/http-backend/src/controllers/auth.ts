import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { RegisterSchema,LoginSchema } from '@repo/common/types'


export const register = async (req: Request, res: Response) => {
  try {
    const { password, username, ...data } = req.body
    const schema = RegisterSchema.safeParse(req.body);

    if(!schema.success) {
      res.status(400).json({message: "Zod validation failed"})
    }

    if (!password || !data || !username) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const exisitingUser = await User.findOne({ username: username })
    if (exisitingUser) {
      res.status(400).json({ message: 'Username already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      password: hashedPassword,
      username: username,
      ...data
    })
    if (!user) {
      res.status(400).json({ message: 'Unable to create user' })
      return
    }


    const token = jwt.sign(
      { userId: user?._id, username },
      JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    res.status(201).json({ token })
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
