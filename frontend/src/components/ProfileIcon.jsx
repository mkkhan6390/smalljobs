import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProfileIcon = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [extendedProfile, setExtendedProfile] = useState(null);

    useEffect(() => {
        if (showModal) {
            fetchExtendedProfile();
        }
    }, [showModal]);

    const fetchExtendedProfile = async () => {
        try {
            const { data } = await api.get('profile/');
            setExtendedProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile details");
        }
    };

    if (!user) return null;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold hover:bg-indigo-700 transition"
            >
                {user.username.charAt(0).toUpperCase()}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                                {user.role === 'SEEKER' ? 'Job Seeker' : 'Business Owner'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                <p className="text-gray-900 font-medium">{user.email || 'No email provided'}</p>
                            </div>

                            {extendedProfile && (
                                <>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                        <p className="text-gray-900 font-medium">{extendedProfile.location || 'Not set'}</p>
                                    </div>

                                    {user.role === 'SEEKER' && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Skills</label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {extendedProfile.skills?.length > 0 ? (
                                                    extendedProfile.skills.map(skill => (
                                                        <span key={skill} className="bg-white px-2 py-1 rounded text-sm text-indigo-600 border border-indigo-100 shadow-sm">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 text-sm">No skills listed</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileIcon;
