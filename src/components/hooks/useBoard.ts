import { useEffect, useState } from "react";
import axios from "axios";
import type { Board, ListType, Card } from "../board/types.ts";

export const useBoard = (id: string | undefined) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load board lần đầu
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
      console.error("❌ Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Drag & Drop
  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;
    if (!destination || !board) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceList = board.ownerList.find((l) => l._id === source.droppableId);
    const destList = board.ownerList.find((l) => l._id === destination.droppableId);
    if (!sourceList || !destList) return;

    const sourceCards = [...(sourceList.ownerCard || [])];
    const destCards = source.droppableId === destination.droppableId ? sourceCards : [...(destList.ownerCard || [])];

    const [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    // Cập nhật state trực tiếp
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ownerList: prev.ownerList.map((l) => {
          if (l._id === sourceList._id) return { ...l, ownerCard: sourceCards };
          if (l._id === destList._id) return { ...l, ownerCard: destCards };
          return l;
        }),
      };
    });

    // Gọi backend
    try {
      await axios.put(`http://localhost:3000/list/update/${destList._id}`, {
        ownerCard: destCards.map((c) => c._id),
        listName: destList.listName,
        ownerBroad: board._id,
      });
      if (source.droppableId !== destination.droppableId) {
        await axios.put(`http://localhost:3000/list/update/${sourceList._id}`, {
          ownerCard: sourceCards.map((c) => c._id),
          listName: sourceList.listName,
          ownerBroad: board._id,
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật backend:", err);
    }
  };

  // 🔹 Thêm hoặc sửa list
  const handleAddList = async (data: { listName: string; description: string; status: string }, editingList: ListType | null) => {
    if (!id) return;

    try {
      if (editingList) {
        await axios.put(`http://localhost:3000/list/update/${editingList._id}`, { ...data, ownerBroad: id });
        setBoard((prev) => prev ? { ...prev, ownerList: prev.ownerList.map(l => l._id === editingList._id ? { ...l, ...data } : l) } : prev);
      } else {
        const res = await axios.post(`http://localhost:3000/list/create`, { ...data, ownerBroad: id });
        setBoard((prev) => prev ? { ...prev, ownerList: [...prev.ownerList, res.data.data] } : prev);
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi thêm/sửa list:", err);
      alert(err.response?.data?.message || "Lỗi khi thêm/sửa list");
    }
  };

  // 🔹 Xóa list
  const handleDeleteList = async (listId: string) => {
    if (!confirm("Bạn có chắc muốn xóa list này?")) return;
    try {
      await axios.delete(`http://localhost:3000/list/delete/${listId}`);
      setBoard((prev) => prev ? { ...prev, ownerList: prev.ownerList.filter(l => l._id !== listId) } : prev);
    } catch (err) {
      console.error("❌ Lỗi khi xóa list:", err);
      alert("Xóa list thất bại");
    }
  };

  // 🔹 Thêm hoặc sửa card
  const handleEditCard = async (
    listId: string,
    card: Card | null,
    editingCard: Card | null,
    editingCardListId: string | null,
    addingCardListId: string | null
  ) => {
    if (!card) return;

    try {
      // Edit card
      if (editingCard && editingCard._id && editingCardListId) {
        await axios.put(`http://localhost:3000/card/update/${editingCard._id}`, {
          cardName: card.cardName,
          description: card.description || "",
          ownerLists: [editingCardListId],
        });

        setBoard((prev) => prev ? {
          ...prev,
          ownerList: prev.ownerList.map(l => l._id === editingCardListId ? {
            ...l,
            ownerCard: l.ownerCard?.map(c => c._id === editingCard._id ? { ...c, ...card } : c)
          } : l)
        } : prev);
      } 
      // Create card
      else {
        const targetListId = addingCardListId || listId;
        if (!targetListId) return;
        const res = await axios.post("http://localhost:3000/card/create", {
          cardName: card.cardName,
          description: card.description || "",
          ownerLists: [targetListId],
        });

        setBoard((prev) => prev ? {
          ...prev,
          ownerList: prev.ownerList.map(l => l._id === targetListId ? {
            ...l,
            ownerCard: [...(l.ownerCard || []), res.data.data]
          } : l)
        } : prev);
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi xử lý card:", err.response?.data || err.message || err);
      alert(err.response?.data?.error || "Lỗi khi xử lý card");
    }
  };

  // 🔹 Xóa card
  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Bạn có chắc muốn xóa thẻ này?")) return;
    try {
      await axios.delete(`http://localhost:3000/card/delete/${cardId}`);
      setBoard((prev) => prev ? {
        ...prev,
        ownerList: prev.ownerList.map(l => ({
          ...l,
          ownerCard: l.ownerCard?.filter(c => c._id !== cardId)
        }))
      } : prev);
    } catch (err) {
      console.error("❌ Lỗi khi xóa card:", err);
      alert("Xóa card thất bại");
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  return {
    board,
    loading,
    handleDragEnd,
    handleAddList,
    handleDeleteList,
    handleEditCard,
    handleDeleteCard
  };
};
