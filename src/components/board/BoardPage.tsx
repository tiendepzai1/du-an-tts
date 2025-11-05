import { Plus, ArrowUpRight, Edit, Trash2, Users } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
// ✅ IMPORT COMPONENT ĐÃ ĐƯỢC GIẢI QUYẾT LỖI
import InvitationsDropdown from "./InvitationsDropdown.tsx";
import InvitationsSection from "./InvitationsSection.tsx";


// Helper type cho Current User (Dựa trên dữ liệu lưu trong localStorage)
type CurrentUser = {
  _id: string;
  name: string;
  email: string;
};

type Board = {
  _id: string;
  broadName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: string; // ID của người sở hữu
  members: string[]; // Mảng ID của các thành viên
  ownerList?: any[];
  ownerUser?: any[];
};

type BoardFormInputs = {
  broadName: string;
  description: string;
};

// Helper function to get user data from localStorage
const getCurrentUser = (): CurrentUser | null => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    try {
      return JSON.parse(userJson) as CurrentUser;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export default function BoardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BoardFormInputs>();

  // ✅ HÀM TIỆN ÍCH: Kiểm tra xem người dùng hiện tại có phải là Owner không
  const isOwner = useCallback((board: Board) => {
    return currentUser && board.owner === currentUser._id;
  }, [currentUser]);

  const handleAuthError = (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      alert("Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return true;
    }
    return false;
  };

  // ✅ HÀM XỬ LÝ TOAST (thông báo toàn cục)
  // Hàm này cũng gọi fetchBoards() để tải lại danh sách board sau khi chấp nhận lời mời
  const handleGlobalSuccess = (message: string) => {
    alert(`SUCCESS: ${message}`);
    // Sau khi chấp nhận lời mời, cần refresh danh sách board
    fetchBoards();
  };

  // ✅ HÀM XỬ LÝ TOAST (lỗi toàn cục)
  const handleGlobalError = (message: string) => {
    alert(`ERROR: ${message}`);
  };

  const fetchBoards = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return navigate("/login");
    }

    try {
      setIsLoading(true);
      // API ListBroad đã được sửa để trả về cả board owner và member
      const response = await axios.get("http://localhost:3000/broad/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data) {
        // Board data giờ bao gồm owner và members
        setBoards(response.data.data);
      } else {
        setBoards([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách boards:", error);
      if (!handleAuthError(error)) {
        setBoards([]);
        alert("Lỗi khi tải danh sách board. Vui lòng kiểm tra console.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    fetchBoards();
  }, [fetchBoards]);

  const handleBoardClick = (boardId: string) => {
    navigate(`/detail/${boardId}`);
  };

  const handleEditBoard = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    // Chỉ cho phép Owner sửa
    if (!isOwner(board)) {
      alert("Bạn chỉ có thể sửa các board do bạn sở hữu.");
      return;
    }
    setSelectedBoard(board);
    setValue("broadName", board.broadName);
    setValue("description", board.description);
    setIsEditModalOpen(true);
  };

  const handleDeleteBoard = async (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    // Chỉ cho phép Owner xóa
    if (!isOwner(board)) {
      alert("Bạn chỉ có thể xóa các board do bạn sở hữu.");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa board này?")) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.delete(`http://localhost:3000/broad/delete/${board._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(boards.filter((b) => b._id !== board._id));
      handleGlobalSuccess("Xóa board thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa board:", error);
      if (!handleAuthError(error)) {
        handleGlobalError("Xóa board thất bại! Vui lòng kiểm tra console để biết chi tiết.");
      }
    }
  };

  // ... (Giữ nguyên onCreateSubmit và onEditSubmit)

  const onCreateSubmit = async (data: BoardFormInputs) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const apiData = {
        broadName: data.broadName,
        description: data.description,
      };

      const res = await axios.post("http://localhost:3000/broad/create", apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật state Boards với dữ liệu mới
      const newBoard = res.data.data;
      if (newBoard && newBoard._id) {
        // Thêm Owner ID và Members vào board mới tạo cho hiển thị local
        newBoard.owner = currentUser?._id;
        newBoard.members = [];
        setBoards(prevBoards => [newBoard as Board, ...prevBoards]);
      }

      console.log("Phản hồi từ API:", res.data);
      handleGlobalSuccess("Thêm board thành công!");
      setIsCreateModalOpen(false);
      reset();

    } catch (error) {
      if (handleAuthError(error)) return;

      if (axios.isAxiosError(error)) {
        console.error("Lỗi chi tiết:", error.response?.data);
        handleGlobalError(`Lỗi: ${error.response?.data?.message || error.message}`);
      } else {
        console.error("Lỗi không xác định:", error);
        handleGlobalError("Lỗi không xác định khi thêm board");
      }
    }
  };

  const onEditSubmit = async (data: BoardFormInputs) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedBoard) {
        navigate("/login");
        return;
      }

      const apiData = {
        broadName: data.broadName,
        description: data.description,
      };

      const res = await axios.put(`http://localhost:3000/broad/update/${selectedBoard._id}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật state Boards với dữ liệu mới
      setBoards(prevBoards => prevBoards.map(board =>
        board._id === selectedBoard._id ? {
          ...board,
          ...res.data.data,
          owner: board.owner,
          members: board.members,
        } : board
      ));

      console.log("Phản hồi từ API khi sửa:", res.data);
      handleGlobalSuccess("Cập nhật board thành công!");
      setIsEditModalOpen(false);
      reset();
      setSelectedBoard(null);
    } catch (error) {
      if (handleAuthError(error)) return;

      if (axios.isAxiosError(error)) {
        console.error("Lỗi chi tiết:", error.response?.data);
        handleGlobalError(`Lỗi: ${error.response?.data?.message || error.message}`);
      } else {
        console.error("Lỗi không xác định:", error);
        handleGlobalError("Lỗi không xác định khi sửa board");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Project Dashboard
              </h1>
              <p className="text-blue-200/80 text-sm">Quản lý dự án chuyên nghiệp</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* ✅ VỊ TRÍ MỚI: Thêm Dropdown Lời mời tại đây */}
            <InvitationsDropdown onSuccess={handleGlobalSuccess} onError={handleGlobalError} />

            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20">
              <span className="text-white/80 text-xs font-medium">{boards.length} Projects</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">
                {currentUser?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative p-4">
        <div className="w-full">
          {/* Invitations Section - Hiển thị trước danh sách dự án */}
          {!isLoading && (
            <InvitationsSection
              onSuccess={handleGlobalSuccess}
              onError={handleGlobalError}
              onInvitationHandled={fetchBoards} // Refresh danh sách board khi chấp nhận lời mời
            />
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-400/30 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                </div>
                <p className="text-white/80 font-medium">Đang tải dự án...</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Tiêu đề danh sách dự án */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Dự án của bạn ({boards.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {boards.map((board, index) => {
                  // Kiểm tra quyền hạn
                  const isCurrentUserOwner = isOwner(board);
                  const isCurrentUserMember = !isCurrentUserOwner && board.members.some(memberId => memberId === currentUser?._id);

                  return (
                    <div
                      key={board._id}
                      className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-white/20 hover:border-white/40 overflow-hidden hover:bg-white/15"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => handleBoardClick(board._id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-700/80 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-600 transition-all duration-300"></div>
                        <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                        <div className="absolute bottom-6 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                        <div className="relative z-10 space-y-3 p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                {/* HIỂN THỊ ICON DỰA TRÊN QUYỀN HẠN */}
                                {isCurrentUserOwner ? (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                ) : (
                                  <Users className="w-3 h-3 text-white" /> // Icon cho Member
                                )}
                              </div>
                              {/* Hiển thị số lượng thành viên (Owner + Members) */}
                              <span className="text-white/80 text-xs font-medium">
                                {1 + board.members.length} Users
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors mb-1">
                              {board.broadName}
                            </h3>
                            <p className="text-blue-100/80 text-xs leading-relaxed line-clamp-2">
                              {board.description}
                            </p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-white">Progress</span>
                              <span className="text-xs text-blue-200 bg-white/20 px-1 py-0.5 rounded-lg font-medium">0 Lists</span>
                            </div>
                            <div className="space-y-1">
                              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-0 group-hover:w-1/3 transition-all duration-700"></div>
                              </div>
                              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full w-0 group-hover:w-2/3 transition-all duration-700 delay-200"></div>
                              </div>
                              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-0 group-hover:w-1/4 transition-all duration-700 delay-400"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <div className="w-5 h-5 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-blue-200/80">
                                {new Date(board.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all duration-200 hover:scale-110">
                              <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Nút thao tác (Chỉ hiển thị cho Owner) */}
                      {isCurrentUserOwner && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <button
                            onClick={(e) => handleEditBoard(board, e)}
                            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteBoard(board, e)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add New Board Card */}
                <div
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group border-2 border-dashed border-white/30 rounded-2xl p-4 cursor-pointer hover:border-white/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] bg-white/5 backdrop-blur-xl hover:shadow-2xl hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Plus className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white/80 group-hover:text-white mb-2 transition-colors">
                    Tạo dự án mới
                  </h3>
                  <p className="text-white/60 group-hover:text-white/80 text-center leading-relaxed transition-colors max-w-xs text-sm">
                    Bắt đầu quản lý dự án chuyên nghiệp của bạn
                  </p>
                  <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/30">
                    <span className="text-white/80 text-xs font-medium">+ New Project</span>
                  </div>
                </div>
              </div>

              {!isLoading && boards.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-xl border border-white/20">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Chưa có dự án nào</h3>
                  <p className="text-white/70 mb-6 text-sm max-w-md mx-auto leading-relaxed">
                    Tạo dự án đầu tiên để bắt đầu quản lý công việc một cách chuyên nghiệp
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-xl border border-white/20"
                  >
                    <span className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Tạo dự án đầu tiên</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal for Creating Board */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Tạo dự án mới</h2>
                <p className="text-white/70 text-sm">Thiết lập dự án chuyên nghiệp của bạn</p>
              </div>
              <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">Tên dự án</label>
                  <input
                    type="text"
                    {...register("broadName", { required: "Tên dự án là bắt buộc" })}
                    placeholder="Nhập tên dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg text-white placeholder-white/50"
                  />
                  {errors.broadName && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.broadName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">Mô tả dự án</label>
                  <textarea
                    {...register("description", { required: "Mô tả là bắt buộc" })}
                    placeholder="Mô tả chi tiết về dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-lg text-white placeholder-white/50"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      reset();
                    }}
                    className="flex-1 px-4 py-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Tạo dự án
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Editing Board */}
        {isEditModalOpen && selectedBoard && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Sửa dự án</h2>
                <p className="text-white/70 text-sm">Cập nhật thông tin dự án của bạn</p>
              </div>
              <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">Tên dự án</label>
                  <input
                    type="text"
                    {...register("broadName", { required: "Tên dự án là bắt buộc" })}
                    placeholder="Nhập tên dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg text-white placeholder-white/50"
                  />
                  {errors.broadName && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.broadName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 text-lg">Mô tả dự án</label>
                  <textarea
                    {...register("description", { required: "Mô tả là bắt buộc" })}
                    placeholder="Mô tả chi tiết về dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-lg text-white placeholder-white/50"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      reset();
                      setSelectedBoard(null);
                    }}
                    className="flex-1 px-4 py-3 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Cập nhật dự án
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}