import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { Event } from '../../types';

interface EventTicketProps {
    event: Event;
    onClick: () => void;
}

export const EventTicket: React.FC<EventTicketProps> = ({ event, onClick }) => {
    const isActive = event.status === 'Active';

    return (
        <motion.button
            onClick={onClick}
            className={`relative w-full flex items-center justify-between p-4 rounded-xl border transition-all overflow-hidden group
        ${isActive
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Pulse Effect for Active Events */}
            {isActive && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
            )}

            <div className="flex items-center gap-4 z-10">
                {/* Icon Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
          ${isActive ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {isActive ? <AlertCircle size={20} /> : <Calendar size={20} />}
                </div>

                {/* Text Content */}
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
              ${isActive ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {isActive ? 'Action Required' : event.date}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                            {event.type}
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                        {event.title}
                    </h3>
                </div>
            </div>

            {/* Arrow Icon */}
            <div className={`z-10 transition-transform duration-300 group-hover:translate-x-1
        ${isActive ? 'text-red-400' : 'text-blue-400'}`}>
                <ChevronRight size={20} />
            </div>
        </motion.button>
    );
};
