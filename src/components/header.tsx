import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Share2, Star, MoreHorizontal, Grid, LogOut } from "lucide-react";

// Định nghĩa cấu trúc User khớp với dữ liệu lưu trong localStorage (key: 'user')
type CurrentUser = {
  _id: string;
  name: string; // ✅ Đổi từ username sang name (Giả định name là tên hiển thị)
  email: string;
};

export default function Header() {
  const nav = useNavigate();
  // ✅ FIX 1: Dùng CurrentUser type và key 'user'
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getCurrentUserFromStorage = (): CurrentUser | null => {
    // ✅ FIX 2: Lấy dữ liệu từ key 'user'
    const savedUserJson = localStorage.getItem("user");
    if (savedUserJson) {
      try {
        return JSON.parse(savedUserJson) as CurrentUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  // ✅ Khi component mount, lấy thông tin user đã đăng nhập
  useEffect(() => {
    setUser(getCurrentUserFromStorage());
  }, []);

  // ✅ Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // ✅ Xóa token và user object
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    alert("Đã đăng xuất thành công!");
    nav("/login"); // Chuyển hướng về trang đăng nhập
  };

  const handleLogin = () => nav("/login");
  const handleRegister = () => nav("/register");

  // ✅ FIX LỖI HIỂN THỊ: Sử dụng biến này để kiểm soát việc hiển thị trạng thái
  const isLoggedIn = user !== null;

  return (
    <>
      {/* ---------------- HEADER ---------------- */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1e1e2f]/90 backdrop-blur border-b border-white/10 z-50">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Grid className="w-5 h-5 text-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-xs font-bold">
              MH
            </div>
            <span className="font-semibold text-sm">
              {/* ✅ HIỂN THỊ TÊN USER */}
              {isLoggedIn ? (
                <>
                  Xin chào, <span className="text-blue-400">{user.name}</span>
                </>
              ) : (
                "Chào mừng bạn đến với MyBoard"
              )}
            </span>
          </div>
        </div>

        {/* CENTER: Search (Giữ nguyên) */}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>

          {/* ✅ FIX LỖI HIỂN THỊ KÉP: Chỉ hiển thị khối này nếu KHÔNG đăng nhập */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-1.5 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
              <button
                onClick={handleRegister}
                className="px-4 py-1.5 border border-blue-500 rounded-md text-sm font-medium hover:bg-blue-100 hover:text-blue-600 transition"
              >
                Đăng ký
              </button>
            </>
          ) : (
            // ✅ Chỉ hiển thị khối này nếu ĐÃ đăng nhập
            <>
              <div className="flex -space-x-2">
                {/* Giữ nguyên phần hình ảnh thành viên (Có thể thay thế bằng ảnh user thật) */}
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt="member"
                  className="w-8 h-8 rounded-full border-2 border-[#1e1e2f]"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="member"
                  className="w-8 h-8 rounded-full border-2 border-[#1e1e2f]"
                />
                <div className="w-8 h-8 bg-[#2d2d40] text-sm text-gray-300 rounded-full border-2 border-[#1e1e2f] flex items-center justify-center">
                  +3
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Star className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
                <Share2 className="w-5 h-5 hover:text-white cursor-pointer" />
                <Bell className="w-5 h-5 hover:text-white cursor-pointer" />
                <MoreHorizontal className="w-5 h-5 hover:text-white cursor-pointer" />
              </div>

              {/* Avatar + Dropdown */}
              <div className="relative">
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer select-none"
                >
                  {/* ✅ FIX 3: Dùng name và kiểm tra an toàn */}
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#2a2a3d] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                      {/* ✅ FIX 4: Hiển thị name */}
                      {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-400 hover:bg-[#3a3a50] transition"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}