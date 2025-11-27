
import React from 'react';
import { X, Bell, TrendingUp, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

interface NotificationModalProps {
  onClose: () => void;
  onNotificationClick: (stockId?: number) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ onClose, onNotificationClick }) => {
  const { data, markNotificationAsRead } = useStore();
  const { notifications } = data;

  const handleItemClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    if (notification.stockId) {
      onNotificationClick(notification.stockId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="w-full max-w-[430px] h-[80vh] bg-[#121212] rounded-t-[32px] sm:rounded-[32px] pointer-events-auto overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 relative border-t border-white/10 mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Bell size={24} className="text-white" />
            <h2 className="text-2xl font-bold text-white">알림센터</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <X size={24} className="text-zinc-400" />
          </button>
        </header>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {notifications.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-zinc-500 space-y-4">
                <Bell size={48} className="opacity-20" />
                <p>새로운 알림이 없습니다.</p>
             </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-5 rounded-2xl border flex items-start space-x-4 cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group ${item.isRead ? 'bg-transparent border-transparent' : 'bg-white/5 border-white/5'}`}
              >
                {!item.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-app-positive" />
                )}
                
                <div className={`p-3 rounded-xl shrink-0 ${item.type === 'alert' ? 'bg-app-positive/10' : 'bg-blue-500/10'}`}>
                  {item.type === 'alert' ? (
                    <AlertTriangle size={24} className="text-app-positive" />
                  ) : (
                    <TrendingUp size={24} className="text-blue-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 pr-4">
                    <h3 className={`text-base font-bold ${item.isRead ? 'text-zinc-400' : 'text-white'}`}>{item.title}</h3>
                  </div>
                  <p className={`text-sm leading-relaxed mb-2 ${item.isRead ? 'text-zinc-600' : 'text-zinc-300'}`}>{item.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-600">{item.timestamp}</span>
                    {item.stockId && (
                       <span className="text-xs font-bold text-app-accent flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                         확인하기 <ChevronRight size={12} className="ml-1" />
                       </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
