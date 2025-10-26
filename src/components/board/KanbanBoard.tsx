import { DragDropContext } from "@hello-pangea/dnd";
import type { Board, ListType, Card } from "./types.ts";
import List from "./List.tsx";

interface KanbanBoardProps {
  board: Board;
  currentUser: { _id: string; name: string; email: string } | null;
  onDragEnd: (result: any) => void; // Sử dụng any thay vì DropResult
  onEditList: (list: ListType) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string) => void;
  editingCard: Card | null;
  editingCardListId: string | null;
  addingCardListId: string | null;
  onEditCard: (listId: string, card: Card | null) => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (card: Card) => void;
}

export default function KanbanBoard({
  board,
  currentUser,
  onDragEnd,
  onEditList,
  onDeleteList,
  onAddCard,
  editingCard,
  editingCardListId,
  addingCardListId,
  onEditCard,
  onDeleteCard,
  onCardClick,
}: KanbanBoardProps) {
  const handleAddNewList = () => {
    onAddCard("new"); // Gửi tín hiệu đến BoardDetail để mở form
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.ownerList.length > 0 ? (
          board.ownerList.map((list, index) => (
            <List
              key={list._id}
              list={list}
              index={index}
              onEdit={onEditList}
              onDelete={onDeleteList}
              onAddCard={onAddCard}
              editingCard={editingCard}
              editingCardListId={editingCardListId}
              addingCardListId={addingCardListId}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onCardClick={onCardClick}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center w-full py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-xl border border-white/20">
              <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Chưa có danh sách nào</h3>
            <p className="text-white/70 mb-6 text-lg max-w-xl mx-auto leading-relaxed">
              Tạo danh sách đầu tiên để bắt đầu quản lý công việc một cách chuyên nghiệp
            </p>
            <button
              onClick={handleAddNewList}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-xl border border-white/20"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Tạo danh sách đầu tiên</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}