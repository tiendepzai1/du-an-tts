import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";

type Card = {
  _id: string;
  cardName: string;
  description: string;
  dueDate?: string;
  status?: boolean;
};

type List = {
  _id: string;
  listName: string;
  description: string;
  status: "việc cần làm" | "đang thực hiện" | "đã xong";
  ownerCard?: Card[];
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

type CardFormInputs = {
  cardName: string;
  description?: string;
  dueDate?: string;
  status?: boolean;
};

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [addingCardListsId, setAddingCardListId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null); // ✅ card đang sửa
  const [editingCardListId, setEditingCardListId] = useState<string | null>(null); // ✅ list chứa card đó



  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListFormInputs>();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    reset: resetCardForm,
    formState: { errors: cardErrors },
  } = useForm<CardFormInputs>();

  // 🔹 Lấy dữ liệu board
  const fetchBoard = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const boardRes = await axios.get(`http://localhost:3000/broad/detail/${id}`);
      const listRes = await axios.get(`http://localhost:3000/list/broad/${id}`);
      // console.log("Dữ liệu từ listRes:", listRes.data);
      // console.log("📦 List chi tiết:", JSON.stringify(listRes.data.data, null, 2));

      setBoard({
        _id: id,
        broadName: boardRes.data.data?.broadName || "Tên Board",
        description: boardRes.data.data?.description || "Chưa có mô tả",
        ownerList: listRes.data.data || [],
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

  // 🔹 Thêm/Sửa List
  const onSubmit = async (data: ListFormInputs) => {
    try {
      if (!id) return;

      if (editingList) {
        await axios.put(`http://localhost:3000/list/update/${editingList._id}`, {
          ...data,
          ownerBroad: id,
        });
      } else {
        await axios.post(`http://localhost:3000/list/create`, {
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
      await axios.delete(`http://localhost:3000/list/delete/${listId}`);
      fetchBoard();
    } catch (err) {
      console.error("Lỗi khi xóa list:", err);
      alert("Xóa list thất bại");
    }
  };

  // 🔹 Sửa List
  const handleEdit = (list: List) => {
    setEditingList(list);
    reset(list);
    setShowForm(true);
  };

  // ================= CARD FUNCTIONS =================

  const onSubmitCard = async (data: CardFormInputs) => {
    try {
      if (editingCard) {
        // ✅ Sửa card
        await axios.put(`http://localhost:3000/card/update/${editingCard._id}`, {
          ...data,
          ownerList: [editingCardListId],
        });

        setEditingCard(null);
        setEditingCardListId(null);
      } else {
        // ✅ Thêm mới
        if (!addingCardListsId) return;

        const payload = {
          ...data,
          ownerLists: [addingCardListsId],
        };

        await axios.post("http://localhost:3000/card/create", payload);
        setAddingCardListId(null);
      }

      resetCardForm();
      fetchBoard();
    } catch (err: any) {
      console.error("Lỗi khi xử lý card:", err);
      alert(err.response?.data?.message || "Lỗi khi xử lý card");
    }
  };


  const handleEditCard = (listId: string, card: Card) => {
    setEditingCard(card);
    setEditingCardListId(listId);
    setAddingCardListId(null); // ✅ Tắt form thêm nếu đang mở
    resetCardForm(card); // Đổ dữ liệu cũ vào form
  };


  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Bạn có chắc muốn xóa thẻ này?")) return;
    try {
      await axios.delete(`http://localhost:3000/card/delete/${cardId}`);
      fetchBoard();
    } catch (err) {
      console.error("Lỗi khi xóa card:", err);
      alert("Xóa card thất bại");
    }
  };

  // ================= RENDER =================

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (!board) return <p className="p-6 text-red-500">Không tìm thấy board!</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => nav("/Layout")}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl mb-4"
      >
        Trang Chủ
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black-700">{board.broadName}</h1>
        <p className="text-gray-600 mt-2">{board.description}</p>
      </div>

      {!showForm && !editingList && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl mb-4"
        >
          ➕ Thêm danh sách
        </button>
      )}

      {(showForm || editingList) && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 w-[320px]">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {editingList ? "✏️ Sửa danh sách" : "➕ Thêm danh sách"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("listName", { required: "Tên list là bắt buộc" })}
              placeholder="Tên danh sách..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            {errors.listName && <p className="text-red-500 text-xs">{errors.listName.message}</p>}

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

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-xl"
              >
                {editingList ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setEditingList(null);
                  setShowForm(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium py-2 rounded-xl"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hiển thị danh sách List và Card */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.ownerList.length > 0 ? (
          board.ownerList.map((list) => (
            <div
              key={list._id}
              className={`min-w-[260px] rounded-xl shadow p-4 border border-gray-200 ${list.status === "đã xong"
                ? "bg-green-100"
                : list.status === "đang thực hiện"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
                }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-800">{list.listName}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(list)} className="text-blue-500 hover:text-blue-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(list._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-2">{list.description}</p>
              <span className="inline-block px-2 py-1 text-xs rounded-lg bg-white/60 font-medium text-gray-700">
                {list.status}
              </span>

              {/* Danh sách Card */}
              <div className="bg-white/60 p-2 rounded-lg mt-2">
                <h4 className="text-sm font-semibold mb-2"> Thẻ công việc</h4>

                {list.ownerCard && list.ownerCard.length > 0 ? (
                  list.ownerCard.map((card) => (
                    <div key={card._id} className="bg-white border border-gray-300 rounded-lg p-2 mb-2 shadow-sm">
                      {/* Dòng trên: cardName bên trái, nút chỉnh sửa xóa bên phải */}
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{card.cardName}</span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCard(list._id, card)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Dòng dưới: description */}
                      <p className="text-gray-600 text-sm mt-1">{card.description || "Không có mô tả"}</p>

                      {/* Hiển thị hạn nộp nếu có */}
                      {card.dueDate && (
                        <p className="text-xs text-red-500 mt-1">
                          Hạn nộp: {new Date(card.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Chưa có thẻ nào.</p>
                )}



                {/* Form thêm card */}
                {/* Form thêm/sửa card */}
                {/* FORM SỬA THẺ */}
                {editingCard && editingCardListId === list._id && (
                  <form onSubmit={handleSubmitCard(onSubmitCard)} className="bg-white p-2 rounded-lg mt-2 border">
                    <h4 className="text-sm font-semibold mb-2">✏️ Sửa thẻ</h4>

                    {/* Các input giữ nguyên */}
                    <input
                      {...registerCard("cardName", { required: "Tên thẻ là bắt buộc" })}
                      placeholder="Tên thẻ..."
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2 focus:ring-2 focus:ring-blue-400"
                    />
                    {cardErrors.cardName && (
                      <p className="text-xs text-red-500">{cardErrors.cardName.message}</p>
                    )}

                    <textarea
                      {...registerCard("description")}
                      placeholder="Mô tả..."
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <label className="text-xs text-gray-600">Hạn nộp:</label>
                    <input
                      type="date"
                      {...registerCard("dueDate")}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2"
                    />

                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        {...registerCard("status")}
                        id={`status-${list._id}`}
                      />
                      <label htmlFor={`status-${list._id}`} className="text-xs text-gray-600">Hoàn thành</label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 rounded-lg"
                      >
                        Cập nhật
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetCardForm();
                          setEditingCard(null);
                          setEditingCardListId(null);
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-1 rounded-lg"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}

                {/* FORM THÊM THẺ */}
                {!editingCard && addingCardListsId === list._id && (
                  <form onSubmit={handleSubmitCard(onSubmitCard)} className="bg-white p-2 rounded-lg mt-2 border">
                    <h4 className="text-sm font-semibold mb-2">➕ Thêm thẻ</h4>

                    {/* Các input giống nhau nên có thể extract ra component sau */}
                    <input
                      {...registerCard("cardName", { required: "Tên thẻ là bắt buộc" })}
                      placeholder="Tên thẻ..."
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2 focus:ring-2 focus:ring-blue-400"
                    />
                    {cardErrors.cardName && (
                      <p className="text-xs text-red-500">{cardErrors.cardName.message}</p>
                    )}

                    <textarea
                      {...registerCard("description")}
                      placeholder="Mô tả..."
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2 focus:ring-2 focus:ring-blue-400"
                    />

                    <label className="text-xs text-gray-600">Hạn nộp:</label>
                    <input
                      type="date"
                      {...registerCard("dueDate")}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm mb-2"
                    />

                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        {...registerCard("status")}
                        id={`status-${list._id}`}
                      />
                      <label htmlFor={`status-${list._id}`} className="text-xs text-gray-600">Hoàn thành</label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 rounded-lg"
                      >
                        Thêm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetCardForm();
                          setAddingCardListId(null);
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-1 rounded-lg"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}



                {/* Nếu không đang sửa và list này chưa mở form thêm card thì hiện nút Thêm thẻ */}
                {!editingCard && addingCardListsId !== list._id && editingCardListId !== list._id && (
                  <button
                    onClick={() => {
                      setAddingCardListId(list._id);
                      setEditingCard(null);
                      setEditingCardListId(null);
                      resetCardForm({
                        cardName: "",
                        description: "",
                        dueDate: "",
                        status: false,
                      }); // ✅ Reset rõ ràng
                    }}
                    className="w-full text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1 mt-2"
                  >
                    ➕ Thêm thẻ
                  </button>

                )}





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
