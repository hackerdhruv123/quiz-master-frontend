import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import QuizCard from '../../components/quiz/QuizCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiCheckSquare,
  FiTrendingUp,
  FiAward,
  FiBookOpen,
  FiArrowRight,
  FiActivity,
  FiClock,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, quizzesRes] = await Promise.all([
        api.get('/analytics/student'),
        api.get('/quizzes?limit=3'),
      ]);

      if (analyticsRes.success) {
        setData(analyticsRes.data);
      }
      if (quizzesRes.success) {
        setQuizzes(quizzesRes.data.quizzes.slice(0, 3));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartQuiz = (quiz) => {
    navigate(`/student/quiz/${quiz.id}`);
  };

  if (loading) return <LoadingSpinner text="Loading dashboard analytics..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const { summary, score_history, recent_attempts } = data || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/40 p-6 lg:p-8 rounded-3xl border border-blue-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            Student Portal
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-white mt-2">
            Track & Elevate Your Assessment Performance
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Take timed quizzes, test your conceptual knowledge, review detailed explanations, and climb the student leaderboard.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Attempts"
          value={summary?.total_attempts || 0}
          subtitle={`${summary?.completed_attempts || 0} Completed`}
          icon={FiCheckSquare}
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${summary?.average_score || 0}%`}
          subtitle="Overall performance"
          icon={FiTrendingUp}
          color="indigo"
        />
        <StatCard
          title="Best Score"
          value={`${summary?.best_score || 0}`}
          subtitle="Highest marks scored"
          icon={FiAward}
          color="emerald"
        />
        <StatCard
          title="Leaderboard Rank"
          value={summary?.user_rank ? `#${summary.user_rank}` : 'Unranked'}
          subtitle={`Accuracy: ${summary?.accuracy || 0}%`}
          icon={FiActivity}
          color="amber"
        />
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score History Line Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-blue-400" /> Score Trend Over Time
              </h3>
              <p className="text-xs text-slate-400">Percentage scored in recent completed attempts</p>
            </div>
          </div>

          {score_history && score_history.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={score_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date_label" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Score %"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              Complete your first quiz attempt to see performance graphs here.
            </div>
          )}
        </div>

        {/* Quick Quiz Showcase */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-indigo-400" /> Recommended Quizzes
              </h3>
              <Link to="/student/quizzes" className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1">
                View All <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {quizzes.map((q) => (
                <div key={q.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-blue-500/40 transition">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{q.title}</h4>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {q.category} • {q.duration} mins • {q.question_count} Questions
                    </span>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(q)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiClock className="w-5 h-5 text-emerald-400" /> Recent Quiz Attempts
          </h3>
          <Link to="/student/performance" className="text-xs text-blue-400 hover:underline font-semibold">
            Full History →
          </Link>
        </div>

        {recent_attempts && recent_attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Quiz Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recent_attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-white">{att.quiz_title}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{att.category}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">
                      {att.score} / {att.total_marks}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">{att.percentage}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-md capitalize ${
                          att.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {att.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/student/result/${att.id}`)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition"
                        >
                          Review Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-6 text-center">No recent attempt records found.</p>
        )}
      </div>
    </div>
  );
}
