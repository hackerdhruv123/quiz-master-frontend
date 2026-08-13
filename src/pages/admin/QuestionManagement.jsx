import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiHelpCircle,
  FiArrowLeft,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
} from 'react-icons/fi';

export default function QuestionManagement() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    marks: 1,
    explanation: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quizRes, questionsRes] = await Promise.all([
        api.get(`/quizzes/${quizId}`),
        api.get(`/quizzes/${quizId}/questions`),
      ]);

      if (quizRes.success) {
        setQuiz(quizRes.data.quiz);
      }
      if (questionsRes.success) {
        setQuestions(questionsRes.data.questions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      marks: 1,
      explanation: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      marks: q.marks,
      explanation: q.explanation || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.option_a || !formData.option_b || !formData.option_c || !formData.option_d) {
      setFormError('All 4 options (A, B, C, D) must be filled.');
      return;
    }

    setSaving(true);
    try {
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion.id}`, formData);
      } else {
        await api.post(`/quizzes/${quizId}/questions`, formData);
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;
    try {
      await api.delete(`/questions/${deletingQuestion.id}`);
      setDeleteModalOpen(false);
      setDeletingQuestion(null);
      fetchQuestions();
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner text="Loading question bank..." />;
  if (error) return <ErrorState message={error} onRetry={fetchQuestions} />;

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div>
        <button
          onClick={() => navigate('/admin/quizzes')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold mb-3"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Quizzes
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <FiHelpCircle className="text-blue-500" /> Questions: {quiz?.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Category: <strong className="text-slate-300">{quiz?.category}</strong> • Duration: {quiz?.duration} mins • Total Questions: {questions.length}
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-glow transition flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <FiHelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No questions added yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Add Question" to start populating questions for this assessment quiz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const options = [
              { key: 'A', text: q.option_a },
              { key: 'B', text: q.option_b },
              { key: 'C', text: q.option_c },
              { key: 'D', text: q.option_d },
            ];

            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Marks: <strong className="text-slate-200">{q.marks}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Edit Question"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingQuestion(q);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete Question"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-relaxed">{q.question_text}</h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {options.map((opt) => {
                    const isCorrect = q.correct_answer === opt.key;
                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                          isCorrect
                            ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isCorrect && <FiCheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-300">Explanation: </strong> {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Question Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add New Multiple-Choice Question'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-400 rounded-xl flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Question Text *</label>
            <textarea
              rows={3}
              required
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              placeholder="Enter the question statement..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Option A *</label>
              <input
                type="text"
                required
                value={formData.option_a}
                onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Option B *</label>
              <input
                type="text"
                required
                value={formData.option_b}
                onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Option C *</label>
              <input
                type="text"
                required
                value={formData.option_c}
                onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Option D *</label>
              <input
                type="text"
                required
                value={formData.option_d}
                onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correct Answer Choice *</label>
              <div className="flex items-center gap-3 bg-slate-950 p-2 border border-slate-800 rounded-xl">
                {['A', 'B', 'C', 'D'].map((choice) => (
                  <label key={choice} className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-300">
                    <input
                      type="radio"
                      name="correct_choice"
                      value={choice}
                      checked={formData.correct_answer === choice}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className="accent-blue-600"
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Marks *</label>
              <input
                type="number"
                min={1}
                required
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation (Optional)</label>
            <textarea
              rows={2}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Provide solution context shown to students in result review..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-glow"
            >
              {saving ? 'Saving...' : editingQuestion ? 'Update Question' : 'Save Question'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Question"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <FiTrash2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Delete this question?</h4>
          <p className="text-xs text-slate-400">
            This will permanently delete the question from the question bank.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteQuestion}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
