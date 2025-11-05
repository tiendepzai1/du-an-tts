import { useState, useEffect } from 'react';
import { X, Search, Send, Users } from 'lucide-react';
import axios from 'axios';

interface InviteModalProps {
    boardId: string;
    boardName: string;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function InviteModal({ boardId, boardName, onClose, onSuccess, onError }: InviteModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const searchUsers = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No authentication token found');
                    onError('Authentication failed. Please log in again.');
                    return;
                }

                console.log('Searching with query:', searchQuery.trim());
                const response = await axios.get(`http://localhost:3000/user/search`, {
                    params: {
                        search: searchQuery.trim(),
                        searchBy: 'email'
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Search response:', response.data);
                if (response.data && Array.isArray(response.data.data)) {
                    setSearchResults(response.data.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleInvite = async () => {
        // Kiểm tra token và dữ liệu cần thiết trước khi gửi
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Lỗi: Không tìm thấy token xác thực.');
            onError('Authentication failed. Please log in again.');
            return;
        }

        // Kiểm tra tính hợp lệ của người dùng được chọn và boardId
        if (!selectedUser || !selectedUser.email || !boardId) {
            console.error('Lỗi: Dữ liệu lời mời bị thiếu (Email hoặc Board ID).');
            onError('Please select a user and ensure the board is loaded correctly.');
            return;
        }

        setIsSending(true);
        try {
            const API_URL = 'http://localhost:3000/invitation/send';

            // ĐÃ SỬA LỖI 400: Thay thế userId bằng email để khớp với validation của backend.
            await axios.post(API_URL, {
                boardId,
                email: selectedUser.email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Sử dụng tên người dùng hoặc email để hiển thị thông báo thành công
            const recipientDisplay = selectedUser.name || selectedUser.email || 'user';
            onSuccess(`Invitation sent to ${recipientDisplay}`);

            onClose();
        } catch (error: any) {
            console.error('Error sending invitation:', error);

            // Xử lý lỗi 400 cụ thể hơn
            let errorMessage = 'Failed to send invitation. Please try again.';
            if (error.response) {
                // Sử dụng thông báo lỗi cụ thể từ backend
                errorMessage = error.response.data?.message || `Error ${error.response.status}: Invalid request data.`;

                // Log response body để debug dễ hơn
                console.log('Backend response data (400):', error.response.data);
            }

            onError(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-60">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-lg border border-white/20 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 relative z-50 mx-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Invite to Board</h2>
                            <p className="text-white/70 text-sm">{boardName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-white/40" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && searchQuery.length >= 2) {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Search users by email..."
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            autoFocus
                        />
                    </div>

                    {/* Search Results */}
                    <div className="space-y-2 mb-6 max-h-[280px] overflow-y-auto custom-scrollbar relative">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin w-8 h-8 border-3 border-white/20 border-t-white rounded-full" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(user => (
                                <button
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${selectedUser?._id === user._id
                                        ? 'bg-blue-500/20 border-blue-500/40'
                                        : 'hover:bg-white/10 border-white/10'
                                        } border backdrop-blur-sm`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">
                                                {user.name ? user.name[0].toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-medium">{user.name || 'Unknown User'}</p>
                                            <p className="text-white/60 text-sm">{user.email || 'No email'}</p>
                                        </div>
                                    </div>
                                    {selectedUser?._id === user._id && (
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : searchQuery.length > 0 ? (
                            // Thông báo Không tìm thấy kết quả
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-white/40" />
                                </div>
                                <p className="text-white/60 font-medium">No users found</p>
                                <p className="text-white/40 text-sm mt-1">Try a different search term</p>
                            </div>
                        ) : (
                            // Thông báo mặc định khi chưa nhập gì
                            <div className="text-center py-8 absolute inset-0 flex flex-col justify-center pointer-events-none">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-white/40" />
                                </div>
                                <p className="text-white/60 font-medium">Search for users</p>
                                <p className="text-white/40 text-sm mt-1">Type at least 2 characters to search</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInvite}
                            disabled={!selectedUser || isSending}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 ${selectedUser
                                ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                                } transition-all`}
                        >
                            {isSending ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Invite</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}