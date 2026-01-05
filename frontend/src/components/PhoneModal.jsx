import { useState } from 'react';

const PhoneModal = ({ isOpen, onClose, onSave }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.length < 8) {
            alert("Please enter a valid phone number.");
            return;
        }
        setLoading(true);
        try {
            await onSave(phone);
            onClose();
        } catch (error) {
            console.error("Failed to save phone number", error);
            alert("Failed to save. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all scale-100">
                <div className="text-center mb-6">
                    <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        📱
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 font-outfit">Phone Number Required</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Please provide your contact number. This is required to post or apply for jobs so that others can reach you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Your Number</label>
                        <input
                            type="tel"
                            placeholder="e.g. +1 234 567 890"
                            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-colors text-lg font-bold"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhoneModal;
