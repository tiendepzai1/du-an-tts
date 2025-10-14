import { LayoutDashboard, List, CreditCard, BarChart3, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Bảng", path: "/broadList", icon: LayoutDashboard },
    { name: "Danh sách", path: "/listDisplay", icon: List },
    { name: "Thẻ", path: "/cardList", icon: CreditCard },
    { name: "Báo cáo", path: "/report", icon: BarChart3 },
    { name: "Cài đặt", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-60px)] bg-[#1a1a2e]/90 text-gray-200 rounded-r-xl shadow-lg flex flex-col">
      {/* Header sidebar */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white">
          T
        </div>
        <h2 className="text-base font-semibold">Sidebar
          
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm font-medium rounded-md transition-colors 
               ${isActive ? "bg-blue-600 text-white" : "hover:bg-[#2d2d40]"}`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-4 text-xs text-gray-400">
        © 2025 CodeFarm
      </div>
    </aside>
  );
}
