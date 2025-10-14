import React from "react";
import { useForm } from "react-hook-form";

type BoardFormInputs = {
  boardName: string;
  description: string;
};

const BoardAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardFormInputs>();

  const onSubmit = (data: BoardFormInputs) => {
    console.log("Board Data:", data);
    // Gửi data lên API hoặc xử lý thêm ở đây
    reset();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm Board mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Board Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên Board</label>
          <input
            type="text"
            {...register("boardName", { required: "Tên board là bắt buộc" })}
            placeholder="Nhập tên board..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.boardName && (
            <p className="text-red-500 text-sm mt-1">{errors.boardName.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description", { required: "Mô tả là bắt buộc" })}
            placeholder="Nhập mô tả..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Thêm Board
        </button>
      </form>
    </div>
  );
};

export default BoardAdd;
