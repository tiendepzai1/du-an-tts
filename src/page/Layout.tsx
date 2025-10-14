import React, { useState } from "react";
import Background from "../components/Background";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import Column from "../components/Column";

const Layout: React.FC = () => {
  const [columns, setColumns] = useState([
    {
      title: "Hướng dẫn cho người mới dùng Trello",
      color: "#5B2C91",
      cards: [
        {
          id: 1,
          title: "New to Trello? Start here",
          description: "Video hướng dẫn cơ bản về Trello",
        },
        {
          id: 2,
          title: "Nắm bắt từ email, Slack và Teams",
          description: "Cách tích hợp công cụ liên lạc",
        },
      ],
    },
    {
      title: "Product Backlog",
      color: "#9C8700",
      cards: [
        {
          id: 3,
          title: "AUTHENTICATION (ĐĂNG KÝ / ĐĂNG NHẬP)",
          description: "Tạo chức năng xác thực người dùng",
        },
      ],
    },
    {
      title: "Ready this week",
      color: "#1E5631",
      cards: [
        { id: 4, title: "KHỞI TẠO & CẤU HÌNH DỰ ÁN NHÓM 1" },
        { id: 5, title: "KHỞI TẠO & CẤU HÌNH DỰ ÁN NHÓM 3" },
        { id: 6, title: "KHỞI TẠO & CẤU HÌNH DỰ ÁN NHÓM 2" },
      ],
    },
    { title: "In Progress", color: "#5B2C6F", cards: [] },
    { title: "Blocked", color: "#1A237E", cards: [] },
    { title: "Code Review", color: "#641E16", cards: [] },
    
  ]);

  // 🧩 Thêm cột mới
  const addColumn = () => {
    const newTitle = prompt("Nhập tên cột mới:");
    if (newTitle) {
      setColumns([
        ...columns,
        { title: newTitle, color: "#2c2f48", cards: [] },
      ]);
    }
  };

  return (
    <Background>
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex gap-4 p-6 overflow-x-auto">
          {columns.map((col, idx) => (
            <Column
              key={idx}
              title={col.title}
              cards={col.cards}
              bgColor={col.color}
            />
          ))}

          {/* ✅ Nút thêm cột */}
          <button
            onClick={addColumn}
            className="w-72 flex-shrink-0 rounded-xl bg-[#a084ca]/30 border-2 border-dashed border-gray-400 text-white font-medium hover:bg-[#a084ca]/50 transition"
          >
            + Add another list
          </button>
        </div>
      </div>
    </Background>
  );
};

export default Layout;
