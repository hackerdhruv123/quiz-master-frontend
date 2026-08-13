import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiUsers,
  FiBookOpen,
  FiHelpCircle,
  FiCheckSquare,
  FiActivity,
  FiPieChart,
  FiPlus,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics/admin');
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Fetching platform admin metrics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAdminAnalytics} />;

  const { summary, score_distribution, category_stats, recent_attempts } = analytics || {};

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            Admin Control Center
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-white mt-2">
            Quiz & Student Management System
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor real-time student engagement, quiz attempts, and system analytics.
          </p>
        </div>

        <Link
          to="/admin/quizzes"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-glow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" /> Manage Quizzes
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={summary?.total_students || 0}
          subtitle="Registered learners"
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Total Quizzes"
          value={summary?.total_quizzes || 0}
          subtitle="Active & Drafts"
          icon={FiBookOpen}
          color="indigo"
        />
        <StatCard
          title="Total Questions"
          value={summary?.total_questions || 0}
          subtitle="Question bank items"
          icon={FiHelpCircle}
          color="purple"
        />
        <StatCard
          title="Total Attempts"
          value={summary?.total_attempts || 0}
          subtitle="Evaluated submissions"
          icon={FiCheckSquare}
          color="emerald"
        />
        <StatCard
          title="Platform Avg Score"
          value={`${summary?.avg_platform_score || 0}%`}
          subtitle={`Top Quiz: ${summary?.most_popular_quiz}`}
          icon={FiActivity}
          color="amber"
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <FiPieChart className="text-amber-400" /> Student Score Distribution
          </h3>
          {score_distribution && score_distribution.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={score_distribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {score_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No score distribution data available.</p>
          )}
        </div>

        {/* Category Attempt Volumes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Attempts by Category</h3>
          {category_stats && category_stats.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={category_stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="attempt_count" name="Attempts" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No category stats recorded.</p>
          )}
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Recent Student Submissions</h3>
          <Link to="/admin/attempts" className="text-xs text-blue-400 hover:underline font-semibold">
            All Attempts →
          </Link>
        </div>

        {recent_attempts && recent_attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Quiz Title</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recent_attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-white">
                      {att.student_name}
                      <span className="text-[11px] text-slate-400 block font-normal">{att.student_email}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{att.quiz_title}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">
                      {att.score} / {att.total_marks}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">{att.percentage}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 capitalize">
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-400">
                      {new Date(att.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-6">No recent attempt submissions.</p>
        )}
      </div>
    </div>
  );
}
