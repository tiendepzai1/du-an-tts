import React, { useState, useEffect } from "react";
import axios from "axios";
import CardItem from "./CardItem";

interface Card {
  _id?: string;
  cardName: string;
  description?: string;
  dueDate?: string | null;
  columnTitle: string;
}

interface ColumnProps {
  title: string;
}

const Column: React.FC<ColumnProps> = ({ title }) => {
  const [cardList, setCardList] = useState<Card[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/card/list");
      if (res.data?.data) {
        const cardsForColumn = res.data.data
          .filter((c: Card) => c.columnTitle === title)
          .map((c: Card) => ({
            ...c,
            dueDate: c.dueDate ? c.dueDate.slice(0, 10) : null,
          }));
        setCardList(cardsForColumn);
      }
    } catch (err) {
      console.error("Lỗi load card:", err);
      alert("Lỗi load card từ server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [title]);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return alert("Nhập tiêu đề card!");
    try {
      const res = await axios.post("http://localhost:3000/card/create", {
        cardName: newCardTitle.trim(),
        description: newDescription.trim(),
        dueDate: newDueDate || null,
        columnTitle: title,
      });

      if (res.data?.data) {
        const addedCard: Card = {
          ...res.data.data,
          dueDate: res.data.data.dueDate ? res.data.data.dueDate.slice(0, 10) : null,
        };
        setCardList((prev) => [...prev, addedCard]);
        setNewCardTitle("");
        setNewDescription("");
        setNewDueDate("");
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Lỗi server khi thêm card:", err);
      alert("Lỗi server khi thêm card");
    }
  };

  const handleEditCard = async (id: string, updatedData: Partial<Card>) => {
    try {
      const res = await axios.put(`http://localhost:3000/card/update/${id}`, updatedData);
      if (res.data?.data) {
        const updatedCard: Card = {
          ...res.data.data,
          dueDate: res.data.data.dueDate ? res.data.data.dueDate.slice(0, 10) : null,
        };
        setCardList((prev) =>
          prev.map((c) => (c._id === id ? updatedCard : c))
        );
      }
    } catch (err) {
      console.error("Lỗi server khi cập nhật card:", err);
      alert("Lỗi server khi cập nhật card");
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa card này không?")) return;
    try {
await axios.delete(`http://localhost:3000/card/delete/${id}`);
      setCardList((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Lỗi server khi xóa card:", err);
      alert("Lỗi server khi xóa card");
    }
  };

  return (
    <div className="bg-[#2c2f48] w-72 rounded-xl p-3 flex-shrink-0">
      <h2 className="text-white text-lg font-semibold mb-3">{title}</h2>

      <div className="space-y-3 min-h-[50px]">
        {loading ? (
          <p className="text-gray-400 text-sm italic">Đang tải...</p>
        ) : cardList.length > 0 ? (
          cardList.map((card) => (
            <CardItem
              key={card._id}
              id={card._id || ""}
              title={card.cardName}
              description={card.description}
              dueDate={card.dueDate}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">Chưa có card nào</p>
        )}
      </div>

      {isAdding ? (
        <div className="mt-4 bg-[#3b3f66] p-3 rounded-lg space-y-2 border border-gray-600">
          <input
            type="text"
            placeholder="Tiêu đề card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white border border-gray-500 outline-none"
          />
          <textarea
            placeholder="Mô tả..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white border border-gray-500 outline-none"
            rows={2}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white border border-gray-500 outline-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddCard}
              className="flex-1 bg-green-600 py-1.5 rounded-lg text-white hover:bg-green-700"
            >
              Thêm
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-gray-600 py-1.5 rounded-lg text-white hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-2 bg-[#454b72] text-white rounded-lg hover:bg-[#5a5f8b]"
        >
          + Add Card
        </button>
      )}
    </div>
  );
};

export default Column;