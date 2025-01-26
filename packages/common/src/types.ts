import {z} from 'zod'


export const RegisterSchema = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),

    username: z.string().min(3).max(20),
    password:z.string()

})


export const LoginSchema = z.object({
    username: z.string().min(3).max(20),
    password:z.string()

})


export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})