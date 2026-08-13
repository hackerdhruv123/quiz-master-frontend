import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiBookOpen,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiHelpCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Frontend',
    difficulty: 'medium',
    duration: 15,
    passing_percentage: 60,
    is_published: false,
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (statusFilter) params.append('is_published', statusFilter);

      const res = await api.get(`/quizzes?${params.toString()}`);
      if (res.success) {
        setQuizzes(res.data.quizzes);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [search, category, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      category: 'Frontend',
      difficulty: 'medium',
      duration: 15,
      passing_percentage: 60,
      is_published: false,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      category: quiz.category,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passing_percentage: quiz.passing_percentage,
      is_published: quiz.is_published,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      if (editingQuiz) {
        await api.put(`/quizzes/${editingQuiz.id}`, formData);
      } else {
        await api.post('/quizzes', formData);
      }
      setModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (quiz) => {
    try {
      const newStatus = !quiz.is_published;
      await api.patch(`/quizzes/${quiz.id}/publish`, { is_published: newStatus });
      fetchQuizzes();
    } catch (err) {
      alert(`Publish Toggle Failed: ${err.message}`);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    try {
      await api.delete(`/quizzes/${deletingQuiz.id}`);
      setDeleteModalOpen(false);
      setDeletingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      alert(`Delete Failed: ${err.message}`);
    }
  };

  const categories = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'Security', value: 'Security' },
  ];

  const statusOptions = [
    { label: 'Published', value: 'true' },
    { label: 'Draft / Unpublished', value: 'false' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
            <FiBookOpen className="text-blue-500" /> Quiz Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, publish, and configure assessment quizzes and passing parameters.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-glow transition flex items-center gap-2 self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" /> Create New Quiz
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <SearchBar value={search} onChange={setSearch} placeholder="Search quiz titles..." />

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown value={category} onChange={setCategory} options={categories} label="Category" />
          <FilterDropdown value={statusFilter} onChange={setStatusFilter} options={statusOptions} label="Status" />
        </div>
      </div>

      {/* Quizzes Table */}
      {loading ? (
        <LoadingSpinner text="Fetching quizzes..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchQuizzes} />
      ) : quizzes.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">No quizzes found. Click "Create New Quiz" to add one.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Title & Details</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Questions & Marks</th>
                  <th className="px-5 py-4">Duration & Pass%</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-white block text-base">{q.title}</span>
                      <span className="text-xs text-slate-400 line-clamp-1">{q.description || 'No description'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
                        {q.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/quizzes/${q.id}/questions`)}
                          className="px-2.5 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                        >
                          <FiHelpCircle className="w-3.5 h-3.5" /> {q.question_count || 0} Questions
                        </button>
                        <span className="text-xs text-slate-400 font-mono">({q.total_marks || 0} pts)</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-300">
                      <div><FiClock className="inline w-3 h-3 text-blue-400" /> {q.duration} mins</div>
                      <div className="text-slate-400 mt-0.5">Passing: {q.passing_percentage}%</div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(q)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
                          q.is_published
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                      >
                        {q.is_published ? (
                          <>
                            <FiCheckCircle className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <FiXCircle className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Edit Quiz"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingQuiz(q);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                          title="Delete Quiz"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Quiz Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuiz ? 'Edit Quiz Parameters' : 'Create New Assessment Quiz'}
      >
        <form onSubmit={handleSaveQuiz} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded-xl flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Quiz Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. JavaScript Core Concepts"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of quiz scope and objectives..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Frontend, Backend..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Limit (Minutes) *</label>
              <input
                type="number"
                min={1}
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Passing Percentage (%) *</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={formData.passing_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, passing_percentage: parseFloat(e.target.value) || 50 })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="is_published" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Publish Quiz Immediately
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-glow"
            >
              {saving ? 'Saving...' : editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Quiz"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <FiTrash2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">
            Are you sure you want to delete "{deletingQuiz?.title}"?
          </h4>
          <p className="text-xs text-slate-400">
            This action cannot be undone. All questions and student attempt records linked to this quiz will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteQuiz}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Delete Quiz
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
