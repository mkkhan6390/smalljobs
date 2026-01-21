import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClockPicker = ({ value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('hours'); // 'hours' or 'minutes'
    const containerRef = useRef(null);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [ampm, setAmpm] = useState('AM');

    // Sync state with prop
    useEffect(() => {
        const time = value || "09:00";
        const [h, m] = time.split(':').map(Number);
        setHours(h);
        setMinutes(m);
        setAmpm(h >= 12 ? 'PM' : 'AM');
    }, [value, isOpen]);

    // Convert to 12h for display
    const displayHours = hours % 12 || 12;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (mode === 'hours') {
            const h24 = ampm === 'PM' ? (val === 12 ? 12 : val + 12) : (val === 12 ? 0 : val);
            setHours(h24);
            setMode('minutes');
        } else {
            setMinutes(val);
        }
    };

    const toggleAmpm = (newAmpm) => {
        setAmpm(newAmpm);
        const h12 = hours % 12 || 12;
        const h24 = newAmpm === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
        setHours(h24);
    };

    const confirmSelection = () => {
        const hStr = hours.toString().padStart(2, '0');
        const mStr = minutes.toString().padStart(2, '0');
        onChange(`${hStr}:${mStr}`);
        setIsOpen(false);
    };

    const formatTo12h = (h24, mm) => {
        const h = h24 % 12 || 12;
        const m = mm.toString().padStart(2, '0');
        const p = h24 >= 12 ? 'PM' : 'AM';
        return `${h}:${m} ${p}`;
    };

    const renderNumbers = () => {
        const isHours = mode === 'hours';
        const items = isHours ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        const radius = 90;

        return items.map((num, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const isSelected = isHours ? (hours % 12 || 12) === num : minutes === num;

            return (
                <motion.button
                    key={num}
                    type="button"
                    className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm font-black transition-colors ${isSelected ? 'bg-indigo-600 text-white shadow-lg z-10' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)` }}
                    onClick={() => handleSelect(num)}
                    whileTap={{ scale: 0.9 }}
                >
                    {num}
                </motion.button>
            );
        });
    };

    return (
        <div className="relative flex-1" ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setMode('hours');
                }}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 flex items-center justify-between hover:border-gray-200 transition-all hover:shadow-sm"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-300">🕒</span>
                    <span>{value ? formatTo12h(hours, minutes) : label}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile/tablet focus */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-[90] sm:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed sm:absolute z-[100] top-1/2 left-1/2 sm:top-full sm:left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-y-0 sm:mt-3 w-[300px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 overflow-hidden"
                        >
                            {/* Display area */}
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="flex gap-1 items-baseline">
                                    <button
                                        type="button"
                                        onClick={() => setMode('hours')}
                                        className={`text-4xl font-black transition-colors ${mode === 'hours' ? 'text-indigo-600' : 'text-gray-200 hover:text-gray-300'}`}
                                    >
                                        {displayHours}
                                    </button>
                                    <span className="text-4xl font-black text-gray-200">:</span>
                                    <button
                                        type="button"
                                        onClick={() => setMode('minutes')}
                                        className={`text-4xl font-black transition-colors ${mode === 'minutes' ? 'text-indigo-600' : 'text-gray-200 hover:text-gray-300'}`}
                                    >
                                        {minutes.toString().padStart(2, '0')}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleAmpm('AM')}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest transition-all ${ampm === 'AM' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}
                                    >
                                        AM
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toggleAmpm('PM')}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest transition-all ${ampm === 'PM' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>

                            {/* Clock Circle */}
                            <div className="relative w-[220px] h-[220px] mx-auto bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6">
                                {/* Center center pivot */}
                                <div className="absolute w-2 h-2 bg-indigo-600 rounded-full z-20 shadow-sm" />

                                {/* The Clock Numbers */}
                                {renderNumbers()}

                                {/* Center line to indicator */}
                                <motion.div
                                    className="absolute bottom-1/2 left-1/2 w-0.5 bg-indigo-200 origin-bottom"
                                    style={{ height: '80px', transform: `translateX(-50%) rotate(${mode === 'hours' ? ((hours % 12) * 30) : (minutes * 6)}deg)` }}
                                    animate={{ rotate: mode === 'hours' ? ((hours % 12) * 30) : (minutes * 6) }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSelection}
                                    className="flex-2 flex-[2] py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                >
                                    OK
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClockPicker;
