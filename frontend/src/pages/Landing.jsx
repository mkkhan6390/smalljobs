import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import hero_job_platform from '../assets/smalljobshero.png';
import { Clock, MapPin, ShieldCheck } from "lucide-react";
import Footer from '../components/Footer'

const features = [
    {
        title: "Smart Scheduling",
        desc: "Our algorithm ensures you only see jobs that fit within your time slots,.",
        icon: Clock,
        color: "bg-orange-50 text-orange-600"
    },
    {
        title: "Local Focus",
        desc: "Find work in your own neighborhood with precise location matching.",
        icon: MapPin,
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        title: "Verified Skills",
        desc: "Built-in skill verification helps builders and seekers connect with confidence.",
        icon: ShieldCheck,
        color: "bg-indigo-50 text-indigo-600"
    }
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 animate-bounce">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Coming Next: AI-Powered Matching</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-tight">
                            Earn More <br />
                            <span className="text-indigo-600">With Jobs that Match your time.</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                            Connect with verified blue-collar opportunities that fit your exact schedule and location. No more confusion and No more clicking through hundreds of irrelevant posts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/signup" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-center hover:bg-gray-800 transition shadow-xl shadow-gray-200">
                                Get Started for Free
                            </Link>
                            <Link to="/about" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-center hover:border-indigo-200 hover:text-indigo-600 transition">
                                How it Works
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${(i + 1) * 100}`}></div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 font-bold">Helping MSME Businesses Find the right People</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
                        <img
                            src={hero_job_platform}
                            alt="RozKamao Platform Illustration"
                            className="w-full h-auto drop-shadow-2xl rounded-2xl"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400/indigo/white?text=RozKamamo+Hero'; }}
                        />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Why RozKamao?</h2>
                        <h3 className="text-4xl font-bold text-gray-900">Better Matching, Better Hiring.</h3>
                        <p className="text-gray-500 font-medium">We've built the world's most intelligent scheduling engine for local work.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feat, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-6`}>
                                    <feat.icon className="w-6 h-6" strokeWidth={1.75} />
                                </div>

                                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feat.title}
                                </h4>

                                <p className="text-gray-600 leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                                Ready to find your <br /> next opportunity?
                            </h2>
                            <p className="text-indigo-100 text-lg font-medium opacity-90 pt-4">
                                Join thousands of workers and businesses today. No hidden fees.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                                <Link to="/signup" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black shadow-lg hover:bg-indigo-50 transition active:scale-95">
                                    Sign Up Now
                                </Link>
                                <Link to="/contact" className="px-10 py-5 bg-indigo-700 text-white rounded-2xl font-black border border-indigo-400 hover:bg-indigo-800 transition active:scale-95">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
