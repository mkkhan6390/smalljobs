

const Footer = () => {


    return (
        <footer className="bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">RozKamao</h3>
                        <p className="text-gray-600 leading-relaxed">
                            A local gig platform helping students and gig workers find quick,
                            flexible jobs nearby.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-gray-900">Find Jobs</a></li>
                            <li><a href="#" className="hover:text-gray-900">Post a Task</a></li>
                            <li><a href="#" className="hover:text-gray-900">How It Works</a></li>
                            <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Support
                        </h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                            <li><a href="#" className="hover:text-gray-900">Safety Guidelines</a></li>
                            <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-3 text-gray-600">
                            <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-2 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} RozKamao. Built for the community.
                    </p>

                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Twitter</span>
                            X
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">LinkedIn</span>
                            LinkedIn
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Instagram</span>
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer