import { useForm } from 'react-hook-form'
import { type IAuth, authSchema } from './schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'



export const Register = () => {
    const nav = useNavigate()
    const {
        handleSubmit,
        register
    } = useForm<IAuth>({ resolver: zodResolver(authSchema) })

    const onSubmit = async (data: IAuth) => {
        try {
            const res = await axios.post("http://localhost:3000/user/register", data)
            console.log(res)
            message.success("Đăng ký thành công")
            nav("/login")
        } catch (error) {
            console.log(error)
            message.error("Đăng ký thất bại")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input 
                        type="text" 
                        {...register("username")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input 
                        type="password" 
                        {...register("password")}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                    Đăng ký
                </button>
            </form>
        </div>
    )
}
