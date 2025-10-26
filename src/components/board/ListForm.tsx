import { useForm } from "react-hook-form";
import type { ListType, ListFormInputs } from "./types";

interface ListFormProps {
  onSubmit: (data: ListFormInputs) => void;
  editingList: ListType | null;
  onCancel: () => void;
}

export const ListForm = ({ onSubmit, editingList, onCancel }: ListFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListFormInputs>({ defaultValues: editingList || {} });

  return (
    <div className="mb-6">
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">
            {editingList ? "Chỉnh sửa danh sách" : "Tạo danh sách mới"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Tên danh sách</label>
              <input
                {...register("listName", { required: "Tên list là bắt buộc" })}
                placeholder="Nhập tên danh sách..."
                className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
              />
              {errors.listName && (
                <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.listName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Trạng thái</label>
              <select
                {...register("status")}
                className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm"
              >
                <option value="việc cần làm" className="bg-gray-800">Việc cần làm</option>
                <option value="đang thực hiện" className="bg-gray-800">Đang thực hiện</option>
                <option value="đã xong" className="bg-gray-800">Đã xong</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Mô tả</label>
            <textarea
              {...register("description")}
              placeholder="Mô tả chi tiết về danh sách..."
              className="w-full border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm"
            >
              {editingList ? "Cập nhật danh sách" : "Tạo danh sách"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}