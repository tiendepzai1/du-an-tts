import { useState } from "react";
import axios from "axios";
// Sử dụng import type cho kiểu
import type { Comment } from "../board/types";

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const fetchComments = async (cardId: string) => {
    try {
      setCommentLoading(true);
      setCommentError(null);
      const res = await axios.get(`http://localhost:3000/comment/card/${cardId}`);
      setComments(res.data || []);
    } catch (err: any) {
      console.error("Lỗi khi lấy bình luận:", err);
      setCommentError(err.response?.data?.message || "Lỗi khi lấy bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  const addComment = async (cardId: string, content: string) => {
    if (!token) return;
    try {
      setCommentLoading(true);
      setCommentError(null);
      const response = await axios.post(
        `http://localhost:3000/comment/add`,
        { content, cardId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]);
    } catch (err: any) {
      console.error("Lỗi khi thêm bình luận:", err);
      setCommentError(err.response?.data?.message || "Lỗi khi thêm bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  const editComment = async (commentId: string, content: string) => {
    if (!token) return;
    try {
      setCommentLoading(true);
      setCommentError(null);
      const response = await axios.put(
        `http://localhost:3000/comment/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.map((c) => (c._id === commentId ? response.data : c)));
    } catch (err: any) {
      console.error("Lỗi khi sửa bình luận:", err);
      setCommentError(err.response?.data?.message || "Lỗi khi sửa bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      setCommentLoading(true);
      setCommentError(null);
      await axios.delete(`http://localhost:3000/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err: any) {
      console.error("Lỗi khi xóa bình luận:", err);
      setCommentError(err.response?.data?.message || "Lỗi khi xóa bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  return { comments, commentLoading, commentError, fetchComments, addComment, editComment, deleteComment, setComments, setCommentError };
};