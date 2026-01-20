import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MessageBadge from './NotificationBadge';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            RozKamao
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                            About
                        </Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                            Contact
                        </Link>

                        {user ? (
                            <>
                                <MessageBadge />

                                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                    Profile
                                </Link>

                                <Link
                                    to={user.role === 'BUSINESS' ? '/business' : '/seeker'}
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 md:hidden">
                        {user && <MessageBadge />}

                        <button
                            onClick={() => setOpen(!open)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                            aria-label="Open menu"
                        >
                            <svg
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        <Link
                            to="/about"
                            onClick={() => setOpen(false)}
                            className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            About
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Contact
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>

                                <Link
                                    to={user.role === 'BUSINESS' ? '/business' : '/seeker'}
                                    onClick={() => setOpen(false)}
                                    className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="block px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    onClick={() => setOpen(false)}
                                    className="block text-center bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
