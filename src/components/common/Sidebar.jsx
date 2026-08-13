import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiHelpCircle,
  FiUsers,
  FiActivity,
  FiX,
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FiGrid },
    { name: 'Browse Quizzes', path: '/student/quizzes', icon: FiBookOpen },
    { name: 'My Performance', path: '/student/performance', icon: FiTrendingUp },
    { name: 'Leaderboard', path: '/student/leaderboard', icon: FiAward },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Quiz Management', path: '/admin/quizzes', icon: FiBookOpen },
    { name: 'User Management', path: '/admin/users', icon: FiUsers },
    { name: 'Attempt Monitor', path: '/admin/attempts', icon: FiActivity },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 z-40 transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between lg:hidden mb-6 px-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5 mt-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Online Assessment Platform</p>
          <p className="text-[11px] mt-0.5 text-slate-400">Production v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
