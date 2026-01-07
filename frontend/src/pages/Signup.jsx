import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Username might be taken.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-emerald-500 via-teal-500 to-cyan-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Join SmallJobs</h2>
                {error && <p className="text-red-300 text-center mb-4">{error}</p>}
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
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Choose a username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="For notifications"
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
    );
};

export default Signup;
