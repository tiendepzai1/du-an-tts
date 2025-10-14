import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type BoardFormInputs = {
  boardName: string;
  description: string;
};

type BoardUpdateProps = {
  initialData: BoardFormInputs;
  onUpdate: (data: BoardFormInputs) => void;
};

const BoardUpdate: React.FC<BoardUpdateProps> = ({ initialData, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BoardFormInputs>({
    defaultValues: initialData,
  });

  // Reset form khi dữ liệu ban đầu thay đổi (ví dụ khi chọn board khác)
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data: BoardFormInputs) => {
    onUpdate(data);
    console.log("Dữ liệu cập nhật:", data);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cập nhật Board</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Board Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên Board</label>
          <input
            type="text"
            {...register("boardName", { required: "Tên board là bắt buộc" })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tên board..."
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
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Nhập mô tả..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isDirty}
          className={`w-full py-2 rounded-lg font-medium transition ${
            isDirty
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default BoardUpdate;
