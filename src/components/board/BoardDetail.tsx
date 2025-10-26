import { useState, useEffect } from "react"; // Thêm useEffect
import { useParams } from "react-router-dom";
import { BoardHeader } from "./BoardHeader";
import { BoardDescription } from "./BoardDescription";
import { ListForm } from "./ListForm";
import { CommentModal } from "./CommentModal";
import KanbanBoard from "./KanbanBoard";
import { useBoard } from "../hooks/useBoard";
import { useComments } from "../hooks/useComments";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { ListType, Card } from "./types";

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const { board, loading: boardLoading, handleDragEnd, handleAddList, handleDeleteList, handleEditCard, handleDeleteCard } = useBoard(id);
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
  const [showForm, setShowForm] = useState(false);
  const [addingCardListId, setAddingCardListId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [editingCardListId, setEditingCardListId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Debug
  useEffect(() => {
    console.log("currentUser:", currentUser, "userLoading:", userLoading, "userError:", userError);
  }, [currentUser, userLoading, userError]);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCommentModal(true);
    fetchComments(card._id);
  };

  const handleEditList = (list: ListType) => {
    setEditingList(list);
    setShowForm(true);
  };

  const handleAddCard = (listId: string) => {
    if (listId === "new") {
      setShowForm(true);
      setEditingList(null);
    } else {
      setAddingCardListId(listId);
      setEditingCard(null);
      setEditingCardListId(null);
    }
  };

  const handleEditCardLocal = (listId: string, card: Card | null) => {
    handleEditCard(listId, card, editingCard, editingCardListId, addingCardListId);
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
        {!showForm && !editingList && (
          <div className="mb-4">
            <button
              onClick={() => handleAddCard("new")}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 backdrop-blur-xl border border-white/20 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm danh sách mới</span>
            </button>
          </div>
        )}
        {(showForm || editingList) && (
          <ListForm
            onSubmit={(data) => {
              handleAddList(data, editingList);
              setEditingList(null);
              setShowForm(false);
            }}
            editingList={editingList}
            onCancel={() => {
              setEditingList(null);
              setShowForm(false);
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
        <KanbanBoard
          board={board}
          currentUser={currentUser}
          onDragEnd={handleDragEnd}
          onEditList={handleEditList}
          onDeleteList={handleDeleteList}
          onAddCard={handleAddCard}
          editingCard={editingCard}
          editingCardListId={editingCardListId}
          addingCardListId={addingCardListId}
          onEditCard={handleEditCardLocal}
          onDeleteCard={handleDeleteCard}
          onCardClick={handleCardClick}
        />
      </main>
    </div>
  );
}