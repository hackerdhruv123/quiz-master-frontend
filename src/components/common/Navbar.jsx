import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiShield, FiCheckCircle, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Left section: Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800 transition"
            aria-label="Toggle Sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 flex items-center justify-center shadow-glow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Quiz<span className="text-blue-500">Master</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block -mt-1">
                Assessment Hub
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Role badge & User Profile Dropdown */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs font-medium">
            {isAdmin ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <FiShield className="w-3.5 h-3.5" /> Admin Panel
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-blue-400">
                <FiUser className="w-3.5 h-3.5" /> Student Portal
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-200 leading-none">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-1 capitalize">{user?.role}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800"
                >
                  <div className="px-4 py-2.5">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium transition"
                    >
                      <FiLogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
