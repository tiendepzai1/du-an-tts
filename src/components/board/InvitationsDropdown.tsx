import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Bell, UserPlus, Check, X, Loader2 } from 'lucide-react';

interface InvitationsDropdownProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

interface Invitation {
    _id: string;
    boardId: {
        _id: string;
        broadName: string;
    };
    senderId: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

export default function InvitationsDropdown({ onSuccess, onError }: InvitationsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true); // Đặt mặc định là true
    const [isHandling, setIsHandling] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sử dụng useCallback để ổn định hàm fetch
    const fetchInvitations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/invitation/received', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const fetchedInvitations: Invitation[] = response.data.data || [];

            const pendingInvitations = fetchedInvitations.filter(inv => inv.status === 'pending');

            const sortedInvitations = pendingInvitations.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setInvitations(sortedInvitations);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 1. Logic tải lại lời mời khi mở dropdown
    useEffect(() => {
        // Luôn fetch lần đầu để hiển thị badge
        fetchInvitations();
    }, [fetchInvitations]);

    useEffect(() => {
        if (isOpen) {
            // Khi mở, force fetch lại để có dữ liệu mới nhất
            fetchInvitations();
        }
    }, [isOpen, fetchInvitations]);

    // 2. Logic đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    const handleInvitation = async (invitationId: string, action: 'accept' | 'reject') => {
        // ✅ LOG THÔNG BÁO NGAY LẬP TỨC KHI SỰ KIỆN ĐƯỢC KÍCH HOẠT
        console.log(`[CLICK] Kích hoạt hành động: ${action} cho ID: ${invitationId}`);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Lỗi Token: Không tìm thấy token xác thực.');
            onError('Authentication failed. Please log in again.');
            return;
        }

        setIsHandling(invitationId); // Đánh dấu lời mời này đang được xử lý

        try {
            const endpoint = action === 'accept' ? 'accept' : 'reject';

            console.log(`[REQUEST] Đang gửi PUT /invitation/${invitationId}/${endpoint}`);

            await axios.put(`http://localhost:3000/invitation/${invitationId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log(`[SUCCESS] Request ${action} thành công!`);

            const successMessage = action === 'accept'
                ? 'Đã chấp nhận lời mời! Board sẽ sớm xuất hiện trên Dashboard của bạn.'
                : 'Đã từ chối lời mời.';

            onSuccess(successMessage);

            // Cập nhật UI local ngay lập tức (xóa lời mời đã xử lý)
            setInvitations(prev => prev.filter(inv => inv._id !== invitationId));

        } catch (error: any) {
            // ✅ LOG CHI TIẾT LỖI
            const errorMessage = error.response?.data?.message || `Lỗi không xác định khi ${action} lời mời.`;
            console.error(`[ERROR] Lỗi xử lý ${action} lời mời:`, error.response?.data || error);

            onError(errorMessage);
        } finally {
            setIsHandling(null); // Luôn luôn reset trạng thái xử lý
        }
    };

    const pendingInvitations = invitations;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 hover:bg-white/10 rounded-xl transition-colors"
                title="Lời mời"
            >
                <Bell className="w-5 h-5 text-white/70 hover:text-white" />
                {pendingInvitations.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-md">
                        {pendingInvitations.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50 transform translate-y-2 animate-in fade-in-0 zoom-in-95 duration-300 origin-top-right">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <UserPlus className="w-5 h-5 text-indigo-400" />
                            <span>Board Invitations</span>
                        </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {loading && pendingInvitations.length === 0 ? (
                            <div className="p-4 text-center">
                                <Loader2 className="animate-spin w-6 h-6 text-white/50 mx-auto" />
                                <p className="text-white/60 text-sm mt-2">Đang tải...</p>
                            </div>
                        ) : pendingInvitations.length > 0 ? (
                            pendingInvitations.map(invitation => (
                                <div key={invitation._id} className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                                    <p className="text-white font-medium mb-1 text-sm">
                                        <span className="font-bold text-indigo-300">{invitation.senderId.name || invitation.senderId.email}</span> mời bạn tham gia board
                                    </p>
                                    <p className="text-white/60 text-base mb-3 font-semibold">
                                        "{invitation.boardId.broadName}"
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInvitation(invitation._id, 'accept')}
                                            disabled={isHandling !== null}
                                            className="flex-1 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isHandling === invitation._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Chấp nhận</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleInvitation(invitation._id, 'reject')}
                                            disabled={isHandling !== null}
                                            className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isHandling === invitation._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <X className="w-4 h-4" />
                                                    <span>Từ chối</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <Bell className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                <p className="text-white/60 font-medium">Không có lời mời nào đang chờ</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
