import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ForgotCredentials = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [mode, setMode] = useState('password'); // 'password' or 'username'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const endpoint = mode === 'password' ? 'auth/forgot-password/' : 'auth/forgot-username/';
            const { data } = await api.post(endpoint, { email });
            setMessage({ type: 'success', text: data.success });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <span className="text-6xl mb-4 block">🔑</span>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Recovery</h1>
                            <p className="text-gray-500 font-medium">Select what you need to recover.</p>
                        </div>

                        <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                            <button
                                onClick={() => setMode('password')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'password' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Password
                            </button>
                            <button
                                onClick={() => setMode('username')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'username' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Username
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {message.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registered Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all placeholder-gray-300"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] ${loading
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-indigo-100'
                                    }`}
                            >
                                {loading ? 'Sending...' : mode === 'password' ? 'Send Reset Link' : 'Retrieve Username'}
                            </button>

                            <p className="text-center text-sm font-bold text-gray-400">
                                Remembered? <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotCredentials;
