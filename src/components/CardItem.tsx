import React, { useState, useEffect } from "react";
import { Clock, MoreHorizontal, Edit2, Trash2, X, Check } from "lucide-react";

interface CardItemProps {
  id: string; // _id từ MongoDB
  title: string;
  description?: string;
  dueDate?: string | null;
  onEdit: (id: string, updatedData: { cardName: string; description?: string; dueDate?: string | null }) => void;
  onDelete: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  id,
  title,
  description,
  dueDate,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const [editDueDate, setEditDueDate] = useState(dueDate ? dueDate.slice(0, 10) : "");

  // Khi props thay đổi, update state để sync
  useEffect(() => {
    setEditTitle(title);
    setEditDescription(description || "");
    setEditDueDate(dueDate ? dueDate.slice(0, 10) : "");
  }, [title, description, dueDate]);

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert("Tiêu đề không được để trống!");
      return;
    }
    onEdit(id, {
      cardName: editTitle.trim(),
      description: editDescription.trim(),
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#3a3f63] text-white p-3 rounded-lg shadow-sm hover:shadow-lg hover:bg-[#4a4f73] transition">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Tiêu đề..."
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white text-sm border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Mô tả..."
            rows={2}
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white text-sm border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full p-2 rounded-md bg-[#2c2f48] text-white text-sm border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
            >
              <Check className="w-4 h-4" /> Lưu
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-md text-sm"
            >
<X className="w-4 h-4" /> Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base leading-tight">{title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-[#50557d] rounded-md"
                title="Sửa"
              >
                <Edit2 className="w-4 h-4 text-gray-300 hover:text-white" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1 hover:bg-[#50557d] rounded-md"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400" />
              </button>
              <MoreHorizontal className="w-4 h-4 text-gray-300" />
            </div>
          </div>

          {description && <p className="text-sm text-gray-300 mt-1">{description}</p>}

          {dueDate && (
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{editDueDate}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardItem;
