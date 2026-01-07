import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        bio: '',
        location: '',
        phone_number: '',
        full_name: '' // Note: full_name might need to be handled via auth/user/ if it's on the User model
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('profile/');
            setProfile(prev => ({ ...prev, ...data }));

            // Also fetch user details for full name if needed
            const { data: userData } = await api.get('auth/user/');
            setProfile(prev => ({
                ...prev,
                full_name: userData.first_name + (userData.last_name ? ' ' + userData.last_name : '')
            }));

            setLoading(false);
        } catch (e) {
            console.error("Failed to fetch profile", e);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update profile info
            await api.patch('profile/', {
                bio: profile.bio,
                location: profile.location,
                phone_number: profile.phone_number
            });

            // Update user info (first name / last name)
            const names = profile.full_name.split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ');

            await api.patch('auth/user/', {
                first_name: firstName,
                last_name: lastName
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-indigo-600 px-8 py-12 text-white relative">
                            <div className="relative z-10">
                                <h1 className="text-4xl font-black mb-2">Profile Settings</h1>
                                <p className="text-indigo-100 font-medium">Customize how others see you on the platform.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="text-9xl">👤</span>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="p-8 sm:p-12 space-y-8">
                            {message.text && (
                                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                                        placeholder="John Doe"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                                        placeholder="+1 234 567 890"
                                        value={profile.phone_number}
                                        onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Location (City)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                                    placeholder="New York, NY"
                                    value={profile.location}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Bio / Description</label>
                                <textarea
                                    rows="5"
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-gray-700 transition-all resize-none"
                                    placeholder="Tell us about yourself, your experience, or your business..."
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 font-medium italic ml-1">This will be visible when users view your profile.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] ${saving
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-indigo-100'
                                        }`}
                                >
                                    {saving ? 'Saving...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
