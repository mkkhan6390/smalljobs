import { useState, useEffect } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

    // Generate 30-minute intervals for dropdown
    const timeOptions = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }

    const SelectionGroup = ({ title, items, selected, category }) => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-800 uppercase tracking-tight">{title}</label>
                <button
                    type="button"
                    onClick={() => toggleAll(category, items)}
                    className="text-xs text-teal-600 hover:text-teal-800 font-bold"
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${selected.includes(item)
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-teal-300'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );

    const TimePicker = ({ val, onTimeChange, placeholder }) => (
        <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none min-w-[120px] font-medium text-gray-700 shadow-sm transition-all"
            value={val}
            onChange={(e) => onTimeChange(e.target.value)}
        >
            <option value="">{placeholder}</option>
            {timeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
            ))}
        </select>
    );

    return (
        <div className="space-y-6">
            <SelectionGroup
                title="Available Days"
                items={DAYS}
                selected={data.days}
                category="days"
            />

            <SelectionGroup
                title="Available Months"
                items={MONTHS}
                selected={data.months}
                category="months"
            />

            <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-gray-800 uppercase tracking-tight">Time Slots (HH:MM)</label>
                    <button
                        type="button"
                        onClick={addTimeSlot}
                        className="text-xs bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 font-bold transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 active:scale-95"
                    >
                        <span className="text-lg leading-none">+</span> Add Shift
                    </button>
                </div>

                {data.time_slots.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 font-medium">No specific timings added.</p>
                        <p className="text-xs text-gray-400 mt-1">Add your working hours for better matches.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.time_slots.map((slot, index) => (
                            <div key={index} className="flex gap-4 items-center bg-gray-50/80 p-3 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                                <div className="flex-1 flex gap-3 items-center justify-center">
                                    <TimePicker
                                        val={slot.start}
                                        onTimeChange={(val) => updateTimeSlot(index, 'start', val)}
                                        placeholder="Start Time"
                                    />
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">to</span>
                                    <TimePicker
                                        val={slot.end}
                                        onTimeChange={(val) => updateTimeSlot(index, 'end', val)}
                                        placeholder="End Time"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTimeSlot(index)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                    title="Remove slot"
                                >
                                    <span className="text-2xl leading-none">×</span>
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
