import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProfileIcon from '../components/ProfileIcon';
import SEO from '../components/SEO';

const Chat = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll for new conversations/updates
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation.id);
            const interval = setInterval(() => fetchMessages(activeConversation.id), 3000); // Poll messages
            return () => clearInterval(interval);
        }
    }, [activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('conversations/');
            const results = data.results || data;
            setConversations(results);
        } catch (e) {
            console.error("Failed to fetch conversations");
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const { data } = await api.get(`messages/?conversation=${convId}`);
            const results = data.results || data;
            setMessages(results);
        } catch (e) {
            console.error("Failed to fetch messages");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeConversation) return;

        try {
            await api.post('messages/', {
                conversation: activeConversation.id,
                content: input
            });
            setInput('');
            fetchMessages(activeConversation.id); // Refresh immediately
        } catch (e) {
            console.error("Failed to send message");
        }
    };

    const getOtherParticipant = (conv) => {
        if (!conv || !conv.participants || !user) return "Unknown User";
        return conv.participants.find(p => p !== user.username) || "Unknown User";
    };

    const handleDashboardClick = () => {
        if (user.role === 'BUSINESS') {
            navigate('/business');
        } else {
            navigate('/seeker');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <SEO
                title="Chat"
                description="Connect with businesses and job seekers in real-time. Communicate safely and efficiently on SmartJobs."
            />
            {/* Navbar */}
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center z-10 relative">
                <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={handleDashboardClick}>
                    SmartJobs <span className="text-sm font-normal text-gray-500">Chat</span>
                </h1>
                <div className="flex gap-4 items-center">
                    <button onClick={handleDashboardClick} className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</button>
                    <ProfileIcon />
                    <button onClick={logout} className="text-gray-600 hover:text-red-500 font-medium ml-2">Logout</button>
                </div>
            </nav>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConversation(conv)}
                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${activeConversation?.id === conv.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <h3 className="font-semibold text-gray-900">{getOtherParticipant(conv)}</h3>
                                <p className="text-sm text-gray-500 truncate">{conv.last_message?.content || "No messages yet"}</p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No conversations yet.</div>
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {activeConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 bg-white border-b shadow-sm flex items-center">
                                <h2 className="font-bold text-lg text-gray-800">{getOtherParticipant(activeConversation)}</h2>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map(msg => {
                                    const isMe = msg.sender === user.username;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-indigo-700 transition"
                                    >
                                        ➤
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-xl font-medium">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
