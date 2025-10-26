import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Background from "../components/Background";
import Header from "../components/header.tsx";


const Layout: React.FC = () => {
  return (
    <Background>
      {/* Header cố định */}
      <Header />

      {/* Thân trang */}
      <div className="flex">
        {/* Nội dung chính (BoardPage hoặc các page khác) */}
        <div className="flex-1 p-6 overflow-y-auto">
       
          <Outlet /> {/* Render route con (BoardPage hoặc BoardDetail) */}
        </div>
      </div>
    </Background>
  );
};

export default Layout;