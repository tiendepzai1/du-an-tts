// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/Login";
import { Register } from "./page/Register";
import PrivateRoute from "./privateRoute";
import Layout from "./page/Layout";
import BoardPage from "./components/board/BoardPage.tsx";
import BoardDetail from "./components/board/BoardDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang công khai */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route được bảo vệ */}
        <Route
          path="/"
          element={<PrivateRoute />} // Chỉ dùng PrivateRoute để kiểm tra token
        >
          {/* Sử dụng Layout làm wrapper cho các route con */}
          <Route element={<Layout />}>
            <Route index element={<BoardPage />} />
            <Route path="/detail/:id" element={<BoardDetail />} />
            <Route path="/broad" element={<BoardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;