import React from "react";
import Background from "../components/Background";
import Header from "../components/header.tsx";
import Sidebar from "../components/sidebar";
import BoardPage from "../page/board/BoardPage.tsx"; // 👈 import thêm BoardPage

const Layout: React.FC = () => {
  return (
    <Background>
      {/* Header cố định */}
      <Header />

      {/* Thân trang */}
      <div className="flex">
        {/* Sidebar bên trái */}
        <Sidebar />

        {/* Nội dung chính (BoardPage hoặc các page khác) */}
        <div className="flex-1 p-6 overflow-y-auto">
          <BoardPage />
        </div>
      </div>
    </Background>
  );
};

export default Layout;
