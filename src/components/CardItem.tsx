import React from "react";
import { Clock, MoreHorizontal } from "lucide-react";

interface CardItemProps {
  title: string;
  description?: string;
  dueDate?: string;
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  description,
  dueDate,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#3a3f63] text-white p-3 rounded-lg shadow-sm hover:shadow-lg hover:bg-[#4a4f73] cursor-pointer transition"
    >
      {/* Tiêu đề card */}
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-base leading-tight">{title}</h3>
        <MoreHorizontal className="w-4 h-4 text-gray-300 hover:text-white" />
      </div>

      {/* Mô tả nếu có */}
      {description && (
        <p className="text-sm text-gray-300 mt-1">{description}</p>
      )}

      {/* Hạn chót nếu có */}
      {dueDate && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{dueDate}</span>
        </div>
      )}
    </div>
  );
};

export default CardItem;
