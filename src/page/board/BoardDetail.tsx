import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [addingCardListId, setAddingCardListId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingCardListId, setEditingCardListId] = useState<string | null>(null);

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

  // Lấy dữ liệu board
  const fetchBoard = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const boardRes = await axios.get(`http://localhost:3000/broad/detail/${id}`);
      const listRes = await axios.get(`http://localhost:3000/list/broad/${id}`);
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

  // Xử lý kéo thả
const handleDragEnd = async (result: any) => {
  const { destination, source, draggableId } = result;

  if (!destination || !board) {
    console.warn("Không có đích hoặc board không tồn tại");
    return;
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const sourceList = board.ownerList.find((list) => list._id === source.droppableId);
  const destinationList = board.ownerList.find(
    (list) => list._id === destination.droppableId
  );

  if (!sourceList || !destinationList) {
    console.error("Không tìm thấy danh sách nguồn hoặc đích");
    return;
  }

  const sourceCards = [...(sourceList.ownerCard || [])];
  const destinationCards =
    source.droppableId === destination.droppableId
      ? sourceCards
      : [...(destinationList.ownerCard || [])];

  const [movedCard] = sourceCards.splice(source.index, 1);
  destinationCards.splice(destination.index, 0, movedCard);

  // Kiểm tra ID thẻ
  const destinationCardIds = destinationCards.map((card) => card._id).filter((id) => id);
  const sourceCardIds = sourceCards.map((card) => card._id).filter((id) => id);

  if (destinationCardIds.length !== destinationCards.length || sourceCardIds.length !== sourceCards.length) {
    console.error("Phát hiện ID thẻ không hợp lệ");
    fetchBoard();
    return;
  }

  const updatedLists = board.ownerList.map((list) => {
    if (list._id === source.droppableId) {
      return { ...list, ownerCard: sourceCards };
    }
    if (list._id === destination.droppableId) {
      return { ...list, ownerCard: destinationCards };
    }
    return list;
  });

  setBoard({ ...board, ownerList: updatedLists });

  // Cập nhật backend
  try {
    console.log("Cập nhật danh sách đích:", {
      listId: destinationList._id,
      ownerCard: destinationCardIds,
      listName: destinationList.listName,
      ownerBroad: board._id,
    });
    await axios.put(`http://localhost:3000/list/update/${destinationList._id}`, {
      ownerCard: destinationCardIds,
      listName: destinationList.listName, // Thêm listName
      ownerBroad: board._id, // Thêm ownerBroad
    });

    if (source.droppableId !== destination.droppableId) {
      console.log("Cập nhật danh sách nguồn:", {
        listId: sourceList._id,
        ownerCard: sourceCardIds,
        listName: sourceList.listName,
        ownerBroad: board._id,
      });
      await axios.put(`http://localhost:3000/list/update/${sourceList._id}`, {
        ownerCard: sourceCardIds,
        listName: sourceList.listName, // Thêm listName
        ownerBroad: board._id, // Thêm ownerBroad
      });
    }
  } catch (err: any) {
    console.error("Lỗi khi cập nhật backend:", err);
    console.log("Phản hồi lỗi:", err.response?.data);
    fetchBoard(); // Khôi phục nếu lỗi
  }
};

  // Thêm/Sửa List
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

  // Xóa List
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

  // Sửa List
  const handleEdit = (list: List) => {
    setEditingList(list);
    reset(list);
    setShowForm(true);
  };

  // Thêm Card
  const handleAddCard = (listId: string) => {
    setAddingCardListId(listId);
    setEditingCard(null);
    setEditingCardListId(null);
    resetCardForm({
      cardName: "",
      description: "",
      dueDate: "",
      status: false,
    });
  };

  // Thêm/Sửa Card
  const onSubmitCard = async (data: CardFormInputs) => {
    try {
      if (editingCard && editingCardListId) {
        await axios.put(`http://localhost:3000/card/update/${editingCard._id}`, {
          ...data,
          ownerLists: [editingCardListId],
        });
        setEditingCard(null);
        setEditingCardListId(null);
      } else if (addingCardListId) {
        await axios.post("http://localhost:3000/card/create", {
          ...data,
          ownerLists: [addingCardListId],
        });
        setAddingCardListId(null);
      }

      resetCardForm();
      fetchBoard();
    } catch (err: any) {
      console.error("Lỗi khi xử lý card:", err);
      alert(err.response?.data?.message || "Lỗi khi xử lý card");
    }
  };

  // Sửa Card
  const handleEditCard = (listId: string, card: Card) => {
    setEditingCard(card);
    setEditingCardListId(listId);
    setAddingCardListId(null);
    resetCardForm(card);
  };

  // Xóa Card
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

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (!board) return <p className="p-6 text-red-500">Không tìm thấy board!</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => nav("/Layout")}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-white/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                    {board.broadName}
                  </h1>
                  <p className="text-blue-200/80 text-xs">Project Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20">
                <span className="text-white/80 text-xs font-medium">{board.ownerList.length} Lists</span>
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
          {/* Project Description */}
          <div className="mb-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-white mb-1">Mô tả dự án</h2>
                  <p className="text-white/80 text-xs leading-relaxed">{board.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add List Button */}
          {!showForm && !editingList && (
            <div className="mb-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 backdrop-blur-xl border border-white/20 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Thêm danh sách mới</span>
              </button>
            </div>
          )}

          {/* Add/Edit List Form */}
          {(showForm || editingList) && (
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {editingList ? "Chỉnh sửa danh sách" : "Tạo danh sách mới"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Tên danh sách</label>
                      <input
                        {...register("listName", { required: "Tên list là bắt buộc" })}
                        placeholder="Nhập tên danh sách..."
                        className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
                      />
                      {errors.listName && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.listName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm">Trạng thái</label>
                      <select
                        {...register("status")}
                        className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
                      >
                        <option value="việc cần làm" className="bg-gray-800">Việc cần làm</option>
                        <option value="đang thực hiện" className="bg-gray-800">Đang thực hiện</option>
                        <option value="đã xong" className="bg-gray-800">Đã xong</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2 text-sm">Mô tả</label>
                    <textarea
                      {...register("description")}
                      placeholder="Mô tả chi tiết về danh sách..."
                      className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                    >
                      {editingList ? "Cập nhật danh sách" : "Tạo danh sách"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setEditingList(null);
                        setShowForm(false);
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 text-sm"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {board.ownerList.length > 0 ? (
                board.ownerList.map((list, index) => (
                  <Droppable droppableId={list._id} key={list._id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-w-[300px] rounded-2xl shadow-lg p-4 border-2 transition-all duration-500 hover:shadow-xl hover:scale-105 backdrop-blur-xl ${
                          list.status === "đã xong"
                            ? "bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30"
                            : list.status === "đang thực hiện"
                            ? "bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-400/30"
                            : "bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-400/30"
                        }`}
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* List Header */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                                list.status === "đã xong"
                                  ? "bg-green-500/30"
                                  : list.status === "đang thực hiện"
                                  ? "bg-yellow-500/30"
                                  : "bg-blue-500/30"
                              }`}
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{list.listName}</h3>
                              <p className="text-white/70 text-xs">{list.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(list)}
                              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                            >
                              <Pencil size={14} className="text-white" />
                            </button>
                            <button
                              onClick={() => handleDelete(list._id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                            >
                              <Trash2 size={14} className="text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded-lg font-semibold ${
                              list.status === "đã xong"
                                ? "bg-green-500/30 text-green-200 border border-green-400/30"
                                : list.status === "đang thực hiện"
                                ? "bg-yellow-500/30 text-yellow-200 border border-yellow-400/30"
                                : "bg-blue-500/30 text-blue-200 border border-blue-400/30"
                            }`}
                          >
                            {list.status}
                          </span>
                        </div>

                        {/* Cards Section */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white flex items-center">
                              <svg className="w-4 h-4 mr-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              Tasks ({list.ownerCard?.length || 0})
                            </h4>
                            <button
                              onClick={() => handleAddCard(list._id)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-1 px-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-xs"
                            >
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Thêm task</span>
                              </span>
                            </button>
                          </div>

                          {list.ownerCard && list.ownerCard.length > 0 ? (
                            <div className="space-y-4">
                              {list.ownerCard.map((card, cardIndex) => (
                                <Draggable key={card._id} draggableId={card._id} index={cardIndex}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                      className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 ${
                                        snapshot.isDragging ? "opacity-80" : ""
                                      }`}
                                    >
                                      {/* Card Header */}
                                      <div className="flex justify-between items-start mb-4">
                                        <h5 className="font-bold text-white text-lg leading-tight">{card.cardName}</h5>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleEditCard(list._id, card)}
                                            className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl transition-all duration-200 hover:scale-110"
                                          >
                                            <Pencil size={14} className="text-white" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteCard(card._id)}
                                            className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-xl transition-all duration-200 hover:scale-110"
                                          >
                                            <Trash2 size={14} className="text-white" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Card Description */}
                                      <p className="text-white/80 text-sm mb-4 leading-relaxed">
                                        {card.description || "Không có mô tả"}
                                      </p>

                                      {/* Due Date */}
                                      {card.dueDate && (
                                        <div className="flex items-center space-x-2 bg-red-500/20 rounded-xl px-3 py-2">
                                          <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                          </svg>
                                          <p className="text-red-200 text-sm font-medium">
                                            Due: {new Date(card.dueDate).toLocaleDateString("vi-VN")}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
                              </div>
                              <p className="text-white/60 text-sm">Chưa có task nào</p>
                            </div>
                          )}

                          {/* FORM SỬA THẺ */}
                          {editingCard && editingCardListId === list._id && (
                            <form
                              onSubmit={handleSubmitCard(onSubmitCard)}
                              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl mt-4 border-2 border-blue-200 shadow-lg"
                            >
                              <div className="flex items-center space-x-2 mb-4">
                                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-800">Sửa thẻ</h4>
                              </div>

                              <div className="space-y-3">
                                <input
                                  {...registerCard("cardName", { required: "Tên thẻ là bắt buộc" })}
                                  placeholder="Tên thẻ..."
                                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                />
                                {cardErrors.cardName && (
                                  <p className="text-xs text-red-500 flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    {cardErrors.cardName.message}
                                  </p>
                                )}

                                <textarea
                                  {...registerCard("description")}
                                  placeholder="Mô tả..."
                                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                                  rows={2}
                                />

                                <div>
                                  <label className="text-xs text-gray-600 font-medium mb-1 block">Hạn nộp:</label>
                                  <input
                                    type="date"
                                    {...registerCard("dueDate")}
                                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    {...registerCard("status")}
                                    id={`status-edit-${list._id}`}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <label htmlFor={`status-edit-${list._id}`} className="text-xs text-gray-600 font-medium">
                                    Hoàn thành
                                  </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:scale-105"
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
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:scale-105"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* FORM THÊM THẺ */}
                          {!editingCard && addingCardListId === list._id && (
                            <form
                              onSubmit={handleSubmitCard(onSubmitCard)}
                              className="bg-white/90 backdrop-blur-sm p-4 rounded-xl mt-4 border-2 border-green-200 shadow-lg"
                            >
                              <div className="flex items-center space-x-2 mb-4">
                                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-800">Thêm thẻ</h4>
                              </div>

                              <div className="space-y-3">
                                <input
                                  {...registerCard("cardName", { required: "Tên thẻ là bắt buộc" })}
                                  placeholder="Tên thẻ..."
                                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                />
                                {cardErrors.cardName && (
                                  <p className="text-xs text-red-500 flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    {cardErrors.cardName.message}
                                  </p>
                                )}

                                <textarea
                                  {...registerCard("description")}
                                  placeholder="Mô tả..."
                                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                                  rows={2}
                                />

                                <div>
                                  <label className="text-xs text-gray-600 font-medium mb-1 block">Hạn nộp:</label>
                                  <input
                                    type="date"
                                    {...registerCard("dueDate")}
                                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    {...registerCard("status")}
                                    id={`status-add-${list._id}`}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <label htmlFor={`status-add-${list._id}`} className="text-xs text-gray-600 font-medium">
                                    Hoàn thành
                                  </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:scale-105"
                                  >
                                    Thêm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      resetCardForm();
                                      setAddingCardListId(null);
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:scale-105"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* Add Card Button */}
                          {!editingCard && addingCardListId !== list._id && editingCardListId !== list._id && (
                            <button
                              onClick={() => handleAddCard(list._id)}
                              className="w-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 hover:from-blue-500/50 hover:to-indigo-500/50 text-white font-semibold py-4 rounded-2xl mt-6 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Thêm task mới</span>
                            </button>
                          )}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))
              ) : (
                <div className="text-center py-32">
                  <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-4xl flex items-center justify-center mx-auto mb-12 shadow-2xl backdrop-blur-xl border border-white/20">
                    <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-6">Chưa có danh sách nào</h3>
                  <p className="text-white/70 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
                    Tạo danh sách đầu tiên để bắt đầu quản lý công việc một cách chuyên nghiệp
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 px-12 py-6 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 backdrop-blur-xl border border-white/20"
                  >
                    <span className="flex items-center space-x-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Tạo danh sách đầu tiên</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
}