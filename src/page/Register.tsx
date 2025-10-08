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
        register,
        formState :{errors}
        
    } = useForm<IAuth>({ resolver: zodResolver(authSchema) })

    const onSubmit = async (data: IAuth) => {
        try {
            const res = await axios.post("http://localhost:3000/user/register", data)
            console.log(res)
            message.success("Đăng ký thành công")
            alert("đăng ký thành công")
            nav("/login")
        } catch (error) {
            console.log(error)
            message.error("Đăng ký thất bại")
        }
    }

    return (
            <div  className="flex items-center justify-center min-h-screen bg-gray-100">

        <div className="bg-white p-6 rounded-lg shadow-lg">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Đăng Nhập</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register("username")}
              className={`mt-1 block w-full px-3 py-2 border ${errors?.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors?.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">email</label>
            <input
              type="text"
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border ${errors?.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 block w-full px-3 py-2 border ${errors?.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors?.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>


          <button
            type="submit"
            className="w-full bg-blue-600  py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
           đăng ký
          </button>
        </form>
        </div>
      </div>
    )
}
