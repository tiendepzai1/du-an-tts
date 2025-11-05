import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
// ✅ FIX 1: Import các thành phần kéo thả
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { ListType, Card, CardFormInputs } from "./types";

interface ListProps {
  list: ListType;
  index: number;
  onEdit: (list: ListType) => void;
  onDelete: (listId: string) => Promise<void>;
  onAddCard: (listId: string) => void;
  onEditCard: (listId: string, card: CardFormInputs) => void;
  onEditCardInitiate: (card: Card, listId: string) => void;
  editingCard: Card | null;
  addingCardListId: string | null;
  onDeleteCard: (cardId: string) => Promise<void>;
  onCardClick: (card: Card) => void;
  currentUser: { _id: string; name: string; email: string } | null;
}

export default function List({
  list,
  index,
  onEdit,
  onDelete,
  onAddCard,
  onEditCardInitiate,
  editingCard,
  addingCardListId,
  onEditCard,
  onDeleteCard,
  onCardClick,
  currentUser,
}: ListProps) {
  const [formData, setFormData] = useState<CardFormInputs>({
    cardName: "",
    description: "",
    status: "todo",
    dueDate: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCardClick = () => {
    if (addingCardListId === list._id) {
      if (formData.cardName.trim()) {
        onEditCard(list._id, formData);

        setFormData({
          cardName: "",
          description: "",
          status: "todo",
          dueDate: "",
        });
        onAddCard("");
      }
    } else {
      onAddCard(list._id);
    }
  };

  const handleCancelForm = () => {
    setFormData({
      cardName: "",
      description: "",
      status: "todo",
      dueDate: "",
    });
    onAddCard("");
  };


  const handleDeleteList = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh sách này?")) {
      await onDelete(list._id);
    }
  };

  // ✅ FIX 3: renderCard trả về Draggable component
  const renderCard = (card: Card, cardIndex: number) => (
    <Draggable key={card._id} draggableId={card._id} index={cardIndex}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Sử dụng snapshot.isDragging để thêm style khi đang kéo
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
          }}
          className="group relative bg-white/10 p-3 rounded-lg mb-2 cursor-pointer hover:bg-white/20 transition-colors shadow-md"
          onClick={() => onCardClick(card)}
        >
          {/* Nội dung Card */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{card.cardName}</p>
              {card.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {card.description}
                </p>
              )}
              {card.dueDate && (
                <p className="text-xs text-gray-300 mt-1">
                  Hạn: {new Date(card.dueDate).toLocaleDateString("vi-VN")}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {/* Hiển thị Trạng thái Card */}
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${card.status === 'todo'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : card.status === 'doing'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-green-500/20 text-green-300'
                    }`}
                >
                  {card.status === 'todo' ? 'Việc cần làm' : card.status === 'doing' ? 'Đang thực hiện' : 'Đã xong'}
                </span>
                {/* Hiển thị Labels (Nếu có) */}
                {card.labels?.map(label => (
                  <span
                    key={label._id}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${label.color}20`, color: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>

              {/* Hiển thị người thực hiện */}
              {card.memberUser && card.memberUser.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex -space-x-1">
                    {card.memberUser.slice(0, 3).map(member => (
                      <div
                        key={member._id}
                        className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                        title={member?.name || member?.email || ''}
                      >
                        <span className="text-white text-xs font-bold">
                          {member?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    ))}
                    {card.memberUser.length > 3 && (
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <span className="text-white text-xs font-bold">
                          +{card.memberUser.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-300 ml-1">
                    {card.memberUser.length} người
                  </span>
                </div>
              )}
            </div>

            {/* Nút Sửa và Xóa - Vị trí tuyệt đối, chỉ hiện khi hover */}
            {currentUser && (
              <div
                className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/50 p-1 rounded z-10"
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click vào Card chính
              >
                {/* Nút Sửa Card (Dùng onEditCardInitiate) */}
                <button
                  onClick={() => {
                    onEditCardInitiate(card, list._id);
                    setFormData({
                      cardName: card.cardName,
                      description: card.description || "",
                      status: card.status || "todo",
                      dueDate: card.dueDate || "",
                    } as CardFormInputs);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-xs p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {/* Nút Xóa Card (Gọi onDeleteCard) */}
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) {
                      onDeleteCard(card._id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 text-xs p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="min-w-[300px] bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg h-full max-h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
          <h3 className="text-lg font-bold text-white">{list.listName}</h3>
          {list.description && (
            <p className="text-sm text-gray-400">{list.description}</p>
          )}
        </div>
        {currentUser && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(list)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteList}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ✅ FIX 4: Wrap khu vực Card List bằng Droppable */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            // Thêm style khi kéo qua để dễ nhận biết
            className={`flex-1 overflow-y-auto pr-1 custom-scrollbar ${snapshot.isDraggingOver ? 'bg-indigo-900/20' : ''}`}
          >
            {list.ownerCard && list.ownerCard.length > 0 ? (
              list.ownerCard.map((card, cardIndex) => renderCard(card, cardIndex))
            ) : (
              !addingCardListId && <p className="text-gray-500 text-sm italic p-2">Kéo thẻ vào đây hoặc thêm thẻ mới.</p>
            )}
            {provided.placeholder} {/* Giữ chỗ cho thẻ đang được kéo */}
          </div>
        )}
      </Droppable>


      {/* Card Form */}
      {(addingCardListId === list._id || (editingCard && addingCardListId === list._id)) && (
        <div className="mt-4 space-y-2 flex-shrink-0 bg-white/5 p-3 rounded-lg border border-white/10">
          <input
            name="cardName"
            value={formData.cardName}
            onChange={handleFormChange}
            placeholder={editingCard ? "Cập nhật tên thẻ..." : "Tên thẻ..."}
            className="w-full p-2 rounded bg-gray-900/50 text-white placeholder-gray-400 text-sm"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Mô tả..."
            className="w-full p-2 rounded bg-gray-900/50 text-white placeholder-gray-400 min-h-[50px] text-sm"
          />
          <div className="flex gap-2">
            {/* Input Date */}
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleFormChange}
              className="flex-1 p-2 rounded bg-gray-900/50 text-white text-sm"
            />
            {/* Status Select */}
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="p-2 rounded bg-gray-900/50 text-white text-sm"
            >
              <option value="todo">Việc cần làm</option>
              <option value="doing">Đang thực hiện</option>
              <option value="done">Đã xong</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCardClick}
              className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium text-sm"
            >
              {editingCard ? 'Lưu Thẻ' : 'Thêm Thẻ'}
            </button>
            <button
              onClick={handleCancelForm}
              className="bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-colors text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      {/* Nút Add Card dưới cùng */}
      {addingCardListId !== list._id && currentUser && (
        <button
          onClick={() => onAddCard(list._id)}
          className="mt-2 w-full bg-white/10 text-white p-2 rounded hover:bg-white/20 transition-colors text-sm font-medium"
        >
          + Thêm Thẻ
        </button>
      )}
    </div>
  );
}