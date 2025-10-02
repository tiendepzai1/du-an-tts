
import {z} from 'zod'
import { message } from 'antd';


export const authSchema = z.object({
    username : z.string().min(6,{message:"TÊN PHAI 6 KI TU"}),
    password : z.string().min(6,{message:"MẬT KHẨU PHAI 6 KI TU"})

})

export type IAuth =  z.infer<typeof authSchema>