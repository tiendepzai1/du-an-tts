import { Grid, Plus, ArrowUpRight, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

type Board = {
  _id: string;
  broadName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type BoardFormInputs = {
  broadName: string;
  description: string;
};

export default function BoardPage() {
  const [, setUsername] = useState<string>('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardFormInputs>();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(JSON.parse(storedUsername).username || 'Khách');
    } else {
      setUsername('Khách');
    }

    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("http://localhost:3000/broad/list");
      if (response.data.data) {
        setBoards(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách boards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/detail/${boardId}`);
  };

  const handleEditBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/boardUpdate/${boardId}`);
  };

  const handleDeleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa board này?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/broad/delete/${boardId}`);
      setBoards(boards.filter(board => board._id !== boardId));
      alert("Xóa board thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa board:", error);
      alert("Xóa board thất bại!");
    }
  };

  const onSubmit = async (data: BoardFormInputs) => {
    try {
      const token = localStorage.getItem("token");
      const apiData = {
        broadName: data.broadName,
        description: data.description,
      };
      const res = await axios.post("http://localhost:3000/broad/create", apiData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log("Phản hồi từ API:", res.data);
      alert("Thêm board thành công!");
      setIsModalOpen(false);
      reset();
      fetchBoards(); // Cập nhật danh sách boards
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Lỗi chi tiết:", error.response?.data);
        console.log("Trạng thái:", error.response?.status);
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
      } else {
        console.log("Lỗi không xác định:", error);
        alert("Lỗi không xác định khi thêm board");
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
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="w-full px-4 py-4">
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
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20">
                <span className="text-white/80 text-xs font-medium">{boards.length} Projects</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative p-2">
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-400/30 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <div className="text-center">
                  <p className="text-white/80 font-medium">Đang tải dự án...</p>
                  <p className="text-blue-200/60 text-sm mt-1">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {boards.map((board, index) => (
                <div
                  key={board._id}
                  onClick={() => handleBoardClick(board._id)}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border border-white/20 hover:border-white/40 overflow-hidden hover:bg-white/15"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-600/80 to-purple-700/80 group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-600 transition-all duration-500"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                  <div className="absolute bottom-6 right-6 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                      onClick={(e) => handleEditBoard(board._id, e)}
                      className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBoard(board._id, e)}
                      className="p-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Board Content */}
                  <div className="relative z-10 mb-4 space-y-3">
                    {/* Project Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-white/80 text-xs font-medium">ACTIVE</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors mb-1">
                          {board.broadName}
                        </h3>
                        <p className="text-blue-100/80 text-xs leading-relaxed line-clamp-2">
                          {board.description}
                        </p>
                      </div>
                    </div>


                    {/* Project Stats */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">Progress</span>
                        <span className="text-xs text-blue-200 bg-white/20 px-2 py-1 rounded-lg font-medium">0 Lists</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full w-0 group-hover:w-2/3 transition-all duration-1000 delay-200"></div>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-0 group-hover:w-1/4 transition-all duration-1000 delay-400"></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs text-blue-200/80">
                          {new Date(board.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all duration-200 hover:scale-110">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Board Card */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="group border-2 border-dashed border-white/30 rounded-2xl p-4 cursor-pointer hover:border-white/50 hover:bg-white/10 transition-all duration-500 flex flex-col items-center justify-center min-h-[200px] bg-white/5 backdrop-blur-xl hover:shadow-2xl hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 group-hover:from-blue-500/30 group-hover:to-indigo-500/30 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 shadow-lg">
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
          )}

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
                onClick={() => setIsModalOpen(true)}
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

        {/* Modal for Creating Board */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2">
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-500">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Tạo dự án mới</h2>
                <p className="text-white/70 text-sm">Thiết lập dự án chuyên nghiệp của bạn</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Board Name */}
                <div>
                  <label className="block text-white font-semibold mb-4 text-lg">Tên dự án</label>
                  <input
                    type="text"
                    {...register("broadName", { required: "Tên dự án là bắt buộc" })}
                    placeholder="Nhập tên dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-lg text-white placeholder-white/50"
                  />
                  {errors.broadName && (
                    <p className="text-red-400 text-sm mt-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.broadName.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-4 text-lg">Mô tả dự án</label>
                  <textarea
                    {...register("description", { required: "Mô tả là bắt buộc" })}
                    placeholder="Mô tả chi tiết về dự án..."
                    className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-lg text-white placeholder-white/50"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl"
                  >
                    Tạo dự án
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