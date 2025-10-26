

interface BoardDescriptionProps {
  description: string;
}

export const BoardDescription = ({ description }: BoardDescriptionProps) => {
  return (
    <div className="mb-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white mb-1">Mô tả dự án</h2>
            <p className="text-white/80 text-xs leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};