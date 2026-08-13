import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FilterDropdown from '../../components/common/FilterDropdown';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { FiAward, FiCheckCircle, FiUser } from 'react-icons/fi';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = category ? `/leaderboard?category=${category}` : '/leaderboard';
      const res = await api.get(url);
      if (res.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [category]);

  const categories = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'Security', value: 'Security' },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="font-bold text-slate-400 text-sm">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
            <FiAward className="text-amber-400" /> Platform Leaderboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Student standings ranked by average percentage score, accuracy, and quiz completion volume.
          </p>
        </div>

        <FilterDropdown value={category} onChange={setCategory} options={categories} label="Category" />
      </div>

      {loading ? (
        <LoadingSpinner text="Compiling student rankings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLeaderboard} />
      ) : leaderboard.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No student attempt records recorded for this category yet.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Quizzes Attempted</th>
                  <th className="px-6 py-4">Avg Score (%)</th>
                  <th className="px-6 py-4">Total Score</th>
                  <th className="px-6 py-4 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((student) => {
                  const isCurrentUser = user && user.id === student.user_id;

                  return (
                    <tr
                      key={student.user_id}
                      className={`transition ${
                        isCurrentUser
                          ? 'bg-blue-600/15 border-l-4 border-l-blue-500 font-semibold text-white'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-6 py-4 flex items-center gap-2">{getRankBadge(student.rank)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block leading-none">
                              {student.name} {isCurrentUser && <span className="text-xs text-blue-400 font-normal">(You)</span>}
                            </span>
                            <span className="text-[11px] text-slate-400">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{student.quizzes_attempted}</td>
                      <td className="px-6 py-4 font-mono font-bold text-blue-400">
                        {student.avg_percentage}%
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-200">
                        {student.total_score} pts
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                        {student.accuracy}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
