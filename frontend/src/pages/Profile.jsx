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
        full_name: ''
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

            const { data: userData } = await api.get('auth/me/');
            setProfile(prev => ({
                ...prev,
                full_name:
                    userData.first_name +
                    (userData.last_name ? ` ${userData.last_name}` : '')
            }));
        } catch (e) {
            console.error('Failed to fetch profile', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.patch('profile/', {
                bio: profile.bio,
                location: profile.location,
                phone_number: profile.phone_number
            });

            const names = profile.full_name.split(' ');
            await api.patch('auth/me/', {
                first_name: names[0],
                last_name: names.slice(1).join(' ')
            });

            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Profile Settings
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Update your personal information and visibility details.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">

                            {/* Alert */}
                            {message.text && (
                                <div
                                    className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2
                  ${message.type === 'success'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            {/* Basic Info */}
                            <section>
                                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        className="input"
                                        placeholder="Full name"
                                        value={profile.full_name}
                                        onChange={e =>
                                            setProfile({ ...profile, full_name: e.target.value })
                                        }
                                    />

                                    <input
                                        className="input"
                                        placeholder="Phone number"
                                        value={profile.phone_number}
                                        onChange={e =>
                                            setProfile({ ...profile, phone_number: e.target.value })
                                        }
                                    />
                                </div>
                            </section>

                            {/* Location */}
                            <section>
                                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                                    Location
                                </h2>

                                <input
                                    className="input"
                                    placeholder="City, State"
                                    value={profile.location}
                                    onChange={e =>
                                        setProfile({ ...profile, location: e.target.value })
                                    }
                                />
                            </section>

                            {/* Bio */}
                            <section>
                                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                                    About
                                </h2>

                                <textarea
                                    rows="4"
                                    className="input resize-none"
                                    placeholder="Brief description about you or your work"
                                    value={profile.bio || ''}
                                    onChange={e =>
                                        setProfile({ ...profile, bio: e.target.value })
                                    }
                                />

                                <p className="text-xs text-gray-400 mt-1">
                                    Visible to users viewing your profile.
                                </p>
                            </section>

                            {/* Save */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`w-full rounded-xl py-3 text-sm font-semibold transition
                    ${saving
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {saving ? 'Saving…' : 'Save Changes'}
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
