import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Mail, ChevronDown } from "lucide-react";

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
                    <div className="space-y-12">

                        {/* Contact Info */}
                        <div className="bg-indigo-50/60 p-10 rounded-3xl border border-indigo-100">
                            <h3 className="text-2xl font-semibold text-indigo-700 mb-8">
                                Contact Information
                            </h3>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-indigo-600" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                            Office
                                        </p>
                                        <p className="text-gray-700 font-medium">
                                            Kudal, Sindhudurg, Maharashtra, IN
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-indigo-600" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                            Email
                                        </p>
                                        <p className="text-gray-700 font-medium">
                                            support@rozkamao.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="max-w-2xl">
                            <h4 className="text-xl font-semibold text-gray-900 mb-6">
                                Frequently Asked Questions
                            </h4>

                            <div className="space-y-5">
                                <details className="group border-b border-gray-200 pb-4">
                                    <summary className="flex items-center justify-between cursor-pointer list-none">
                                        <span className="font-medium text-gray-800 group-open:text-indigo-600">
                                            Is RozKamao free for workers?
                                        </span>
                                        <ChevronDown
                                            className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180"
                                        />
                                    </summary>
                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                        Yes. It is completely free for job seekers to create a profile and apply for jobs.
                                    </p>
                                </details>

                                <details className="group border-b border-gray-200 pb-4">
                                    <summary className="flex items-center justify-between cursor-pointer list-none">
                                        <span className="font-medium text-gray-800 group-open:text-indigo-600">
                                            How does the matching work?
                                        </span>
                                        <ChevronDown
                                            className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180"
                                        />
                                    </summary>
                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                        Our system uses strict matching based on your availability, skills, and nearby location.
                                    </p>
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

            <Footer />
        </div>
    );
};

export default Contact;
