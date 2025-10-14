import React from "react";
import { useForm } from "react-hook-form";

type ListFormInputs = {
  listName: string;
};

const ListAdd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ListFormInputs>();

  const onSubmit = (data: ListFormInputs) => {
    console.log("Dữ liệu List:", data);
    // Gửi data lên API hoặc xử lý thêm ở đây
    reset();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm List mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* List Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên List</label>
          <input
            type="text"
            {...register("listName", { required: "Tên list là bắt buộc" })}
            placeholder="Nhập tên list..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.listName && (
            <p className="text-red-500 text-sm mt-1">{errors.listName.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Thêm List
        </button>
      </form>
    </div>
  );
};

export default ListAdd;
