import { useNavigate } from "react-router-dom";
// Sử dụng import type cho kiểu Board
import type { Board } from "./types";

interface BoardHeaderProps {
  board: Board;
  currentUser: { _id: string; name: string; email: string } | null;
}

export const BoardHeader = ({ board, currentUser }: BoardHeaderProps) => {
  const nav = useNavigate();

  return (
    <header className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => nav("/broad")}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  {board.broadName}
                </h1>
                <p className="text-blue-200/80 text-xs">Project Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20">
              <span className="text-white/80 text-xs font-medium">{board.ownerList.length} Lists</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <span className="text-white font-bold text-sm">{currentUser?.name?.charAt(0) || "U"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};