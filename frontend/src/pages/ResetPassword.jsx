import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.post('auth/reset-password/', {
                uid,
                token,
                new_password: password
            });
            setMessage({ type: 'success', text: data.success });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to reset password. Link may be invalid or expired.'
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
                            <span className="text-6xl mb-4 block">🆕</span>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">New Password</h1>
                            <p className="text-gray-500 font-medium">Create a secure password for your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {message.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? 'Updating...' : 'Set New Password'}
                            </button>

                            <p className="text-center text-sm font-bold text-gray-400">
                                Abort? <Link to="/login" className="text-indigo-600 hover:underline">Return to Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
