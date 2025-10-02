import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const nav = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Kiểm tra localStorage khi mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  
    alert("đăng xuất tk")
  };

  const handleLogin = () => nav("/login");
  const handleRegister = () => nav("/register");

  return (
<header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">

      <div className="container mx-auto flex items-center justify-center p-4">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => nav("/")}>
          MyLogo
        </div>

        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Trang chủ</a>
          <a href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">Sản phẩm</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">Giới thiệu</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Liên hệ</a>
        </nav>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                Đăng nhập
              </button>
              <button onClick={handleRegister} className="px-4 py-2 border border-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-700">Xin chào, <strong>{user.username}</strong></span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
                                                                                        