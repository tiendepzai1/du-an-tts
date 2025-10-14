import { Users, Bell, Share2, Star, MoreHorizontal, Search, Grid } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#1e1e2f]/90 backdrop-blur border-b border-white/10 text-white">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* App icon */}
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-gray-300" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-xs font-bold">
              MH
            </div>
            <span className="font-semibold text-sm">Manh Hung</span>
          </div>
        </div>
      </div>

      {/* CENTER: Search bar */}
      <div className="flex-1 mx-6">
        <div className="flex items-center bg-[#2a2a3d] rounded-md px-3 py-1 border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-full text-sm placeholder-gray-400 focus:outline-none text-white"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* Create button */}
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-sm font-medium">
          Create
        </button>

        {/* Avatars Group */}
        <div className="flex -space-x-2">
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="member"
            className="w-8 h-8 rounded-full border-2 border-[#1e1e2f]"
          />
          <img
            src="https://i.pravatar.cc/40?img=2"
            alt="member"
            className="w-8 h-8 rounded-full border-2 border-[#1e1e2f]"
          />
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="member"
            className="w-8 h-8 rounded-full border-2 border-[#1e1e2f]"
          />
          <div className="w-8 h-8 bg-[#2d2d40] text-sm text-gray-300 rounded-full border-2 border-[#1e1e2f] flex items-center justify-center">
            +3
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 text-gray-300">
          <Star className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
          <Share2 className="w-5 h-5 hover:text-white cursor-pointer" />
          <Bell className="w-5 h-5 hover:text-white cursor-pointer" />
          <MoreHorizontal className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>

        {/* Current User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
          NH
        </div>
      </div>
    </header>
  );
}
