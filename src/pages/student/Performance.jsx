import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import { FiTrendingUp, FiCheckCircle, FiClock, FiGrid, FiEye } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function Performance() {
  const [data, setData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const navigate = useNavigate();

  const fetchPerformance = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, attemptsRes] = await Promise.all([
        api.get('/analytics/student'),
        api.get('/attempts'),
      ]);

      if (analyticsRes.success) {
        setData(analyticsRes.data);
      }
      if (attemptsRes.success) {
        setAttempts(attemptsRes.data.attempts);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) return <LoadingSpinner text="Analyzing student performance history..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPerformance} />;

  const { summary, category_performance } = data || {};

  const filteredAttempts = attempts.filter((att) => {
    const matchesSearch = search
      ? att.quiz_title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCat = category ? att.category === category : true;
    return matchesSearch && matchesCat;
  });

  const categoryOptions = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'Security', value: 'Security' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
          <FiTrendingUp className="text-blue-500" /> Performance Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed metrics of your quiz scores, domain accuracy, and historical progress.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Attempts</span>
          <p className="text-2xl font-black text-white mt-1">{summary?.total_attempts || 0}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Score</span>
          <p className="text-2xl font-black text-blue-400 mt-1">{summary?.average_score || 0}%</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Highest Marks</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{summary?.best_score || 0}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Accuracy Rate</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{summary?.accuracy || 0}%</p>
        </div>
      </div>

      {/* Category Wise Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Category-wise Average Score (%)</h3>

        {category_performance && category_performance.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="avg_percentage" name="Avg Score %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-8 text-center">No category data recorded yet.</p>
        )}
      </div>

      {/* Complete Attempts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiClock className="text-emerald-400" /> Complete Attempt History
          </h3>

          <div className="flex items-center gap-2">
            <SearchBar value={search} onChange={setSearch} placeholder="Search quiz history..." />
            <FilterDropdown value={category} onChange={setCategory} options={categoryOptions} label="Category" />
          </div>
        </div>

        {filteredAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Quiz Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-white">{att.quiz_title}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{att.category}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">
                      {att.score} / {att.total_marks}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">{att.percentage}%</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(att.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {att.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/student/result/${att.id}`)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition inline-flex items-center gap-1"
                        >
                          <FiEye className="w-3.5 h-3.5" /> Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-6 text-center">No attempts match your filters.</p>
        )}
      </div>
    </div>
  );
}
