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



const SeekerDashboard = () => {
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState({
        skills: [],
        location: '',
        locations: [],
        latitude: null,
        longitude: null,
        availability: { months: [], days: [], time_slots: [] }
    });
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('matches');
    const [skillsInput, setSkillsInput] = useState('');
    const [selectedCommon, setSelectedCommon] = useState([]);
    const [applications, setApplications] = useState([]);
    const [commonSkills, setCommonSkills] = useState([]);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [pendingJobId, setPendingJobId] = useState(null);
    const [allJobs, setAllJobs] = useState([]);
    const [allJobsPage, setAllJobsPage] = useState(1);
    const [hasMoreJobs, setHasMoreJobs] = useState(false);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        skills: '',
        ordering: '-created_at'
    });

    const calculateJobAge = (dateString) => {
        const now = new Date();
        const created = new Date(dateString);
        const diffInSeconds = Math.floor((now - created) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;
        return created.toLocaleDateString();
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
        fetchMatches();
        fetchApplications();
        fetchCommonSkills();
    }, []);

    const fetchAllJobs = async (page = 1, reset = false, currentFilters = filters) => {
        setIsLoadingJobs(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            if (currentFilters.search) params.append('search', currentFilters.search);
            if (currentFilters.skills) params.append('skills', currentFilters.skills);
            if (currentFilters.ordering) params.append('ordering', currentFilters.ordering);

            const { data } = await api.get(`jobs/?${params.toString()}`);
            // DRF returns { count, next, previous, results }
            if (reset) {
                setAllJobs(data.results);
            } else {
                setAllJobs(prev => [...prev, ...data.results]);
            }
            setHasMoreJobs(!!data.next);
            setAllJobsPage(page);
        } catch (e) {
            console.error("Failed to fetch all jobs", e);
        } finally {
            setIsLoadingJobs(false);
        }
    };

    // Debounce search/filter changes
    useEffect(() => {
        if (activeTab === 'all') {
            const timeout = setTimeout(() => {
                fetchAllJobs(1, true);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [filters.search, filters.skills, filters.ordering, activeTab]);

    const fetchCommonSkills = async () => {
        try {
            const { data } = await api.get('skills/?is_common=true');
            const results = data.results || data;
            const names = results.map(s => s.name);
            setCommonSkills(names);
        } catch (e) {
            console.error("Failed to fetch common skills", e);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('profile/');
            setProfile(data);
        } catch (e) {
            console.error("Failed to fetch profile");
        }
    };

    // Synchronize editing states when profile or commonSkills load
    useEffect(() => {
        if (profile.skills.length > 0 && commonSkills.length > 0) {
            const common = profile.skills.filter(s => commonSkills.includes(s));
            const others = profile.skills.filter(s => !commonSkills.includes(s));
            setSelectedCommon(common);
            setSkillsInput(others.join(', '));
        } else if (profile.skills.length === 0 && commonSkills.length > 0) {
            // If new profile, just ensure commonSkills are loaded for selection
            setSkillsInput('');
            setSelectedCommon([]);
        }
    }, [profile.skills, commonSkills]);

    const fetchMatches = async () => {
        try {
            const { data } = await api.get('matches/');
            // Handle paginated or non-paginated response
            const matchList = data.results || data;
            setMatches(matchList);
        } catch (e) {
            console.error("Failed to fetch matches");
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('applications/');
            // Handle paginated or non-paginated response
            const appList = data.results || data;
            setApplications(appList);
        } catch (e) {
            console.error("Failed to fetch applications");
        }
    };

    const toggleCommonSkill = (skill) => {
        if (selectedCommon.includes(skill)) {
            setSelectedCommon(selectedCommon.filter(s => s !== skill));
        } else {
            setSelectedCommon([...selectedCommon, skill]);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const otherSkills = skillsInput.split(',').map(s => s.trim()).filter(s => s !== "");
        const allSkills = [...selectedCommon, ...otherSkills];

        try {
            await api.patch('profile/', {
                ...profile,
                skills: allSkills
            });
            alert('Profile updated!');
            fetchMatches();
        } catch (e) {
            alert('Failed to update profile');
        }
    };

    const handleApply = async (jobId) => {
        try {
            // Check if user has phone number
            const { data: userData } = await api.get('auth/me');
            const { data: profile } = await api.get('profile/');

            if (!profile.phone_number) {
                setPendingJobId(jobId);
                setIsPhoneModalOpen(true);
                return;
            }

            await api.post('applications/', { job: jobId });
            alert('Application submitted!');
            fetchApplications();
        } catch (e) {
            alert('Failed to apply');
        }
    };

    const handlePhoneSubmit = async (phone) => {
        try {
            await api.patch('profile/', { phone_number: phone });
            setIsPhoneModalOpen(false);
            if (pendingJobId) {
                handleApply(pendingJobId);
                setPendingJobId(null);
            }
        } catch (e) {
            alert('Failed to update phone number');
        }
    };

    const getApplicationStatus = (jobId) => {
        const app = applications.find(a => a.job === jobId);
        return app ? app.status : null;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto md:grid md:grid-cols-12 md:gap-8">
                    {/* Left Column: Profile & Settings */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Availability</h2>
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.patch('profile/', { is_available: !profile.is_available });
                                            setProfile({ ...profile, is_available: !profile.is_available });
                                            fetchMatches();
                                        } catch (e) {
                                            alert("Failed to update status");
                                        }
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${profile.is_available ? 'bg-green-500' : 'bg-gray-400'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-3 italic leading-relaxed">
                                {profile.is_available
                                    ? "Businesses can find you for job matches."
                                    : "You are hidden from new matches and history."}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">My Profile</h2>
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">My Location & Service Areas</label>
                                    <LocationSelector
                                        isSeeker={true}
                                        initialData={profile}
                                        onLocationChange={(locData) => setProfile({ ...profile, ...locData })}
                                    />
                                </div>

                                {/* Common Skills Section */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Quick Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {commonSkills.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleCommonSkill(skill)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${selectedCommon.includes(skill)
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {selectedCommon.includes(skill) ? '✓ ' : '+ '}{skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Skills Input */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Add Specialized Skills</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none placeholder:text-gray-400 transition"
                                        value={skillsInput}
                                        onChange={(e) => setSkillsInput(e.target.value)}
                                        placeholder="e.g. Electrician, Plumbing, React"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 italic">Separate other skills with commas.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Availability</label>
                                    <AvailabilitySelector
                                        value={profile.availability}
                                        onChange={(newAvailability) => setProfile({ ...profile, availability: newAvailability })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Min Pay (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm"
                                            value={profile.min_pay || ''}
                                            onChange={(e) => setProfile({ ...profile, min_pay: e.target.value })}
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Max Pay (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm"
                                            value={profile.max_pay || ''}
                                            onChange={(e) => setProfile({ ...profile, max_pay: e.target.value })}
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-[0.98]">
                                    Find Jobs
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-8 mt-8 md:mt-0">
                        {/* Tabs */}
                        <div className="flex gap-4 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
                            <button
                                onClick={() => setActiveTab('matches')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'matches' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Job Matches
                            </button>
                            <button
                                onClick={() => setActiveTab('applied')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'applied' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Applied Jobs
                            </button>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                All Jobs
                            </button>
                        </div>

                        {activeTab === 'matches' && (
                            <div className="space-y-6">
                                {matches.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                                        <span className="text-4xl mb-4 block">🔍</span>
                                        <h3 className="text-xl font-bold text-gray-900">No matches yet.</h3>
                                        <p className="text-gray-500 mt-2">Try updating your location or skills to find more work.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {matches.map(({ id, job, score }) => (
                                            <div key={id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h3 className="text-lg font-black text-gray-900 leading-tight">{job.title}</h3>
                                                            <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                                                                {calculateJobAge(job.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs text-indigo-600 font-black uppercase tracking-widest">{job.business}</span>
                                                            <span className="text-xs text-gray-300">•</span>
                                                            <span className="text-xs text-emerald-600 font-black">₹{job.pay_per_day}/Day</span>
                                                        </div>
                                                    </div>
                                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[10px] font-black shrink-0 border border-indigo-100">
                                                        {(score * 10).toFixed(0)}% MATCH
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2 items-center">
                                                    <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-bold border border-gray-100 uppercase tracking-tight">📍 {job.location}</span>
                                                    {job.address && (
                                                        <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-lg font-bold border border-gray-100 italic">🏠 {job.address}</span>
                                                    )}
                                                    {job.required_skills.map(skill => {
                                                        const isMatched = profile.skills.includes(skill);
                                                        return (
                                                            <span
                                                                key={skill}
                                                                className={`text-[10px] px-2 py-1 rounded-lg font-bold shadow-sm uppercase tracking-tight ${isMatched
                                                                    ? 'bg-emerald-600 text-white border border-emerald-500'
                                                                    : 'bg-indigo-600 text-white'
                                                                    }`}
                                                            >
                                                                {isMatched ? '✓ ' : ''}{skill}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                                {/* Job Requirements Detail */}
                                                <div className="mt-4 grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                                    <div className="space-y-1">
                                                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Schedule</span>
                                                        <p className="text-xs text-gray-700 font-black leading-tight">
                                                            {job.requirements?.days?.length > 0 ? job.requirements.days.join(', ') : 'Any Day'}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold italic">
                                                            {job.requirements?.months?.length > 0 ? job.requirements.months.join(', ') : 'All Year'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Timing</span>
                                                        {job.requirements?.time_slots?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {job.requirements.time_slots.map((slot, i) => (
                                                                    <span key={i} className="bg-white border border-gray-100 text-[10px] px-1.5 py-0.5 rounded-lg shadow-sm text-gray-600 font-black tracking-tight">
                                                                        {slot.start} - {slot.end}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 italic">Open Shift</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">{job.description}</p>

                                                <div className="mt-6">
                                                    {getApplicationStatus(job.id) ? (
                                                        <div className="text-sm text-emerald-600 font-black flex items-center justify-center gap-2 bg-emerald-50 py-3 rounded-2xl border border-emerald-100 uppercase tracking-widest">
                                                            <span className="text-lg">✓</span> Applied
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApply(job.id)}
                                                            className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition font-black uppercase tracking-widest text-xs shadow-lg shadow-gray-200 active:scale-95"
                                                        >
                                                            Quick Apply
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'applied' && (
                            // ... existing applied tab code ...
                            <div className="space-y-4">
                                {applications.length === 0 ? (
                                    <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
                                        <p className="text-gray-500 font-bold">You haven't applied to any jobs yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {applications.map(app => (
                                            <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center group hover:border-indigo-100 transition-colors">
                                                <div>
                                                    <h3 className="font-black text-gray-900">{app.job_details.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{app.job_details.business}</span>
                                                        <span className="text-xs text-gray-200">•</span>
                                                        <span className="text-xs text-indigo-600 font-bold uppercase">₹{app.job_details.pay_per_day}/Day</span>
                                                        {app.job_details.address && (
                                                            <span className="text-[10px] text-gray-400 italic"> • {app.job_details.address}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Status</p>
                                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase border transition-colors ${app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                                                        →
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'all' && (
                            <div className="space-y-6">
                                {/* Filters UI */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">

                                    {/* Search + Sort */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                                        {/* Search */}
                                        <div className="md:col-span-2 relative">
                                            <input
                                                type="text"
                                                placeholder="Search jobs by keywords"
                                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl
                                                text-sm text-gray-900 placeholder-gray-400
                                                focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                value={filters.search}
                                                onChange={(e) =>
                                                    setFilters(prev => ({ ...prev, search: e.target.value }))
                                                }
                                            />

                                            {/* Search Icon */}
                                            <svg
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle cx="11" cy="11" r="7" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                                            </svg>
                                        </div>

                                        {/* Sort */}
                                        <select
                                            className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl
                                            text-sm text-gray-900 cursor-pointer
                                            focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                            value={filters.ordering}
                                            onChange={(e) =>
                                                setFilters(prev => ({ ...prev, ordering: e.target.value }))
                                            }
                                        >
                                            <option value="-created_at">Newest</option>
                                            <option value="created_at">Oldest</option>
                                            <option value="-pay_per_day">Pay ↓</option>
                                            <option value="pay_per_day">Pay ↑</option>
                                        </select>
                                    </div>

                                    {/* Skill Filter */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Skills
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Waiter, Chef"
                                            className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl
                 text-sm text-gray-900 placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                            value={filters.skills}
                                            onChange={(e) =>
                                                setFilters(prev => ({ ...prev, skills: e.target.value }))
                                            }
                                        />
                                    </div>

                                    {/* Clear Filters */}
                                    {(filters.search || filters.skills || filters.ordering !== '-created_at') && (
                                        <div className="pt-3 border-t border-gray-100 flex justify-end">
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        search: '',
                                                        skills: '',
                                                        ordering: '-created_at'
                                                    })
                                                }
                                                className="text-xs font-medium text-red-600 hover:text-red-700 transition"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    )}
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {allJobs.map(job => (
                                        <div key={job.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-lg font-black text-gray-900 leading-tight">{job.title}</h3>
                                                        <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                                                            {calculateJobAge(job.created_at)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs text-indigo-600 font-black uppercase tracking-widest">{job.business}</span>
                                                        <span className="text-xs text-gray-300">•</span>
                                                        <span className="text-xs text-emerald-600 font-black">₹{job.pay_per_day}/Day</span>
                                                    </div>
                                                </div>
                                                {/* <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[10px] font-black shrink-0 border border-indigo-100">
                                                        {(score * 10).toFixed(0)}% MATCH
                                                    </span> */}
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2 items-center">
                                                <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-bold border border-gray-100 uppercase tracking-tight">📍 {job.location}</span>
                                                {job.address && (
                                                    <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-lg font-bold border border-gray-100 italic">🏠 {job.address}</span>
                                                )}
                                                {job.required_skills.map(skill => {
                                                    const isMatched = profile.skills.includes(skill);
                                                    return (
                                                        <span
                                                            key={skill}
                                                            className={`text-[10px] px-2 py-1 rounded-lg font-bold shadow-sm uppercase tracking-tight ${isMatched
                                                                ? 'bg-emerald-600 text-white border border-emerald-500'
                                                                : 'bg-indigo-600 text-white'
                                                                }`}
                                                        >
                                                            {isMatched ? '✓ ' : ''}{skill}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            {/* Job Requirements Detail */}
                                            <div className="mt-4 grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                                <div className="space-y-1">
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Schedule</span>
                                                    <p className="text-xs text-gray-700 font-black leading-tight">
                                                        {job.requirements?.days?.length > 0 ? job.requirements.days.join(', ') : 'Any Day'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold italic">
                                                        {job.requirements?.months?.length > 0 ? job.requirements.months.join(', ') : 'All Year'}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Timing</span>
                                                    {job.requirements?.time_slots?.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {job.requirements.time_slots.map((slot, i) => (
                                                                <span key={i} className="bg-white border border-gray-100 text-[10px] px-1.5 py-0.5 rounded-lg shadow-sm text-gray-600 font-black tracking-tight">
                                                                    {slot.start} - {slot.end}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic">Open Shift</p>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">{job.description}</p>

                                            <div className="mt-6">
                                                {getApplicationStatus(job.id) ? (
                                                    <div className="text-sm text-emerald-600 font-black flex items-center justify-center gap-2 bg-emerald-50 py-3 rounded-2xl border border-emerald-100 uppercase tracking-widest">
                                                        <span className="text-lg">✓</span> Applied
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleApply(job.id)}
                                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition font-black uppercase tracking-widest text-xs shadow-lg shadow-gray-200 active:scale-95"
                                                    >
                                                        Quick Apply
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        // <div key={job.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                                        //     <div className="flex justify-between items-start mb-4">
                                        //         <div>
                                        //             <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">{job.title}</h3>
                                        //             <div className="flex items-center gap-2">
                                        //                 <span className="text-xs text-indigo-600 font-black uppercase tracking-widest">{job.business}</span>
                                        //                 <span className="text-xs text-gray-300">•</span>
                                        //                 <span className="text-xs text-emerald-600 font-black">₹{job.pay_per_day}/Day</span>
                                        //             </div>
                                        //         </div>
                                        //         <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                                        //             {calculateJobAge(job.created_at)}
                                        //         </span>
                                        //     </div>

                                        //     <div className="mt-3 flex flex-wrap gap-2 items-center">
                                        //         <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-bold border border-gray-100 uppercase tracking-tight">📍 {job.location}</span>
                                        //         {job.address && <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-lg font-bold border border-gray-100 italic">🏠 {job.address}</span>}
                                        //     </div>

                                        //     <p className="mt-4 text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{job.description}</p>

                                        //     <div className="mt-6">
                                        //         {getApplicationStatus(job.id) ? (
                                        //             <div className="text-sm text-emerald-600 font-black flex items-center justify-center gap-2 bg-emerald-50 py-3 rounded-2xl border border-emerald-100 uppercase tracking-widest">
                                        //                 ✓ Applied
                                        //             </div>
                                        //         ) : (
                                        //             <button
                                        //                 onClick={() => handleApply(job.id)}
                                        //                 className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition font-black uppercase tracking-widest text-xs shadow-lg shadow-gray-200 active:scale-95"
                                        //             >
                                        //                 Quick Apply
                                        //             </button>
                                        //         )}
                                        //     </div>
                                        // </div>
                                    ))}
                                </div>

                                {allJobs.length === 0 && !isLoadingJobs && (
                                    <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
                                        <p className="text-gray-500 font-bold">No jobs available at the moment.</p>
                                    </div>
                                )}

                                {hasMoreJobs && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={() => fetchAllJobs(allJobsPage + 1)}
                                            disabled={isLoadingJobs}
                                            className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50"
                                        >
                                            {isLoadingJobs ? 'Loading...' : 'Show More Jobs'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <PhoneModal
                isOpen={isPhoneModalOpen}
                onClose={() => setIsPhoneModalOpen(false)}
                onSave={handlePhoneSubmit}
            />
        </div>
    );
};

export default SeekerDashboard;

