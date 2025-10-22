import { useForm } from 'react-hook-form'
import { type IAuth, authSchema } from './schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'

import { message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'








export const Register = () => {
    const nav = useNavigate()
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset, setError


    } = useForm<IAuth>({ resolver: zodResolver(authSchema) })



    const onSubmit = async (data: IAuth) => {
        try {
            const res = await axios.post("http://localhost:3000/user/register", data);

            message.success("Đăng ký thành công");
            console.log(res)
            alert("Đăng ký thành công");
            reset();
            nav("/login");
        } catch (error: any) {
            // Kiểm tra phản hồi từ backend
            if (axios.isAxiosError(error) && error.response) {
                const backendError = error.response.data;
                if (backendError.field && backendError.message) {
                    // Gán lỗi cụ thể vào form (ví dụ username hoặc email)
                    setError(backendError.field, { message: backendError.message });
                } else {
                    message.error(backendError.message || "Đăng ký thất bại");
                }
            } else {
                message.error("Lỗi kết nối đến server");
            }
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-40 left-40 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="relative w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent mb-2">
                        Join Us Today
                    </h1>
                    <p className="text-green-200/80 text-sm">Tạo tài khoản để bắt đầu hành trình</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20"
                >

                    {/* Username */}
                    <div className="mb-6">
                        <label className="block text-white font-bold mb-3 text-sm">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                {...register("username")}
                                placeholder="Nhập tên đăng nhập..."
                                className={`w-full pl-12 pr-4 py-3 border-2 ${errors?.username ? "border-red-400/50 bg-red-500/10" : "border-white/20 bg-white/10 hover:bg-white/15"
                                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm text-white placeholder-white/50 backdrop-blur-sm`}
                            />
                        </div>
                        {errors?.username && (
                            <p className="mt-2 text-red-300 text-xs flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-8">
                        <label className="block text-white font-bold mb-4 text-lg">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Nhập email của bạn..."
                                className={`w-full pl-16 pr-6 py-5 border-2 ${errors?.email ? "border-red-400/50 bg-red-500/10" : "border-white/20 bg-white/10 hover:bg-white/15"
                                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-xl text-white placeholder-white/50 backdrop-blur-sm`}
                            />
                        </div>
                        {errors?.email && (
                            <p className="mt-3 text-red-300 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-10">
                        <label className="block text-white font-bold mb-4 text-lg">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className={`w-full pl-16 pr-6 py-5 border-2 ${errors?.password ? "border-red-400/50 bg-red-500/10" : "border-white/20 bg-white/10 hover:bg-white/15"
                                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-xl text-white placeholder-white/50 backdrop-blur-sm`}
                            />
                        </div>
                        {errors?.password && (
                            <p className="mt-3 text-red-300 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 text-white font-bold py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-green-300 focus:outline-none shadow-2xl hover:shadow-3xl text-xl backdrop-blur-sm border border-white/20"
                    >
                        Đăng Ký
                    </button>

                    {/* Optional link */}
                    <div className="text-center mt-8">
                        <p className="text-white/70 text-lg">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-green-300 hover:text-green-200 font-bold hover:underline transition-colors">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
