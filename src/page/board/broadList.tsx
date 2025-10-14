import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

type Board = {
  boardName: string;
  description: string;
};

type BoardListForm = {
  boards: Board[];
};

const BoardList: React.FC = () => {
  const { control, register, handleSubmit, reset } = useForm<BoardListForm>({
    defaultValues: {
      boards: [
        { boardName: "Frontend Team", description: "Các task liên quan đến FE" },
        { boardName: "Backend Team", description: "API và cơ sở dữ liệu" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "boards",
  });
  

  const onSubmit = (data: BoardListForm) => {
    console.log("Danh sách boards:", data.boards);
    alert("Xem console để kiểm tra danh sách!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách Board</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1">
                Tên Board
              </label>
              <input
                {...register(`boards.${index}.boardName` as const)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <textarea
                {...register(`boards.${index}.description` as const)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 text-sm mt-1"
            >
              Xóa
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ boardName: "", description: "" })}
          className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Thêm Board mới
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu Danh Sách
        </button>
      </form>
    </div>
  );
};

export default BoardList;
