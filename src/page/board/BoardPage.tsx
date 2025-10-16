import {  Grid, Plus, ArrowUpRight, Edit, Trash2 } from "lucide-react";
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
  const [ , setUsername] = useState<string>('');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
   

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Boards của bạn</h2>
            <p className="text-gray-600">Quản lý các dự án và công việc của bạn</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => handleBoardClick(board._id)}
                  className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditBoard(board._id, e)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteBoard(board._id, e)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Board Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">{board.broadName}</h3>
                    <p className="text-blue-100 text-sm line-clamp-3">{board.description}</p>
                  </div>

                  {/* Board Preview */}
                  <div className="mb-4">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-100">Lists</span>
                        <span className="text-xs text-blue-200">0</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-white/20 rounded-full"></div>
                        <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                        <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                  </div>

                  {/* Created Date */}
                  <div className="absolute bottom-4 left-6 text-xs text-blue-200">
                    Tạo: {new Date(board.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}

              {/* Add New Board Card */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="group border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="w-12 h-12 bg-gray-200 group-hover:bg-blue-500 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 group-hover:text-blue-600 mb-2">
                  Tạo Board mới
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-blue-500 text-center">
                  Bắt đầu quản lý dự án mới của bạn
                </p>
              </div>
            </div>
          )}

          {!isLoading && boards.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có board nào</h3>
              <p className="text-gray-500 mb-4">Tạo board đầu tiên để bắt đầu quản lý dự án</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
              >
                Tạo Board đầu tiên
              </button>
            </div>
          )}
        </div>

        {/* Modal for Creating Board */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm Board mới</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Board Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tên Board</label>
                  <input
                    type="text"
                    {...register("broadName", { required: "Tên board là bắt buộc" })}
                    placeholder="Nhập tên board..."
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.broadName && (
                    <p className="text-red-500 text-sm mt-1">{errors.broadName.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
                  <textarea
                    {...register("description", { required: "Mô tả là bắt buộc" })}
                    placeholder="Nhập mô tả..."
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Thêm Board
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