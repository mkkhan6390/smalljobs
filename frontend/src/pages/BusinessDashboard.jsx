import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AvailabilitySelector from '../components/AvailabilitySelector';
import ProfileIcon from '../components/ProfileIcon';
import MessageBadge from '../components/NotificationBadge';
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
    const [editingJobId, setEditingJobId] = useState(null);

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
            const results = data.results || data;
            setCommonSkills(results.map(s => s.name));
        } catch (e) {
            console.error("Failed to fetch common skills", e);
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('jobs/');
            const results = data.results || data;
            setJobs(results);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMatches = async () => {
        try {
            const { data } = await api.get('matches/');
            const results = data.results || data;
            setMatches(results);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('applications/');
            const results = data.results || data;
            setApplications(results);
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

    const clearForm = () => {
        setNewJob({
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
        setSelectedCommon([]);
        setEditingJobId(null);
    };

    const getSuggestedCandidates = (jobId) => {
        const jobMatches = matches.filter(m => m.job.id === jobId);
        const applicantIds = applications.filter(a => a.job === jobId).map(a => a.seeker);
        return jobMatches.filter(m => !applicantIds.includes(m.seeker_id));
    };

    const ProfileModal = () => {
        if (!selectedProfile) return null;

        const { user, skills, availability, location, phone_number } = selectedProfile;
        const username = user.split(' ')[0];
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
                <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-xl p-6 relative animate-in zoom-in-95 duration-200">

                    {/* Close */}
                    <button
                        onClick={() => setSelectedProfile(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800 transition"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-semibold">
                            {user[0]?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-gray-900 truncate">
                                {user}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {location || 'Local Seeker'}
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Skills
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                                skills.map(s => (
                                    <span
                                        key={s}
                                        className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700"
                                    >
                                        {s}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-400 italic">
                                    No skills listed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Availability
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase mb-1">
                                    Days
                                </p>
                                <p className="text-sm text-gray-700 font-medium">
                                    {availability?.days?.length
                                        ? availability.days.join(', ')
                                        : 'Flexible'}
                                </p>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase mb-1">
                                    Months
                                </p>
                                <p className="text-sm text-gray-700 font-medium">
                                    {availability?.months?.length
                                        ? availability.months.join(', ')
                                        : 'All year'}
                                </p>
                            </div>

                            {availability?.time_slots?.length > 0 && (
                                <div className="col-span-2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                                    <p className="text-[10px] text-indigo-600 uppercase mb-2">
                                        Working Hours
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {availability.time_slots.map((slot, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-lg bg-white border border-indigo-100 text-xs font-medium text-indigo-700"
                                            >
                                                {slot.start} – {slot.end}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => startChat(username)}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                        >
                            Send Message
                        </button>

                        {phone_number && (
                            <a
                                href={`tel:${phone_number}`}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                title="Call"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 6.75c0 7.59 6.16 13.75 13.75 13.75
           .86 0 1.71-.12 2.52-.35a1.5 1.5 0 001.06-1.43v-3.02
           a1.5 1.5 0 00-1.28-1.48l-3.28-.55a1.5 1.5 0 00-1.38.6l-1.36 1.67
           a11.05 11.05 0 01-5.02-5.02l1.67-1.36a1.5 1.5 0 00.6-1.38l-.55-3.28
           A1.5 1.5 0 006.25 2.25H3.78a1.5 1.5 0 00-1.53 1.5z"
                                    />
                                </svg>
                            </a>
                        )}

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
            if (editingJobId) {
                await api.patch(`jobs/${editingJobId}/`, {
                    ...newJob,
                    required_skills: allSkills
                });
                alert('Job updated successfully!');
            } else {
                await api.post('jobs/', {
                    ...newJob,
                    required_skills: allSkills
                });
                alert('Job posted successfully!');
            }
            fetchJobs();
            fetchMatches();
            setView('jobs');
            clearForm();
        } catch (e) {
            alert(editingJobId ? 'Failed to update job' : 'Failed to post job');
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
            is_active: true,
            required_skills: others.join(', '),
            requirements: job.requirements || { months: [], days: [], time_slots: [] }
        });
        setSelectedCommon(common);
        setEditingJobId(null);
        setView('create');
    };

    const handleEdit = (job) => {
        const common = job.required_skills.filter(s => commonSkills.includes(s));
        const others = job.required_skills.filter(s => !commonSkills.includes(s));

        setNewJob({
            ...job,
            required_skills: others.join(', '),
            requirements: job.requirements || { months: [], days: [], time_slots: [] }
        });
        setSelectedCommon(common);
        setEditingJobId(job.id);
        setView('create');
    };

    const filteredJobs = jobs.filter(job => view === 'history' ? !job.is_active : job.is_active);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                Business Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage jobs, review applicants, and hire faster.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                clearForm();
                                setView('create');
                            }}
                            className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
                        >
                            + Post Job
                        </button>
                    </div>

                    {/* Tabs */}
                    {view !== 'create' && (
                        <div className="inline-flex bg-gray-100 p-1 rounded-xl mb-8">
                            {['jobs', 'history'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setView(tab)}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition ${view === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {tab === 'jobs' ? 'Active Jobs' : 'Closed Jobs'}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* CREATE JOB */}
                    {view === 'create' ? (
                        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10">

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {editingJobId ? 'Edit Job Posting' : 'Post a New Job'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {editingJobId ? 'Update details to keep your posting accurate' : 'Fill details to attract the right candidates'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setView('jobs');
                                        clearForm();
                                    }}
                                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateJob} className="space-y-10">

                                {/* Job Details */}
                                <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Job details
                                    </h3>

                                    <div className="space-y-3">
                                        <input
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                       placeholder-gray-400 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/20 outline-none transition"
                                            placeholder="Job title (e.g. Café Waiter)"
                                            required
                                            value={newJob.title}
                                            onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                        />

                                        <textarea
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                       placeholder-gray-400 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/20 outline-none transition resize-none"
                                            rows={3}
                                            placeholder="Briefly describe responsibilities and expectations"
                                            required
                                            value={newJob.description}
                                            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                        />
                                    </div>
                                </section>


                                {/* Pay & Location */}
                                <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Compensation & location
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                       placeholder-gray-400 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/20 outline-none transition"
                                            placeholder="Daily pay (₹)"
                                            required
                                            value={newJob.pay_per_day}
                                            onChange={e =>
                                                setNewJob({ ...newJob, pay_per_day: e.target.value })
                                            }
                                        />

                                        <input
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                       placeholder-gray-400 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/20 outline-none transition"
                                            placeholder="City"
                                            required
                                            value={newJob.location}
                                            onChange={e =>
                                                setNewJob({ ...newJob, location: e.target.value })
                                            }
                                        />
                                    </div>
                                </section>

                                {/* Address & Map */}
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <textarea
                                        className="input resize-none"
                                        rows="3"
                                        placeholder="Full business address"
                                        required
                                        value={newJob.address}
                                        onChange={e => setNewJob({ ...newJob, address: e.target.value })}
                                    />

                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-2">
                                        <LocationSelector
                                            initialData={newJob}
                                            onLocationChange={loc => setNewJob({ ...newJob, ...loc })}
                                        />
                                    </div>
                                </section>

                                {/* Skills */}
                                <section>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                        Required Skills
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {commonSkills.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleCommonSkill(skill)}
                                                className={`px-4 py-2 rounded-lg text-xs font-medium transition
                    ${selectedCommon.includes(skill)
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>

                                    <input
                                        className="input"
                                        placeholder="Other skills (comma separated)"
                                        value={newJob.required_skills}
                                        onChange={e => setNewJob({ ...newJob, required_skills: e.target.value })}
                                    />
                                </section>

                                {/* Schedule */}
                                <section>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                        Work Schedule
                                    </h3>

                                    <AvailabilitySelector
                                        value={newJob.requirements}
                                        onChange={req => setNewJob({ ...newJob, requirements: req })}
                                    />
                                </section>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold tracking-wide hover:bg-gray-800 transition"
                                >
                                    {editingJobId ? 'Update Posting' : 'Publish Job'}
                                </button>
                            </form>
                        </div>

                    ) : (

                        /* JOB LIST */
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredJobs.length === 0 ? (
                                <div className="col-span-2 bg-white rounded-3xl p-16 text-center border border-dashed">
                                    <p className="text-gray-500">
                                        No jobs available in this view.
                                    </p>
                                </div>
                            ) : (
                                filteredJobs.map(job => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {job.title}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm">
                                                    <span className="flex items-center gap-1.5 text-gray-500">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                d="M12 21s7-4.35 7-10A7 7 0 105 11c0 5.65 7 10 7 10z" />
                                                            <circle cx="12" cy="11" r="2.5" />
                                                        </svg>
                                                        {job.location}
                                                    </span>

                                                    <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                d="M8 6h8M8 10h8m-8 4h8m-6 4h6" />
                                                        </svg>
                                                        {job.pay_per_day}/day
                                                    </span>
                                                </div>

                                                {job.address && (
                                                    <p className="mt-1 text-xs text-gray-400 truncate flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                d="M3 21h18M6 21V7a2 2 0 012-2h8a2 2 0 012 2v14" />
                                                        </svg>
                                                        {job.address}
                                                    </p>
                                                )}

                                            </div>

                                            <div className="shrink-0 flex items-center gap-2">
                                                {job.is_active ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(job)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(job.id, false)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleRepost(job)}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                        >
                                                            Repost
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {job.description}
                                            </p>
                                        </div>

                                        {/* Skills & Schedule */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Skills Required</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.required_skills.map(skill => (
                                                        <span key={skill} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-600">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Schedule</h4>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-indigo-400" />
                                                        {job.requirements?.days?.length ? job.requirements.days.join(', ') : 'Flexible Days'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-teal-400" />
                                                        {job.requirements?.months?.length ? job.requirements.months.join(', ') : 'All Months'}
                                                    </p>
                                                    {job.requirements?.time_slots?.map((slot, i) => (
                                                        <p key={i} className="text-[10px] text-gray-600 flex items-center gap-1.5">
                                                            <span className="w-1 h-1 rounded-full bg-amber-400" />
                                                            {slot.start} - {slot.end}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Candidates */}
                                        <div className="mt-5 border-t pt-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase">
                                                    Matched Candidates
                                                </h4>
                                                <span className="text-xs text-indigo-600 font-medium">
                                                    {getSuggestedCandidates(job.id).length} matches
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {getSuggestedCandidates(job.id).map(match => (
                                                    <button
                                                        key={match.id}
                                                        onClick={() => setSelectedProfile(match.seeker_profile)}
                                                        className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition"
                                                    >
                                                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                                                            {match.seeker_username[0].toUpperCase()}
                                                        </div>
                                                        <div className="text-left leading-tight">
                                                            <p className="text-xs font-medium text-gray-900">
                                                                {match.seeker_username}
                                                            </p>
                                                            <p className="text-[10px] text-indigo-600">
                                                                {(match.score * 10).toFixed(0)}% fit
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}

                                                {getSuggestedCandidates(job.id).length === 0 && (
                                                    <p className="text-xs text-gray-400 italic">
                                                        Finding new matches…
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Applications */}
                                        <div className="mt-5 border-t pt-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                                Recent Applicants
                                            </h4>

                                            <div className="space-y-2">
                                                {getApplicationsForJob(job.id).map(app => (
                                                    <div
                                                        key={app.id}
                                                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <button
                                                                onClick={() => setSelectedProfile(app.seeker_profile)}
                                                                className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate"
                                                            >
                                                                {app.seeker_username}
                                                            </button>

                                                            <span
                                                                className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase
                  ${app.status === 'ACCEPTED' && 'bg-emerald-100 text-emerald-700'}
                  ${app.status === 'REJECTED' && 'bg-red-100 text-red-700'}
                  ${app.status === 'APPLIED' && 'bg-gray-200 text-gray-600'}
                `}
                                                            >
                                                                {app.status}
                                                            </span>
                                                        </div>

                                                        {app.status === 'APPLIED' && (
                                                            <div className="flex gap-1.5">
                                                                <button
                                                                    onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                                                    className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                                                                >
                                                                    ✓
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                                    className="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {getApplicationsForJob(job.id).length === 0 && (
                                                    <div className="text-center py-4 border border-dashed rounded-xl">
                                                        <p className="text-xs text-gray-400 italic">
                                                            No applicants yet
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))

                            )}
                        </div>
                    )}

                </div>
            </main>


            {/* <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Top Stats/Actions
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
                                            {/* Candidates Matched 
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

                                            {/* Applications
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
            </main> */}

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
