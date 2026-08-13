import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30',
  };

  const bgStyle = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${bgStyle} border backdrop-blur-md relative overflow-hidden transition-all duration-200 hover:scale-[1.01]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-black text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-700/50 shadow-inner">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 text-xs font-medium text-slate-400 flex items-center gap-1">
          <span className="text-emerald-400 font-bold">{trend}</span> since last week
        </div>
      )}
    </div>
  );
}
