import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="About Us"
                description="Learn about SmartJobs' mission to simplify local work through precise, time-based matching. Built for workers and businesses."
            />
            <Navbar />

            <header className="pt-32 pb-16 px-4 bg-gray-50/50 border-b border-gray-100 text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-sm font-black text-indigo-600 uppercase tracking-widest leading-none">Our Story</h1>
                    <h2 className="text-5xl font-bold text-gray-900 tracking-tight">Built by and for <br /> local workers.</h2>
                    <p className="text-xl text-gray-500 font-medium pt-4">We believe that every hour counts. We're on a mission to simplify how local work is found and filled.</p>
                </div>
            </header>

            <section className="py-28 px-6 max-w-5xl mx-auto">
                <div className="space-y-24">

                    {/* ===== Problem ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
                                The Problem
                            </p>
                            <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                                The Schedule Gap
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Most job platforms are designed around fixed, full-time roles.
                                Real-world work rarely fits that model.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                A restaurant may need help for three hours on a Friday evening.
                                A plumber may have availability for a single afternoon.
                                Traditional job boards fail to capture this reality.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                Smalljobs was created to solve this gap through precise,
                                time-based matching.
                            </p>
                        </div>

                        {/* Visual block */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-200 rounded-[3rem] blur-3xl opacity-40"></div>
                            <div className="relative bg-indigo-600 rounded-[3rem] p-12 shadow-2xl">
                                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-white/20 to-white/5" />
                                <p className="mt-6 text-indigo-100 text-sm font-semibold tracking-wide uppercase">
                                    Time-based matching, not job titles
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===== Trust ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Visual block */}
                        <div className="relative order-last md:order-first">
                            <div className="absolute inset-0 bg-emerald-200 rounded-[3rem] blur-3xl opacity-40"></div>
                            <div className="relative bg-emerald-600 rounded-[3rem] p-12 shadow-2xl">
                                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-white/20 to-white/5" />
                                <p className="mt-6 text-emerald-100 text-sm font-semibold tracking-wide uppercase">
                                    Verified profiles and transparent signals
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-sm font-semibold tracking-widest text-emerald-600 uppercase">
                                Our Approach
                            </p>
                            <h3 className="text-4xl font-bold text-gray-900 leading-tight">
                                Trust is foundational
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Matching availability is only half the equation.
                                Trust determines whether work actually happens.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Smalljobs emphasizes verified skills, transparent profiles,
                                and clear expectations on both sides.
                                This reduces friction, miscommunication, and last-minute failures.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                When trust is built into the system, better work follows.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <section className="py-28 bg-gray-900 rounded-t-[5rem]">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Section Header */}
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
                            What We Stand For
                        </p>
                        <h3 className="text-white text-4xl font-bold leading-tight">
                            Our Core Values
                        </h3>
                        <p className="text-gray-400 mt-4 text-lg">
                            The principles that guide how we build, match, and grow.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: 'Efficiency',
                                desc: 'We respect people’s time by matching work precisely to availability, skills, and location.'
                            },
                            {
                                title: 'Accessibility',
                                desc: 'Opportunities should be simple to discover and open to everyone, regardless of background.'
                            },
                            {
                                title: 'Integrity',
                                desc: 'We believe honest data and transparent matching create lasting trust.'
                            }
                        ].map((v, i) => (
                            <div
                                key={i}
                                className="relative p-10 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm
                     hover:bg-white/10 transition duration-300"
                            >
                                {/* Subtle top accent */}
                                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                                <h4 className="text-white text-2xl font-semibold mb-4">
                                    {v.title}
                                </h4>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default About;
