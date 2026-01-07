import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                {error && <p className="text-red-300 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-white">Password</label>
                            <Link to="/forgot-credentials" title="Recover your username or password" className="text-[10px] font-black uppercase text-white/60 hover:text-white transition group flex items-center gap-1">
                                <span>Forgot Creds?</span>
                                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-white text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
