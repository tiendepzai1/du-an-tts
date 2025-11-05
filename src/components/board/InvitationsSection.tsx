import { useState, useEffect } from 'react';
import { Mail, Check, X, Clock } from 'lucide-react';
import axios from 'axios';

interface Invitation {
    _id: string;
    boardId: {
        _id: string;
        broadName: string;
        description?: string;
    };
    senderId: {
        _id: string;
        name: string;
        email: string;
    };
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

interface InvitationsSectionProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    onInvitationHandled: () => void; // Callback để refresh danh sách board
}

export default function InvitationsSection({ onSuccess, onError, onInvitationHandled }: InvitationsSectionProps) {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [handlingId, setHandlingId] = useState<string | null>(null);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/invitation/received', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const pendingInvitations = (response.data.data || []).filter(
                (inv: Invitation) => inv.status === 'pending'
            );

            setInvitations(pendingInvitations);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleInvitation = async (invitationId: string, action: 'accept' | 'reject') => {
        const token = localStorage.getItem('token');
        if (!token) {
            onError('Vui lòng đăng nhập lại');
            return;
        }

        setHandlingId(invitationId);

        try {
            const endpoint = action === 'accept' ? 'accept' : 'reject';
            await axios.put(
                `http://localhost:3000/invitation/${invitationId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const successMessage = action === 'accept'
                ? 'Đã chấp nhận lời mời! Dự án sẽ xuất hiện trong danh sách của bạn.'
                : 'Đã từ chối lời mời.';

            onSuccess(successMessage);

            // Xóa lời mời khỏi danh sách
            setInvitations(prev => prev.filter(inv => inv._id !== invitationId));

            // Callback để refresh danh sách board nếu chấp nhận
            if (action === 'accept') {
                onInvitationHandled();
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Lỗi khi ${action} lời mời`;
            onError(errorMessage);
        } finally {
            setHandlingId(null);
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span className="ml-2 text-white/70">Đang tải lời mời...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (invitations.length === 0) {
        return null; // Không hiển thị gì nếu không có lời mời
    }

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                    Lời mời tham gia dự án ({invitations.length})
                </h2>
            </div>

            <div className="space-y-4">
                {invitations.map(invitation => (
                    <div
                        key={invitation._id}
                        className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {invitation.senderId.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">
                                            {invitation.senderId.name}
                                        </p>
                                        <p className="text-white/60 text-sm">
                                            {invitation.senderId.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-white/90 mb-2">
                                        <span className="font-medium">Mời bạn tham gia dự án:</span>
                                    </p>
                                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                                        <h3 className="text-white font-bold text-lg">
                                            {invitation.boardId.broadName}
                                        </h3>
                                        {invitation.boardId.description && (
                                            <p className="text-white/70 text-sm mt-1">
                                                {invitation.boardId.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {invitation.message && (
                                    <div className="mb-4">
                                        <p className="text-white/70 text-sm italic bg-white/5 p-3 rounded-lg border border-white/10">
                                            "{invitation.message}"
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {new Date(invitation.createdAt).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 ml-6">
                                <button
                                    onClick={() => handleInvitation(invitation._id, 'accept')}
                                    disabled={handlingId !== null}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                                >
                                    {handlingId === invitation._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Chấp nhận</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleInvitation(invitation._id, 'reject')}
                                    disabled={handlingId !== null}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                                >
                                    {handlingId === invitation._id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4" />
                                            <span>Từ chối</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}