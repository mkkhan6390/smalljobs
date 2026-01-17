import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'SEEKER'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.email
                ? "Email already registered."
                : err.response?.data?.username
                    ? "Username already taken."
                    : "Registration failed. Please check your details.";
            setError(errorMsg);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-emerald-500 via-teal-500 to-cyan-500">
                <Navbar />
                <div className="mt-16 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Join RozKamao</h2>
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-center mb-6 animate-in fade-in slide-in-from-top-2">
                            <span className="font-bold">⚠️ {error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'SEEKER' })}
                                    className={`py-2 rounded-lg font-semibold transition ${formData.role === 'SEEKER' ? 'bg-white text-teal-600' : 'bg-white/20 text-white'}`}
                                >
                                    Job Seeker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'BUSINESS' })}
                                    className={`py-2 rounded-lg font-semibold transition ${formData.role === 'BUSINESS' ? 'bg-white text-teal-600' : 'bg-white/20 text-white'}`}
                                >
                                    Business
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-teal-50 mt-1 flex justify-between items-center px-1">
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-teal-100/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold"
                                placeholder="choose_a_username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-teal-50 mt-1 flex justify-between items-center px-1">
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-teal-100/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="Create a password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-white text-teal-600 font-bold hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg mt-4"
                        >
                            Create Account
                        </button>
                    </form>
                    <p className="mt-6 text-center text-white text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
