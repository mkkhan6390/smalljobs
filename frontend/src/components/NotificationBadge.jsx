import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MessageBadge = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const { data } = await api.get('messages/unread_count/');
                setCount(data.count);
            } catch (e) {
                // Silent error
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // if (count === 0) return null;

    return (
        <button
            onClick={() => navigate('/chat')}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            title="Messages"
        >
            {/* Chat SVG */}
            <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h6
                    m-3 8l-4-4H5
                    a3 3 0 01-3-3V7
                    a3 3 0 013-3h14
                    a3 3 0 013 3v6
                    a3 3 0 01-3 3h-6l-4 4z"
                />
            </svg>
            {count > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
            </span>}
        </button>
    );
};

export default MessageBadge;
