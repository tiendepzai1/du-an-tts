import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import type { ListType, Card } from "./types";

interface ListProps {
  list: ListType;
  index: number;
  onEdit: (list: ListType) => void;
  onDelete: (listId: string) => void;
  onAddCard: (listId: string) => void;
  editingCard: Card | null;
  editingCardListId: string | null;
  addingCardListId: string | null;
  onEditCard: (listId: string, card: Card | null) => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (card: Card) => void;
  currentUser: { _id: string; name: string; email: string } | null;
}

export default function List({
  list,
  index,
  onEdit,
  onDelete,
  onAddCard,
  editingCard,
  editingCardListId,
  addingCardListId,
  onEditCard,
  onDeleteCard,
  onCardClick,
  currentUser,
}: ListProps) {
  const [cardName, setCardName] = useState("");

  const handleAddCardClick = () => {
    if (addingCardListId === list._id) {
      if (cardName.trim()) {
        const newCard: Card = {
          _id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
          cardName: cardName.trim(),
          description: "",
          dueDate: undefined,
          status: false,
          comments: [],
        };
        onEditCard(list._id, newCard);
        setCardName("");
      }
    } else {
      onAddCard(list._id);
    }
  };

  const handleDeleteList = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh sách này?")) {
      onDelete(list._id);
    }
  };

  const handleDeleteCardLocal = (cardId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
      onDeleteCard(cardId);
    }
  };

  return (
    <div className="min-w-[300px] bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{list.listName}</h3>
        {currentUser && (
          <div className="space-x-2">
            <button
              onClick={() => onEdit(list)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" /> Sửa 
            </button>
            <button
              onClick={handleDeleteList}
              className="text-red-400 hover:text-red-300 text-sm flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Xóa
            </button>
          </div>
        )}
      </div>

      {list.ownerCard?.map((card) => (
        <div
          key={card._id}
          onClick={() => onCardClick(card)}
          className="bg-gray-800/50 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
        >
          <p className="text-white text-sm">{card.cardName}</p>
          {editingCard?. _id === card._id && editingCardListId === list._id && (
            <input
              value={editingCard.cardName}
              onChange={(e) => onEditCard(list._id, { ...editingCard, cardName: e.target.value })}
              className="w-full mt-2 p-1 rounded text-black"
            />
          )}
          {currentUser && (
            <button
              onClick={() => handleDeleteCardLocal(card._id)}
              className="text-red-400 hover:text-red-300 text-xs mt-1 flex items-center"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Xóa
            </button>
          )}
        </div>
      ))}

      {addingCardListId === list._id && (
        <div className="mt-2">
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Thêm thẻ mới..."
            className="w-full p-2 rounded text-black"
          />
          <button
            onClick={handleAddCardClick}
            className="mt-1 bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
          >
            Thêm
          </button>
        </div>
      )}

      {!addingCardListId && (
        <button
          onClick={handleAddCardClick}
          className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          + Thêm thẻ
        </button>
      )}
    </div>
  );
}