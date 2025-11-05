import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BoardHeader } from "./BoardHeader";
import { BoardDescription } from "./BoardDescription";
import { ListForm } from "./ListForm";
import CommentModal from "./CommentModal";
import CardDetailModal from "./CardDetailModal";
import KanbanBoard from "./KanbanBoard";
import { useBoard } from "../hooks/useBoard";
import { useComments } from "../hooks/useComments";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ListType, Card, ListFormInputs, User } from "./types"; // Added ListFormInputs

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    loading: boardLoading,
    handleDragEnd,
    handleAddList,
    handleDeleteList,
    handleEditCard, // Hàm logic chính cho Card CRUD
    handleDeleteCard
  } = useBoard(id);
  const {
    comments,
    commentLoading,
    commentError,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
    setComments,
    setCommentError,
  } = useComments();
  const { currentUser, loading: userLoading, error: userError } = useCurrentUser();

  const [editingList, setEditingList] = useState<ListType | null>(null);
  const [showListForm, setShowListForm] = useState(false);

  const [addingCardListId, setAddingCardListId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingCardListId, setEditingCardListId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [boardMembers, setBoardMembers] = useState<User[]>([]);

  // Debug: Giữ nguyên
  useEffect(() => {
    console.log("currentUser:", currentUser, "userLoading:", userLoading, "userError:", userError);
  }, [currentUser, userLoading, userError]);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardDetailModal(true);
  };

  // Load board members từ backend
  useEffect(() => {
    const loadBoardMembers = async () => {
      if (board && currentUser) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/user/board/${board._id}/members`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            setBoardMembers(data.data || []);
          } else {
            // Fallback: chỉ có owner
            const members: User[] = [
              {
                _id: currentUser._id,
                name: currentUser.name,
                email: currentUser.email
              }
            ];
            setBoardMembers(members);
          }
        } catch (error) {
          console.error('Error loading board members:', error);
          // Fallback: chỉ có owner
          const members: User[] = [
            {
              _id: currentUser._id,
              name: currentUser.name,
              email: currentUser.email
            }
          ];
          setBoardMembers(members);
        }
      }
    };

    loadBoardMembers();
  }, [board, currentUser]);

  const handleUpdateCard = (updatedCard: Card) => {
    // Cập nhật card trong board state
    if (board) {
      const updatedBoard = {
        ...board,
        ownerList: board.ownerList.map(list => ({
          ...list,
          ownerCard: list.ownerCard?.map(card =>
            card._id === updatedCard._id ? updatedCard : card
          )
        }))
      };
      // Cập nhật board state (cần implement trong useBoard hook)
      setSelectedCard(updatedCard);
    }
  };

  const handleEditList = (list: ListType) => {
    setEditingList(list);
    setShowListForm(true);
  };

  // ✅ NEW: Hàm xử lý submit List Form
  const handleListSubmit = (data: ListFormInputs, listToEdit: ListType | null) => {
    handleAddList(data, listToEdit);
    setEditingList(null);
    setShowListForm(false);
  };

  // ✅ NEW: Hàm mở form thêm Card (creation)
  const handleOpenAddCardForm = (listId: string) => {
    setAddingCardListId(listId);
    setEditingCard(null); // Luôn reset editingCard cho chế độ tạo
    setEditingCardListId(null);
  };

  // ✅ NEW: Hàm khởi tạo chế độ sửa Card (gọi từ List.tsx)
  const handleEditCardInitiate = (card: Card, listId: string) => {
    setEditingCard(card);
    setEditingCardListId(listId);
    setAddingCardListId(listId); // Mở form thêm Card trong List này
  };

  // ✅ Hàm xử lý việc submit Card (cả tạo và sửa) và reset state form
  const handleCardSubmitAndReset = (listId: string, card: Card | null) => {
    // Gọi hook logic chính
    handleEditCard(listId, card, editingCard, editingCardListId, addingCardListId);

    // Reset trạng thái sau khi submit để đóng form
    setEditingCard(null);
    setEditingCardListId(null);
    setAddingCardListId(null);
  };


  if (boardLoading || userLoading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (!board) return <p className="p-6 text-red-500">Không tìm thấy board!</p>;
  if (userError) return <p className="p-6 text-red-500">Lỗi: {userError}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <BoardHeader board={board} currentUser={currentUser} />
      <main className="relative p-4">
        <BoardDescription description={board.description} />
        {/* Nút Thêm danh sách mới */}
        {!showListForm && !editingList && (
          <div className="mb-4">
            <button
              onClick={() => setShowListForm(true)} // Mở form List
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 backdrop-blur-xl border border-white/20 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm danh sách mới</span>
            </button>
          </div>
        )}
        {/* Form List */}
        {(showListForm || editingList) && (
          <ListForm
            onSubmit={(data) => handleListSubmit(data, editingList)}
            editingList={editingList}
            onCancel={() => {
              setEditingList(null);
              setShowListForm(false);
            }}
          />
        )}
        {showCommentModal && selectedCard && (
          <CommentModal
            card={selectedCard}
            comments={comments}
            commentLoading={commentLoading}
            commentError={commentError}
            currentUser={currentUser}
            onClose={() => {
              setShowCommentModal(false);
              setSelectedCard(null);
              setComments([]);
              setCommentError(null);
              setEditingCommentId(null);
            }}
            onSubmitComment={(data) => addComment(selectedCard._id, data.content)}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
          />
        )}

        {showCardDetailModal && selectedCard && (
          <CardDetailModal
            card={selectedCard}
            onClose={() => {
              setShowCardDetailModal(false);
              setSelectedCard(null);
            }}
            onUpdateCard={handleUpdateCard}
            currentUser={currentUser}
            boardMembers={boardMembers}
          />
        )}
        {/* Kanban Board */}
        <KanbanBoard
          board={board}
          currentUser={currentUser}
          onDragEnd={handleDragEnd}
          onEditList={handleEditList}
          onDeleteList={handleDeleteList}
          onAddCard={handleOpenAddCardForm} // ✅ Dùng hàm mới cho Card Creation
          editingCard={editingCard}
          editingCardListId={editingCardListId}
          addingCardListId={addingCardListId}
          onEditCard={handleCardSubmitAndReset} // ✅ Xử lý Card Submit (Create/Update)
          onEditCardInitiate={handleEditCardInitiate} // ✅ NEW PROP: Khởi tạo sửa Card
          onDeleteCard={handleDeleteCard}
          onCardClick={handleCardClick}
        />
      </main>
    </div>
  );
}