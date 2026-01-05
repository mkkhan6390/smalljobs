import { useState } from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', type: 'Inquiry', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, send to API
        console.log('Feedback submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <header className="pt-32 pb-16 px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-sm font-black text-indigo-600 uppercase tracking-widest leading-none">Get in Touch</h1>
                    <h2 className="text-5xl font-bold text-gray-900 tracking-tight">We're here to help.</h2>
                    <p className="text-xl text-gray-500 font-medium pt-4">Have feedback or need assistance? Our team usually responds within 24 hours.</p>
                </div>
            </header>

            <section className="pb-24 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact details */}
                    <div className="space-y-8">
                        <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
                            <h3 className="text-2xl font-bold text-indigo-700 mb-6 font-display">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">📍</div>
                                    <div>
                                        <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Office</p>
                                        <p className="text-gray-600 font-medium">123 Workspace Ave, Tech City, IN</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">✉️</div>
                                    <div>
                                        <p className="font-bold text-gray-900 uppercase text-[10px] tracking-widest">Email</p>
                                        <p className="text-gray-600 font-medium">support@smalljobs.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h4>
                            <div className="space-y-4">
                                <details className="group border-b border-gray-100 pb-4 cursor-pointer">
                                    <summary className="font-bold text-gray-700 list-none flex justify-between items-center group-open:text-indigo-600">
                                        Is Smalljobs free for workers?
                                        <span className="text-xs transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">Yes! It is 100% free for job seekers to create a profile and apply for jobs.</p>
                                </details>
                                <details className="group border-b border-gray-100 pb-4 cursor-pointer">
                                    <summary className="font-bold text-gray-700 list-none flex justify-between items-center group-open:text-indigo-600">
                                        How does the matching work?
                                        <span className="text-xs transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">Our system uses a hard-matching algorithm based on your exact time slots, skills, and location.</p>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-xl shadow-gray-100 relative">
                        {submitted ? (
                            <div className="h-full flex flex-center flex-col text-center justify-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500 font-medium">Thank you for reaching out. We'll be in touch shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-indigo-600 font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                            <input
                                                type="text" required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                            <input
                                                type="email" required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                                        <select
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Feedback</option>
                                            <option>Bug Report</option>
                                            <option>Business Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
                                        <textarea
                                            rows="5" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition font-medium resize-none"
                                            placeholder="Tell us what's on your mind..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition active:scale-95 shadow-indigo-100">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">© 2026 Smalljobs. Always listening.</p>
            </footer>
        </div>
    );
};

export default Contact;
