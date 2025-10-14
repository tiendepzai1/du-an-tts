import React from "react";
import { useForm } from "react-hook-form";

type List = {
  id: number;
  listName: string;
};

const ListDisplay: React.FC = () => {
  // Giả lập dữ liệu list
  const lists: List[] = [
    { id: 1, listName: "Việc cần làm" },
    { id: 2, listName: "Đang thực hiện" },
    { id: 3, listName: "Hoàn thành" },
  ];

  const { register } = useForm();

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách List</h2>

      <form className="space-y-4">
        {lists.map((list) => (
          <div
            key={list.id}
            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
          >
            <label className="block text-gray-700 font-medium mb-1">Tên List</label>
            <input
              type="text"
              defaultValue={list.listName}
              {...register(`list-${list.id}`)}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default ListDisplay;
