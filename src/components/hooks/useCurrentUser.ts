// SỬA FILE: src/components/hooks/useCurrentUser.ts

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Thêm import useNavigate

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // ✅ Khai báo useNavigate

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        // ✅ FIX 1: Nếu không có token, chuyển hướng về Login
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:3000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);

        // ✅ FIX 2: Xử lý lỗi 401/Token hết hạn
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          setError("Token hết hạn hoặc không hợp lệ.");
        } else {
          setError(err.message || "Failed to fetch user");
        }
        setCurrentUser(null);

      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token, navigate]);

  return { currentUser, loading, error };
};