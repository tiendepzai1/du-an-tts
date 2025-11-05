import React from 'react';

interface UserAvatarProps {
    user: {
        _id: string;
        name: string;
        email?: string;
    };
    size?: 'sm' | 'md' | 'lg';
    showTooltip?: boolean;
    className?: string;
}

export default function UserAvatar({
    user,
    size = 'md',
    showTooltip = true,
    className = ''
}: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-sm'
    };

    const avatarClass = `${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm ${className}`;

    return (
        <div
            className={avatarClass}
            title={showTooltip && user?.name ? `${user.name}${user?.email ? ` (${user.email})` : ''}` : undefined}
        >
            <span className="text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
        </div>
    );
}