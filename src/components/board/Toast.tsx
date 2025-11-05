import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
                className={`rounded-xl px-4 py-3 shadow-lg flex items-center space-x-3 border ${type === 'success'
                        ? 'bg-green-500/20 border-green-500/40 text-green-400'
                        : 'bg-red-500/20 border-red-500/40 text-red-400'
                    }`}
            >
                <p className="text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}