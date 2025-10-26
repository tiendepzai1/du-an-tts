import { useEffect, useState } from "react";
import axios from "axios";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const token = localStorage.getItem("token");
console.log("Token from localStorage:", token); // Log token trước khi gọi API

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
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
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  return { currentUser, loading, error };
};