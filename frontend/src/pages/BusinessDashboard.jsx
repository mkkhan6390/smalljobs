import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AvailabilitySelector from '../components/AvailabilitySelector';
import ProfileIcon from '../components/ProfileIcon';
import NotificationBadge from '../components/NotificationBadge';
import LocationSelector from '../components/LocationSelector';
import PhoneModal from '../components/PhoneModal';
import Navbar from '../components/Navbar';

const BusinessDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [matches, setMatches] = useState([]);
    const [view, setView] = useState('jobs'); // 'jobs', 'create', 'history'
    const [commonSkills, setCommonSkills] = useState([]);
    const [selectedCommon, setSelectedCommon] = useState([]);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        location: '',
        latitude: null,
        longitude: null,
        address: '',
        required_skills: '',
        pay_per_day: '',
        requirements: { months: [], days: [], time_slots: [] }
    });

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchMatches();
        fetchApplications();
        fetchCommonSkills();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('profile/');
            setProfile(data);
        } catch (e) {
            console.error("Failed to fetch profile");
        }
    };

    const fetchCommonSkills = async () => {
        try {
            const { data } = await api.get('skills/?is_common=true');
            setCommonSkills(data.map(s => s.name));
        } catch (e) {
            console.error("Failed to fetch common skills", e);
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('jobs/');
            setJobs(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMatches = async () => {
        try {
            const { data } = await api.get('matches/');
            setMatches(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('applications/');
            setApplications(data);
        } catch (e) {
            console.error("Failed to fetch applications");
        }
    };

    const [selectedProfile, setSelectedProfile] = useState(null);

    const handleUpdateStatus = async (appId, status) => {
        try {
            await api.patch(`applications/${appId}/`, { status });
            fetchApplications();
            alert(`Application ${status.toLowerCase()}!`);
        } catch (e) {
            alert('Failed to update status');
        }
    };

    const getApplicationsForJob = (jobId) => {
        return applications.filter(a => a.job === jobId);
    };

    const startChat = async (username) => {
        try {
            await api.post('conversations/', { other_user: username });
            navigate('/chat');
        } catch (e) {
            alert('Failed to start chat');
        }
    };

    const getSuggestedCandidates = (jobId) => {
        const jobMatches = matches.filter(m => m.job.id === jobId);
        const applicantIds = applications.filter(a => a.job === jobId).map(a => a.seeker);
        return jobMatches.filter(m => !applicantIds.includes(m.seeker_id));
    };

    const ProfileModal = () => {
        if (!selectedProfile) return null;
        const { user, skills, availability, location, phone_number } = selectedProfile;

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <button
                        onClick={() => setSelectedProfile(null)}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition"
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">👤</div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">{user}</h2>
                            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">📍 {location || "Local Seekers"}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                    <span key={s} className="bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest">{s}</span>
                                ))}
                                {skills.length === 0 && <span className="text-gray-400 text-sm italic">No skills listed</span>}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 text-center border-b pb-2">Full Availability</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="block font-black text-indigo-600 text-[10px] uppercase tracking-wider mb-2">Days</span>
                                    <p className="text-xs font-bold text-gray-700">{availability?.days?.length ? availability.days.join(', ') : 'Flexible'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="block font-black text-indigo-600 text-[10px] uppercase tracking-wider mb-2">Months</span>
                                    <p className="text-xs font-bold text-gray-700">{availability?.months?.length ? availability.months.join(', ') : 'All Year'}</p>
                                </div>
                                {availability?.time_slots?.length > 0 && (
                                    <div className="col-span-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                        <span className="block font-black text-indigo-700 text-[10px] uppercase tracking-wider mb-2 text-center">Working Hours</span>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {availability.time_slots.map((slot, i) => (
                                                <span key={i} className="bg-white px-3 py-1 rounded-lg text-xs font-black shadow-sm text-indigo-600 border border-indigo-100">{slot.start} - {slot.end}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={() => startChat(user)}
                                className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-gray-800 transition active:scale-95"
                            >
                                Send Message
                            </button>
                            {phone_number && (
                                <a
                                    href={`tel:${phone_number}`}
                                    className="px-6 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-emerald-700 transition"
                                >
                                    📞
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const toggleCommonSkill = (skill) => {
        if (selectedCommon.includes(skill)) {
            setSelectedCommon(selectedCommon.filter(s => s !== skill));
        } else {
            setSelectedCommon([...selectedCommon, skill]);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        const otherSkills = newJob.required_skills.split(',').map(s => s.trim()).filter(s => s !== "");
        const allSkills = [...selectedCommon, ...otherSkills];

        try {
            await api.post('jobs/', {
                ...newJob,
                required_skills: allSkills
            });
            alert('Job posted successfully!');
            fetchJobs();
            fetchMatches();
            setView('jobs');
        } catch (e) {
            alert('Failed to post job');
        }
    };

    const handleSavePhone = async (phone) => {
        try {
            await api.patch('auth/user/', { phone_number: phone });
            setIsPhoneModalOpen(false);
            fetchProfile();
        } catch (e) {
            alert('Failed to update phone number');
        }
    };

    const handleStatusChange = async (jobId, isActive) => {
        try {
            await api.patch(`jobs/${jobId}/`, { is_active: isActive });
            fetchJobs();
        } catch (e) {
            alert('Failed to update job status');
        }
    };

    const handleRepost = (job) => {
        const common = job.required_skills.filter(s => commonSkills.includes(s));
        const others = job.required_skills.filter(s => !commonSkills.includes(s));

        // Strip ID and metadata to ensure a clean new post
        const { id, created_at, business, ...repostData } = job;

        setNewJob({
            ...repostData,
            required_skills: others.join(', '),
            requirements: job.requirements || { months: [], days: [], time_slots: [] }
        });
        setSelectedCommon(common);
        setView('create');
    };

    const filteredJobs = jobs.filter(job => view === 'history' ? !job.is_active : job.is_active);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Top Stats/Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">Business Dashboard</h1>
                            <p className="text-gray-500 font-medium">Manage your postings and find the best local talent.</p>
                        </div>
                        <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setView('jobs')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${view === 'jobs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Active Jobs
                            </button>
                            <button
                                onClick={() => setView('history')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Closed Jobs
                            </button>
                            <button
                                onClick={() => setView('create')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${view === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-100'}`}
                            >
                                + Post Job
                            </button>
                        </div>
                    </div>

                    {view === 'create' ? (
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 mb-8 border border-gray-100 animate-in zoom-in-95 duration-300 max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Post a New Opportunity</h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">Specify your requirements to get the best matches.</p>
                                </div>
                                <button onClick={() => setView('jobs')} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition">✕</button>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Core Details</label>
                                            <div className="space-y-4">
                                                <input
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                                                    placeholder="Job Title (e.g. Cafe Waiter)"
                                                    required
                                                    value={newJob.title}
                                                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                                />
                                                <textarea
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-gray-600 resize-none"
                                                    rows="4"
                                                    placeholder="Describe the job and expectations..."
                                                    required
                                                    value={newJob.description}
                                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Daily Pay (₹)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-black text-gray-900"
                                                    placeholder="500"
                                                    required
                                                    value={newJob.pay_per_day}
                                                    onChange={(e) => setNewJob({ ...newJob, pay_per_day: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">City</label>
                                                <input
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-900"
                                                    placeholder="New York"
                                                    required
                                                    value={newJob.location}
                                                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Exact Business Address</label>
                                            <textarea
                                                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-gray-600 resize-none"
                                                rows="3"
                                                placeholder="e.g. Shop No. 5, Silver Square, Mall Road, New York"
                                                value={newJob.address}
                                                onChange={(e) => setNewJob({ ...newJob, address: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Precise Location (Map)</label>
                                            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-2">
                                                <LocationSelector
                                                    initialData={newJob}
                                                    onLocationChange={(loc) => setNewJob({ ...newJob, ...loc })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-50 pt-10">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Required Skills</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {commonSkills.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleCommonSkill(skill)}
                                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedCommon.includes(skill)
                                                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                                            >
                                                {selectedCommon.includes(skill) ? '✓ ' : '+ '}{skill}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-gray-600"
                                        placeholder="Other skills (e.g. French, Coffee Art) separated by commas"
                                        value={newJob.required_skills}
                                        onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                                    />
                                </div>

                                <div className="border-t border-gray-50 pt-10">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Work Schedule & Timing</label>
                                    <AvailabilitySelector
                                        value={newJob.requirements}
                                        onChange={(req) => setNewJob({ ...newJob, requirements: req })}
                                    />
                                </div>

                                <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition active:scale-[0.98] shadow-indigo-100">
                                    Publish Job Posting
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredJobs.length === 0 ? (
                                <div className="col-span-2 bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                                    <span className="text-6xl mb-6 block">{view === 'history' ? '📁' : '📝'}</span>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                        {view === 'history'
                                            ? "No closed jobs found."
                                            : "You haven't posted any active jobs yet."}
                                    </h3>
                                    {view !== 'history' && (
                                        <button onClick={() => setView('create')} className="mt-6 text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline">Start Hiring Now →</button>
                                    )}
                                </div>
                            ) : (
                                filteredJobs.map(job => (
                                    <div key={job.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">{job.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs bg-indigo-50 text-indigo-700 font-black px-2 py-1 rounded-lg">📍 {job.location}</span>
                                                    <span className="text-xs text-emerald-600 font-black italic">₹{job.pay_per_day}/Day</span>
                                                </div>
                                                {job.address && (
                                                    <p className="mt-2 text-[10px] text-gray-500 font-bold bg-gray-50 inline-block px-2 py-1 rounded-lg border border-gray-100 italic">
                                                        🏠 {job.address}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {job.is_active ? (
                                                    <button
                                                        onClick={() => handleStatusChange(job.id, false)}
                                                        className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRepost(job)}
                                                        className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Repost
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Candidates Matched */}
                                            <div className="bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
                                                    Candidates Matched
                                                    <span className="text-indigo-600">{getSuggestedCandidates(job.id).length} Matches</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {getSuggestedCandidates(job.id).map(match => (
                                                        <button
                                                            key={match.id}
                                                            onClick={() => setSelectedProfile(match.seeker_profile)}
                                                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                                                        >
                                                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">👤</div>
                                                            <div className="text-left">
                                                                <p className="text-[10px] font-black text-gray-900 leading-none">{match.seeker_username}</p>
                                                                <p className="text-[9px] text-indigo-600 font-bold">{(match.score * 10).toFixed(0)}% Fit</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {getSuggestedCandidates(job.id).length === 0 && (
                                                        <p className="text-xs text-gray-400 italic">Finding new matches...</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Applications */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Recent Applicants</h4>
                                                <div className="space-y-2">
                                                    {getApplicationsForJob(job.id).map(app => (
                                                        <div key={app.id} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 group hover:border-indigo-100 transition">
                                                            <div className="flex items-center gap-3">
                                                                <button onClick={() => setSelectedProfile(app.seeker_profile)} className="font-black text-sm text-gray-900 hover:text-indigo-600 transition underline decoration-indigo-200 underline-offset-4">{app.seeker_username}</button>
                                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase ${app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                    app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                                                                    }`}>{app.status}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {app.status === 'PENDING' && (
                                                                    <>
                                                                        <button onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold hover:bg-emerald-600 hover:text-white transition shadow-sm shadow-emerald-100">✓</button>
                                                                        <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold hover:bg-red-600 hover:text-white transition shadow-sm shadow-red-100">✕</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {getApplicationsForJob(job.id).length === 0 && (
                                                        <div className="text-center py-6 border-2 border-dashed border-gray-50 rounded-2xl">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">No applicants yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            <ProfileModal />
            <PhoneModal
                isOpen={isPhoneModalOpen}
                onClose={() => setIsPhoneModalOpen(false)}
                onSubmit={handleSavePhone}
            />
        </div>
    );
};

export default BusinessDashboard;
