import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type CardFormInputs = {
  cardName: string;
  description: string;
  dueDate: string;
  position: number;
  status: string;
};

type CardUpdateProps = {
  initialData: CardFormInputs;
  onUpdate: (data: CardFormInputs) => void;
};

const CardUpdate: React.FC<CardUpdateProps> = ({ initialData, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CardFormInputs>({
    defaultValues: initialData,
  });

  // Reset lại form nếu dữ liệu ban đầu thay đổi
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data: CardFormInputs) => {
    console.log("Dữ liệu cập nhật:", data);
    onUpdate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Cập nhật Card
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Card Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tên Card
          </label>
          <input
            type="text"
            {...register("cardName", { required: "Tên card là bắt buộc" })}
            placeholder="Nhập tên card..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.cardName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardName.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Hạn hoàn thành
          </label>
          <input
            type="date"
            {...register("dueDate", { required: "Vui lòng chọn hạn hoàn thành" })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Trạng thái
          </label>
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
            <p className="text-red-500 text-sm mt-1">
              {errors.status.message}
            </p>
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
          Cập nhật Card
        </button>
      </form> 
    </div>
  );
};

export default CardUpdate;
