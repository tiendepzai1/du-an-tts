// TRONG src/components/board/KanbanBoard.tsx

import { DragDropContext } from "@hello-pangea/dnd";
import type { Board, ListType, Card } from "./types.ts";
import List from "./List.tsx";

interface KanbanBoardProps {
  board: Board;
  currentUser: { _id: string; name: string; email: string } | null;
  onDragEnd: (result: any) => void;
  onEditList: (list: ListType) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string) => void;
  editingCard: Card | null;
  editingCardListId: string | null;
  addingCardListId: string | null;
  onEditCard: (listId: string, card: Card | null) => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (card: Card) => void;

  // ✅ FIX 1: THÊM PROP KHỞI TẠO SỬA CARD VÀO INTERFACE
  onEditCardInitiate: (card: Card, listId: string) => void;
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
  onEditCardInitiate, // ✅ KHAI BÁO PROP MỚI
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
              // ✅ FIX 2: TRUYỀN PROP XUỐNG COMPONENT LIST
              onEditCardInitiate={onEditCardInitiate}
            />
          ))
        ) : (
          <div className="text-center w-full py-20">
            {/* ... (Nội dung khi không có List) ... */}
          </div>
        )}
      </div>
    </DragDropContext>
  );
}