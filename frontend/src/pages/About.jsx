import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <header className="pt-32 pb-16 px-4 bg-gray-50/50 border-b border-gray-100 text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-sm font-black text-indigo-600 uppercase tracking-widest leading-none">Our Story</h1>
                    <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Built by and for <br /> local workers.</h2>
                    <p className="text-xl text-gray-500 font-medium pt-4">We believe that every hour counts. We're on a mission to simplify how local work is found and filled.</p>
                </div>
            </header>

            <section className="py-24 px-4 max-w-4xl mx-auto">
                <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-gray-900 leading-tight">The Schedule Gap</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">Most job boards are designed for 9-to-5 roles. But blue-collar work is often dynamic. A builder might need a waiter for just 3 hours on a Friday, or a plumber might have a gap in their Tuesday afternoon.</p>
                            <p className="text-gray-600 leading-relaxed font-medium">Smalljobs was born from the need to bridge this gap with precision scheduling.</p>
                        </div>
                        <div className="bg-indigo-600 aspect-square rounded-[3rem] shadow-xl flex items-center justify-center transform rotate-3">
                            <span className="text-[120px]">🧩</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="bg-emerald-600 aspect-video rounded-[3rem] shadow-xl flex items-center justify-center transform -rotate-2">
                            <span className="text-[100px]">🤝</span>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-gray-900 leading-tight">Trust matters.</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">We don't just match keywords. We match verified skills and verified backgrounds. Our platform build trust through transparency, clear communication, and a robust feedback loop.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-900 rounded-t-[5rem]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-white text-3xl font-bold mb-12">Our Core Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Efficiency', desc: 'No more wasted hours browsing.' },
                            { title: 'Accessibility', desc: 'Work available to everyone, everywhere.' },
                            { title: 'Integrity', desc: 'Honest matching for honest work.' }
                        ].map((v, i) => (
                            <div key={i} className="p-8 border border-white/10 rounded-3xl hover:bg-white/5 transition">
                                <h4 className="text-white text-xl font-bold mb-2">{v.title}</h4>
                                <p className="text-gray-400 font-medium">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-gray-100 text-center bg-white">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Smalljobs © 2026</p>
            </footer>
        </div>
    );
};

export default About;
