import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";

type List = {
  _id: string;
  listName: string;
  description: string;
  status: "việc cần làm" | "đang thực hiện" | "đã xong";
};

type Board = {
  _id: string;
  broadName: string;
  description: string;
  ownerList: List[];
};

type ListFormInputs = {
  listName: string;
  description: string;
  status: "việc cần làm" | "đang thực hiện" | "đã xong";
};

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [showForm, setShowForm] = useState(false); // 🔹 điều khiển hiển thị form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListFormInputs>();

  const nav =useNavigate()

  // 🔹 Lấy chi tiết Board và list
  const fetchBoard = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const boardRes = await axios.get(`http://localhost:3000/broad/detail/${id}`);
      const res = await axios.get(`http://localhost:3000/list/broad/${id}`);
      setBoard({
        _id: id,
        broadName: boardRes.data.data?.broadName || "Tên Board",
        description: boardRes.data.data?.description || "Chưa có mô tả",
        ownerList: res.data.data || [],
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  // 🔹 Thêm hoặc sửa List
  const onSubmit = async (data: ListFormInputs) => {
    try {
      if (!id) return;

      // Kiểm tra trùng lặp trong ownerList của board hiện tại
      const isDuplicate = board?.ownerList.some(
        (list) => list.listName === data.listName && list._id !== (editingList?._id || "")
      );
      if (isDuplicate) {
        alert("Tên danh sách đã tồn tại trong board này!");
        return;
      }

      if (editingList) {
        // Cập nhật list
        await axios.put(`http://localhost:3000/list/${editingList._id}`, {
          ...data,
          ownerBroad: id,
        });
      } else {
        // Thêm list mới
        await axios.post(`http://localhost:3000/list`, {
          ...data,
          ownerBroad: id,
        });
      }

      reset();
      setEditingList(null);
      setShowForm(false);
      fetchBoard();
    } catch (err: any) {
      console.error("Lỗi khi thêm/sửa list:", err);
      alert(err.response?.data?.message || "Lỗi khi thêm/sửa list");
    }
  };

  // 🔹 Xóa List
  const handleDelete = async (listId: string) => {
    if (!confirm("Bạn có chắc muốn xóa list này?")) return;
    try {
      await axios.delete(`http://localhost:3000/list/${listId}`);
      fetchBoard();
    } catch (err) {
      console.error("Lỗi khi xóa list:", err);
      alert("Xóa list thất bại");
    }
  };

  // 🔹 Bắt đầu sửa List
  const handleEdit = (list: List) => {
    setEditingList(list);
    reset(list);
    setShowForm(true); // 🔹 hiển thị form khi sửa
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (!board) return <p className="p-6 text-red-500">Không tìm thấy board!</p>;
  const SubmitEvent = ()=>{
    nav("/Layout")
  }

  return (


    <div className="p-6">
      <button
          onClick={() => SubmitEvent()}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl mb-4"
        >
          Trang Chủ
        </button>
      {/* Board Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black-700">{board.broadName}</h1>
        <p className="text-gray-600 mt-2">{board.description}</p>
      </div>

      {/* Nút thêm danh sách */}
      {!showForm && !editingList && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl mb-4"
        >
          ➕ Thêm danh sách
        </button>
      )}

      {/* Form thêm/sửa List */}
      {(showForm || editingList) && (
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 w-[320px]">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            {editingList ? "✏️ Sửa danh sách" : "➕ Thêm danh sách"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("listName", { required: "Tên list là bắt buộc" })}
              placeholder="Tên danh sách..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.listName && (
              <p className="text-red-500 text-xs">{errors.listName.message}</p>
            )}

            <textarea
              {...register("description")}
              placeholder="Mô tả..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />

            <select
              {...register("status")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="việc cần làm">Việc cần làm</option>
              <option value="đang thực hiện">Đang thực hiện</option>
              <option value="đã xong">Đã xong</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-xl transition-all duration-150 active:scale-95"
            >
              {editingList ? "Cập nhật" : "Thêm mới"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setEditingList(null);
                setShowForm(false); // ẩn form khi hủy
              }}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium py-2 rounded-xl"
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      {/* List Section */}
      <h2 className="text-2xl font-semibold mb-4">Danh sách công việc:</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.ownerList && board.ownerList.length > 0 ? (
          board.ownerList.map((list) => (
            <div
              key={list._id}
              className={`min-w-[260px] rounded-xl shadow p-4 border border-gray-200 ${
                list.status === "đã xong"
                  ? "bg-green-100"
                  : list.status === "đang thực hiện"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-800">{list.listName}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(list)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(list._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
          
                </div>
               
              </div>
              <p className="text-sm text-gray-700 mb-2">{list.description}</p>
              <span className="inline-block px-2 py-1 text-xs rounded-lg bg-white/60 font-medium text-gray-700">
                {list.status}
              </span>

               <div>
                  <div>
                    
                    <h1>tôi muốn hiển thị card ở đây</h1>
                  </div>
                </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Chưa có danh sách nào.</p>
        )}
      </div>
    </div>
  );
}