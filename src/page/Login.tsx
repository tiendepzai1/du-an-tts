import { useForm } from 'react-hook-form'
import { type IAuth, authSchema } from './schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'


import { useNavigate } from 'react-router-dom'
import API from '../api'


export const Login = () => {
  const nav = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm<IAuth>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: IAuth) => {
    try {
      const res = await API.post("/user/login", data);
      console.log(res);
      console.log("Đăng nhập thành công");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", JSON.stringify({ username: res.data.data.username }));
      nav("/");
      alert("đăng nhập tk")
    } catch (error) {
      console.log(error);
      console.log("Đăng nhập thất bại");
    }
  };

 return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-lg w-full max-w-md border border-blue-100"
  >
    <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
      Đăng Nhập
    </h2>

    {/* Username */}
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        type="text"
        {...register("username")}
        placeholder="Nhập tên đăng nhập..."
        className={`w-full px-4 py-2 border ${
          errors?.username ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
      />
      {errors?.username && (
        <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
      )}
    </div>

    {/* Email */}
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        {...register("email")}
        placeholder="Nhập email của bạn..."
        className={`w-full px-4 py-2 border ${
          errors?.email ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
      />
      {errors?.email && (
        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
      )}
    </div>

    {/* Password */}
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Mật khẩu
      </label>
      <input
        type="password"
        {...register("password")}
        placeholder="••••••••"
        className={`w-full px-4 py-2 border ${
          errors?.password ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
      />
      {errors?.password && (
        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
      )}
    </div>

    {/* Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 font-medium py-2.5 rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-300 focus:outline-none"
    >
      Đăng Nhập
    </button>

    {/* Optional link */}
    <p className="text-center text-sm text-gray-600 mt-4">
      Chưa có tài khoản?{" "}
      <a href="/register" className="text-blue-600 hover:underline">
        Đăng ký ngay
      </a>
    </p>
  </form>
</div>

);

};
