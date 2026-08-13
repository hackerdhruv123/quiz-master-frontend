import React from 'react';
import { FiFilter } from 'react-icons/fi';

export default function FilterDropdown({ value, onChange, options, label = 'Filter' }) {
  return (
    <div className="relative inline-flex items-center">
      <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl text-sm font-medium text-slate-300 appearance-none focus:outline-none cursor-pointer hover:border-slate-700 transition"
      >
        <option value="">{label}: All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
