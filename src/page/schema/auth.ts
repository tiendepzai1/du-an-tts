
import { z } from 'zod'




export const authSchema = z.object({
    username: z.string().min(6, { message: "TÊN PHAI 6 KI TU" }),
    email : z.string().email({message : " email phải đúng định dạng"}),
    password: z.string().min(6, { message: "mk k duoc bo trong" })

})

export type IAuth = z.infer<typeof authSchema>