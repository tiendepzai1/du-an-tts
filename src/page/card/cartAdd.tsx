import React from "react";
import { useForm } from "react-hook-form";

type CardFormInputs = {
  cardName: string;
  description: string;
  dueDate: string;
  position: number;
  status: string;
};

const CardAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CardFormInputs>();

  const onSubmit = (data: CardFormInputs) => {
    console.log("Dữ liệu card:", data);
    // Gửi dữ liệu lên API tại đây (ví dụ: POST /api/cards)
    reset();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm Card mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Card Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên Card</label>
          <input
            type="text"
            {...register("cardName", { required: "Tên card là bắt buộc" })}
            placeholder="Nhập tên card..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            placeholder="Nhập mô tả..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Hạn hoàn thành</label>
          <input
            type="date"
            {...register("dueDate", { required: "Vui lòng chọn hạn hoàn thành" })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Vị trí</label>
          <input
            type="number"
            {...register("position", {
              required: "Vui lòng nhập vị trí",
              min: { value: 1, message: "Vị trí phải lớn hơn 0" },
            })}
            placeholder="VD: 1, 2, 3..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Trạng thái</label>
          <select
            {...register("status", { required: "Vui lòng chọn trạng thái" })}
            className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Thêm Card
        </button>
      </form>
    </div>
  );
};

export default CardAdd;
