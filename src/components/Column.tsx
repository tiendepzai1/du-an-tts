import React from "react";
import CardItem from "./CardItem"; // ✅ nhớ đúng tên file, viết hoa “C”

interface Card {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
}

interface ColumnProps {
  title: string;
  cards?: Card[];
}

const Column: React.FC<ColumnProps> = ({ title, cards = [] }) => {
  return (
    <div className="bg-[#2c2f48] w-72 rounded-xl p-3 flex-shrink-0">
      {/* Tiêu đề cột */}
      <h2 className="text-white text-lg font-semibold mb-3">{title}</h2>

      {/* Danh sách các thẻ card */}
      <div className="space-y-3">
        {cards.length > 0 ? (
          cards.map((card) => (
            <CardItem
              key={card.id}
              title={card.title}
              description={card.description}
              dueDate={card.dueDate}
            />
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No cards yet</p>
        )}
      </div>

      {/* Nút thêm card */}
      <button className="mt-4 w-full py-2 bg-[#454b72] text-white rounded-lg hover:bg-[#5a5f8b] transition">
        + Add Card
      </button>
    </div>
  );
};

export default Column;
