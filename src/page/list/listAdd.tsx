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
    reset();
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200 w-80">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        ➕ Thêm danh sách
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* List Name */}
        <div>
          <input
            type="text"
            {...register("listName", { required: "Tên list là bắt buộc" })}
            placeholder="Nhập tên danh sách..."
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       focus:border-blue-400 transition"
          />
          {errors.listName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.listName.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-xl 
                     shadow transition-all duration-150 active:scale-95"
        >
          Thêm List
        </button>
      </form>
    </div>
  );
};

export default ListAdd;
