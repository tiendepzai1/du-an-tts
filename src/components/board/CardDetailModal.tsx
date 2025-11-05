import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageCircle, Edit2, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import type { Card, User as UserType } from './types';
import UserAvatar from './UserAvatar';

interface CardDetailModalProps {
    card: Card;
    onClose: () => void;
    onUpdateCard: (updatedCard: Card) => void;
    currentUser: { _id: string; name: string; email: string } | null;
    boardMembers: UserType[]; // Danh sách thành viên trong dự án
}

interface Comment {
    _id: string;
    content: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export default function CardDetailModal({
    card,
    onClose,
    onUpdateCard,
    currentUser,
    boardMembers
}: CardDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCard, setEditedCard] = useState<Card>(card);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // Tạo danh sách thành viên bao gồm currentUser
    const allMembers = React.useMemo(() => {
        const members = [...boardMembers];

        // Thêm currentUser nếu chưa có trong boardMembers
        if (currentUser && !members.some(member => member._id === currentUser._id)) {
            members.unshift({
                _id: currentUser._id,
                name: currentUser.name,
                email: currentUser.email
            });
        }

        return members;
    }, [boardMembers, currentUser]);

    // Load comments khi modal mở
    useEffect(() => {
        loadComments();
    }, [card._id]);

    const loadComments = async () => {
        try {
            setCommentsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:3000/comment/card/${card._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setComments(response.data.data || []);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleSaveCard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3000/card/${card._id}`,
                {
                    cardName: editedCard.cardName,
                    description: editedCard.description,
                    dueDate: editedCard.dueDate,
                    status: editedCard.status,
                    memberUser: editedCard.memberUser?.map(member => member._id) || []
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onUpdateCard(response.data.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Có lỗi khi cập nhật thẻ');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/comment',
                {
                    cardId: card._id,
                    content: newComment.trim()
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments(prev => [response.data.data, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Có lỗi khi thêm bình luận');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:3000/comment/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Có lỗi khi xóa bình luận');
        }
    };

    const handleToggleMember = (memberId: string) => {
        const member = allMembers.find(m => m._id === memberId);
        if (!member) return;

        const isAlreadyMember = editedCard.memberUser?.some(m => m._id === memberId);

        if (isAlreadyMember) {
            // Xóa member nếu đã có
            setEditedCard(prev => ({
                ...prev,
                memberUser: prev.memberUser?.filter(m => m._id !== memberId) || []
            }));
        } else {
            // Thêm member nếu chưa có
            setEditedCard(prev => ({
                ...prev,
                memberUser: [...(prev.memberUser || []), member]
            }));
        }
    };

    const handleRemoveMember = (memberId: string) => {
        setEditedCard(prev => ({
            ...prev,
            memberUser: prev.memberUser?.filter(m => m._id !== memberId) || []
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'todo': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'doing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'done': return 'bg-green-500/20 text-green-300 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'todo': return 'Việc cần làm';
            case 'doing': return 'Đang thực hiện';
            case 'done': return 'Đã xong';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="flex h-full">
                    {/* Left Panel - Card Details */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedCard.cardName}
                                        onChange={(e) => setEditedCard(prev => ({ ...prev, cardName: e.target.value }))}
                                        className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-gray-900">{card.cardName}</h1>
                                )}

                                {/* Status Badge */}
                                <div className="mt-2">
                                    {isEditing ? (
                                        <select
                                            value={editedCard.status}
                                            onChange={(e) => setEditedCard(prev => ({ ...prev, status: e.target.value as any }))}
                                            className="px-3 py-1 rounded-full text-sm font-medium border-2 bg-white"
                                        >
                                            <option value="todo">Việc cần làm</option>
                                            <option value="doing">Đang thực hiện</option>
                                            <option value="done">Đã xong</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(card.status || 'todo')}`}>
                                            {getStatusText(card.status || 'todo')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                {currentUser && (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={handleSaveCard}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setEditedCard(card);
                                                    }}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Chỉnh sửa
                                            </button>
                                        )}
                                    </>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
                            {isEditing ? (
                                <textarea
                                    value={editedCard.description || ''}
                                    onChange={(e) => setEditedCard(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Thêm mô tả chi tiết..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                />
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {card.description ? (
                                        <p className="text-gray-700 whitespace-pre-wrap">{card.description}</p>
                                    ) : (
                                        <p className="text-gray-500 italic">Chưa có mô tả</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Due Date */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hạn hoàn thành</h3>
                            {isEditing ? (
                                <input
                                    type="datetime-local"
                                    value={editedCard.dueDate ? new Date(editedCard.dueDate).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setEditedCard(prev => ({ ...prev, dueDate: e.target.value }))}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    {card.dueDate ? (
                                        <span className="text-gray-700">
                                            {new Date(card.dueDate).toLocaleString('vi-VN')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 italic">Chưa đặt hạn</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Members */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Người thực hiện</h3>
                            <div className="space-y-2">
                                {/* Current Members */}
                                <div className="space-y-2">
                                    {(isEditing ? editedCard.memberUser : card.memberUser)?.map(member => (
                                        <div key={member._id} className="flex items-center gap-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                            <UserAvatar user={member} size="lg" />
                                            <div className="flex-1">
                                                {member?.name && (
                                                    <p className="font-semibold text-blue-900 text-sm">{member.name}</p>
                                                )}
                                                <p className="text-xs text-blue-600">{member?.email}</p>
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveMember(member._id)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                    title="Xóa khỏi thẻ"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {(!card.memberUser || card.memberUser.length === 0) && !isEditing && (
                                        <div className="text-center py-8">
                                            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                            <p className="text-gray-500 italic">Chưa có người thực hiện</p>
                                        </div>
                                    )}
                                </div>

                                {/* Add/Remove Members (when editing) */}
                                {isEditing && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn người thực hiện:</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {allMembers.map(member => {
                                                const isSelected = editedCard.memberUser?.some(m => m._id === member._id);
                                                console.log('Member data:', member); // Debug log
                                                return (
                                                    <label key={member._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggleMember(member._id)}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                        />
                                                        <div className="flex items-center space-x-2">
                                                            <UserAvatar user={member} size="md" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {member?.name || member?.email || 'User'}
                                                                </p>
                                                                {member?.name && member?.email && (
                                                                    <p className="text-xs text-gray-500">{member.email}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Comments */}
                    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Bình luận ({comments.length})
                            </h3>
                        </div>

                        {/* Add Comment */}
                        {currentUser && (
                            <div className="p-4 border-b border-gray-200">
                                <div className="space-y-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Viết bình luận..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Thêm bình luận
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {commentsLoading ? (
                                <div className="text-center text-gray-500">Đang tải bình luận...</div>
                            ) : comments.length > 0 ? (
                                <div className="space-y-4">
                                    {comments.map(comment => (
                                        <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3">
                                                    <UserAvatar user={comment.userId} size="lg" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {comment.userId?.name || comment.userId?.email || 'User'}
                                                            </p>
                                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{comment.userId?.email}</p>
                                                    </div>
                                                </div>
                                                {currentUser && currentUser._id === comment.userId?._id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                        title="Xóa bình luận"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="ml-13">
                                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Chưa có bình luận nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}