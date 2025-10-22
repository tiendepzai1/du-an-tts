import { useForm } from "react-hook-form";
import { type IAuth, authSchema } from "./schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// 👉 Tạo 1 instance axios riêng có interceptor tự động thêm token
const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // Đổi nếu backend của bạn khác
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: tự động thêm Authorization header nếu có token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const Login = () => {
  const nav = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IAuth>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: IAuth) => {
    try {
      // Đăng nhập
      const res = await axiosClient.post("/user/login", data);

      console.log("Phản hồi từ backend:", res.data);

      // ✅ Lưu token và username vào localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "username",
        JSON.stringify({ username: res.data.data.username })
      );

      alert("Đăng nhập thành công!");
      nav("/Layout");
    } catch (error: any) {
      if (error.response) {
        console.error("Lỗi từ backend:", error.response.data);
        alert(error.response.data.message || "Đăng nhập thất bại!");
      } else {
        console.error(error);
        alert("Lỗi kết nối đến server!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-blue-200/80 text-sm">
            Đăng nhập để tiếp tục công việc
          </p>
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
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                {...register("username")}
                placeholder="Nhập tên đăng nhập..."
                className={`w-full pl-12 pr-4 py-3 border-2 ${
                  errors?.username
                    ? "border-red-400/50 bg-red-500/10"
                    : "border-white/20 bg-white/10 hover:bg-white/15"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm text-white placeholder-white/50 backdrop-blur-sm`}
              />
            </div>
            {errors?.username && (
              <p className="mt-2 text-red-300 text-xs flex items-center">
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
                <svg
                  className="w-6 h-6 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                {...register("email")}
                placeholder="Nhập email của bạn..."
                className={`w-full pl-16 pr-6 py-5 border-2 ${
                  errors?.email
                    ? "border-red-400/50 bg-red-500/10"
                    : "border-white/20 bg-white/10 hover:bg-white/15"
                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-xl text-white placeholder-white/50 backdrop-blur-sm`}
              />
            </div>
            {errors?.email && (
              <p className="mt-3 text-red-300 text-sm flex items-center">
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
                <svg
                  className="w-6 h-6 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full pl-16 pr-6 py-5 border-2 ${
                  errors?.password
                    ? "border-red-400/50 bg-red-500/10"
                    : "border-white/20 bg-white/10 hover:bg-white/15"
                } rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-xl text-white placeholder-white/50 backdrop-blur-sm`}
              />
            </div>
            {errors?.password && (
              <p className="mt-3 text-red-300 text-sm flex items-center">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 font-bold py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-2xl hover:shadow-3xl text-xl backdrop-blur-sm border border-white/20"
          >
            Đăng Nhập
          </button>

          {/* Optional link */}
          <div className="text-center mt-8">
            <p className="text-white/70 text-lg">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-300 hover:text-blue-200 font-bold hover:underline transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
