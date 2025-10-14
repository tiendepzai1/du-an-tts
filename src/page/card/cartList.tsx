import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

type Card = {
  cardName: string;
  description: string;
  dueDate: string;
  position: number;
  status: string;
};

type CardListForm = {
  cards: Card[];
};

const CardList: React.FC = () => {
  const { control, register, handleSubmit } = useForm<CardListForm>({
    defaultValues: {
      cards: [
        {
          cardName: "Thiết kế UI",
          description: "Tạo mockup cho trang chủ",
          dueDate: "2025-10-15",
          position: 1,
          status: "in_progress",
        },
        {
          cardName: "API Login",
          description: "Tạo API xác thực người dùng",
          dueDate: "2025-10-20",
          position: 2,
          status: "todo",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const onSubmit = (data: CardListForm) => {
    console.log("Danh sách card:", data.cards);
    alert("Xem console để kiểm tra danh sách!");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Danh sách Card
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Card Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Tên Card
                </label>
                <input
                  {...register(`cards.${index}.cardName` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  {...register(`cards.${index}.dueDate` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Mô tả
                </label>
                <textarea
                  {...register(`cards.${index}.description` as const)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Vị trí
                </label>
                <input
                  type="number"
                  {...register(`cards.${index}.position` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  {...register(`cards.${index}.status` as const)}
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Xóa
            </button>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              append({
                cardName: "",
                description: "",
                dueDate: "",
                position: fields.length + 1,
                status: "todo",
              })
            }
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Thêm Card mới
          </button>

          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Lưu danh sách
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardList;
