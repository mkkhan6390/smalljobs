import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tight">smalljobs</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition">About</Link>
                            <Link to="/contact" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition">Contact</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'BUSINESS' ? '/business' : '/seeker'}
                                    className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-200"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
