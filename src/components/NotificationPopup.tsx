import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPopupProps {
    notification: Notification;
    onClose: () => void;
    onClick: (notification: Notification) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, onClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleClick = () => {
        setIsVisible(false);
        setTimeout(() => onClick(notification), 300);
    };

    return (
        <div
            className={`absolute top-4 left-4 right-4 z-[150] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
        >
            <div
                onClick={handleClick}
                className="bg-[#1E1E1E]/95 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
            >
                {/* Accent Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />

                {/* Icon */}
                <div className={`p-2.5 rounded-full shrink-0 ${notification.type === 'alert' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-blue-500/10 text-blue-500'}`}>
                    {notification.type === 'alert' ? <AlertTriangle size={20} /> : <TrendingUp size={20} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">New Update</span>
                        <span className="text-[10px] text-zinc-600">{notification.timestamp}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                        {notification.desc}
                    </h3>
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default NotificationPopup;
