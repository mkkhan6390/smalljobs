import { useState, useEffect } from 'react';
import ClockPicker from './ClockPicker';

const AvailabilitySelector = ({ value, onChange }) => {
    // value structure: { days: [], months: [], time_slots: [{ start: '', end: '' }] }
    const data = {
        days: value?.days || [],
        months: value?.months || [],
        time_slots: value?.time_slots || []
    };

    const toggleItem = (category, item) => {
        const currentList = data[category];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        onChange({ ...data, [category]: newList });
    };

    const toggleAll = (category, allItems) => {
        const currentList = data[category];
        const isAllSelected = allItems.every(item => currentList.includes(item));
        const newList = isAllSelected ? [] : [...allItems];
        onChange({ ...data, [category]: newList });
    };

    const addTimeSlot = () => {
        onChange({
            ...data,
            time_slots: [...data.time_slots, { start: '', end: '' }]
        });
    };

    const removeTimeSlot = (index) => {
        const newSlots = data.time_slots.filter((_, i) => i !== index);
        onChange({ ...data, time_slots: newSlots });
    };

    const updateTimeSlot = (index, field, val) => {
        const newSlots = [...data.time_slots];
        newSlots[index] = { ...newSlots[index], [field]: val };
        onChange({ ...data, time_slots: newSlots });
    };

    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const SelectionGroup = ({ title, items, selected, category }) => (
        <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</label>
                <button
                    type="button"
                    onClick={() => toggleAll(category, items)}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-black uppercase tracking-widest transition-colors"
                >
                    {items.every(item => selected.includes(item)) ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(category, item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${selected.includes(item)
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200 scale-[1.02]'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );

    const TimePicker = ({ val, onTimeChange, placeholder }) => (
        <ClockPicker
            value={val}
            onChange={onTimeChange}
            label={placeholder}
        />
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectionGroup
                    title="Days of Operation"
                    items={DAYS}
                    selected={data.days}
                    category="days"
                />

                <SelectionGroup
                    title="Months Available"
                    items={MONTHS}
                    selected={data.months}
                    category="months"
                />
            </div>

            <div className="pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Time Slots</label>
                        <p className="text-[10px] text-gray-400 font-medium">Select a start and end time for each shift.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addTimeSlot}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl hover:bg-gray-800 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-gray-200 active:scale-95"
                    >
                        <span className="text-base leading-none">+</span> Add Shift
                    </button>
                </div>

                {data.time_slots.length === 0 ? (
                    <div className="bg-gray-50/50 p-10 rounded-[2rem] text-center border-2 border-dashed border-gray-100 group hover:border-indigo-100 transition-colors cursor-pointer" onClick={addTimeSlot}>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-2xl text-gray-300">🕒</span>
                        </div>
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No timings set yet</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Click to add your working hours.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {data.time_slots.map((slot, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group">
                                <div className="flex-1 flex gap-3 items-center justify-between w-full">
                                    <TimePicker
                                        val={slot.start}
                                        onTimeChange={(val) => updateTimeSlot(index, 'start', val)}
                                        placeholder="Start Time"
                                    />
                                    <div className="px-2">
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                    <TimePicker
                                        val={slot.end}
                                        onTimeChange={(val) => updateTimeSlot(index, 'end', val)}
                                        placeholder="End Time"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTimeSlot(index)}
                                    className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-end sm:self-center"
                                    title="Remove slot"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilitySelector;
