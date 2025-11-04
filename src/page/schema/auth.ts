import { z } from 'zod'


export const authSchema = z.object({
    // ✅ FIX: Thêm .optional() vào cuối.
    // Zod sẽ bỏ qua validation min(6) nếu trường này không tồn tại (như trong form Đăng nhập).
    username: z.string().min(6, { message: "TÊN PHAI 6 KI TU" }).optional(),

    email: z.string().email({ message: " email phải đúng định dạng" }),
    password: z.string().min(6, { message: "mk k duoc bo trong" })

})

export type IAuth = z.infer<typeof authSchema>