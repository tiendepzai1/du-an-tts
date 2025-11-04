import { useForm } from "react-hook-form";
// Sử dụng import type cho các kiểu
import type { Card, Comment, CommentFormInputs } from "./types";
import { useEffect } from "react";

interface CommentModalProps {
  card: Card;
  comments: Comment[];
  commentLoading: boolean;
  commentError: string | null;
  // Thêm username vào type để truy cập
  currentUser: { _id: string; name: string; email: string; username?: string; } | null;
  onClose: () => void;
  onSubmitComment: (data: CommentFormInputs) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
}

export const CommentModal = ({
  card,
  comments,
  commentLoading,
  commentError,
  currentUser,
  onClose,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  editingCommentId,
  setEditingCommentId,
}: CommentModalProps) => {
  const {
    register,
    handleSubmit,

    setValue,
    formState: { errors },
    reset,
  } = useForm<CommentFormInputs>();

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setValue("content", comment.content);
  };

  // ✅ NEW: Hàm xử lý form submission
  const onSubmitHandler = (data: CommentFormInputs) => {
    if (editingCommentId) {
      onEditComment(editingCommentId, data.content);
      setEditingCommentId(null);
      reset(); // Xóa nội dung form sau khi sửa
    } else {
      onSubmitComment(data);
      reset(); // Xóa nội dung form sau khi thêm mới
    }
  };

  // ✅ NEW: Logic để reset form khi hủy sửa
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    reset();
  };

  // 💡 Lấy username để hiển thị
  // ✅ FIX 1: Ưu tiên lấy username, nếu không có, lấy name, nếu không có, dùng 'Bạn'
  const currentUserName = currentUser?.username || currentUser?.name || 'Bạn';
  // ✅ FIX 2: Đảm bảo chuỗi tồn tại trước khi dùng charAt
  const displayUserName = currentUserName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Bình luận cho: {card.cardName}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {currentUser ? (
          <div className="mb-4">
            {/* ✅ FIX: Hiển thị tên người dùng đã đăng nhập ở khu vực soạn thảo */}
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                {displayUserName}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {editingCommentId ? `Đang sửa bình luận của ${currentUserName}` : `Đăng bình luận với tên: ${currentUserName}`}
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="space-y-2"
            >
              <textarea
                {...register("content", { required: "Nội dung bình luận là bắt buộc" })}
                placeholder="Viết bình luận..."
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
              {errors.content && (
                <p className="text-xs text-red-500 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {errors.content.message}
                </p>
              )}
              {commentError && (
                <p className="text-xs text-red-500 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {commentError}
                </p>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={commentLoading}
                  className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${commentLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {commentLoading ? "Đang xử lý..." : editingCommentId ? "Cập nhật bình luận" : "Gửi bình luận"}
                </button>
                {editingCommentId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                  >
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <p className="text-sm text-red-500 mb-4 text-center">Vui lòng đăng nhập để bình luận.</p>
        )}


        <div className="max-h-60 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
          {commentLoading ? (
            <p className="text-sm text-gray-500 text-center">Đang tải bình luận...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  {/* ✅ FIX: Hiển thị tên người bình luận và thẻ (username) nếu trùng ID */}
                  <p className="text-sm font-semibold text-gray-800">
                    {comment.userId.name}
                    {currentUser && comment.userId._id === currentUser._id && (
                      <span className="text-xs text-blue-500 ml-2 font-bold">({currentUserName})</span>
                    )}
                  </p>
                  {/* Kết thúc FIX */}
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                    {comment.updatedAt &&
                      new Date(comment.updatedAt) > new Date(comment.createdAt) &&
                      " (Đã chỉnh sửa)"}
                  </p>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
                {/* Kiểm tra quyền Sửa/Xóa */}
                {currentUser && comment.userId._id === currentUser._id && (
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => startEditing(comment)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">Chưa có bình luận nào</p>
          )}
        </div>
      </div>
    </div>
  );
};