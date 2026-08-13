import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { FiActivity, FiEye, FiCheckCircle, FiXCircle, FiClock, FiHelpCircle } from 'react-icons/fi';

export default function AttemptMonitoring() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Selected attempt modal state
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [attemptDetail, setAttemptDetail] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchAttempts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const res = await api.get(`/attempts?${params.toString()}`);
      if (res.success) {
        setAttempts(res.data.attempts);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [search, status]);

  const handleInspectAttempt = async (attemptId) => {
    setSelectedAttemptId(attemptId);
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await api.get(`/attempts/${attemptId}`);
      if (res.success) {
        setAttemptDetail(res.data);
      }
    } catch (err) {
      console.error('Error fetching attempt detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Expired', value: 'expired' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
          <FiActivity className="text-emerald-400" /> Platform Attempt Monitoring
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Audit and inspect all active, completed, and expired student examination submissions in real-time.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <SearchBar value={search} onChange={setSearch} placeholder="Search student name, email or quiz title..." />

        <FilterDropdown value={status} onChange={setStatus} options={statusOptions} label="Status" />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading attempt audit logs..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAttempts} />
      ) : attempts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No attempt records match your query.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Quiz Title</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <span className="font-bold text-white block">{att.student_name}</span>
                      <span className="text-xs text-slate-400">{att.student_email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-200 block">{att.quiz_title}</span>
                      <span className="text-[11px] text-slate-400">{att.category}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-200">
                      {att.score} / {att.total_marks}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-400">{att.percentage}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border capitalize ${
                          att.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : att.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(att.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleInspectAttempt(att.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition inline-flex items-center gap-1"
                      >
                        <FiEye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Attempt Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Student Submission Inspection Sheet"
        maxWidth="max-w-3xl"
      >
        {detailLoading ? (
          <LoadingSpinner text="Fetching full submission data..." />
        ) : attemptDetail ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-base">{attemptDetail.attempt.student_name}</h4>
                <p className="text-xs text-slate-400">{attemptDetail.attempt.quiz_title}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-blue-400 block">{attemptDetail.attempt.percentage}%</span>
                <span className="text-xs text-slate-300">Score: {attemptDetail.attempt.score} / {attemptDetail.attempt.total_marks}</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {attemptDetail.answers.map((ans, idx) => (
                <div key={ans.answer_id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">Q{idx + 1}. {ans.question_text}</span>
                    <span className={`font-bold ${ans.is_correct ? 'text-emerald-400' : 'text-red-400'}`}>
                      {ans.is_correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                    <div>Selected: <strong className="text-white">{ans.selected_answer || 'None'}</strong></div>
                    <div>Correct: <strong className="text-emerald-400">{ans.correct_answer}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
              >
                Close Inspection
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
