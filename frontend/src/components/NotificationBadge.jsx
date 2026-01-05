import { useState, useEffect } from 'react';
import api from '../api/axios';

const NotificationBadge = () => {
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

    if (count === 0) return null;

    return (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1 animate-pulse">
            {count}
        </span>
    );
};

export default NotificationBadge;
