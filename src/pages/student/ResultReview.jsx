import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAward,
  FiArrowLeft,
  FiInfo,
  FiHelpCircle,
  FiGrid,
} from 'react-icons/fi';

export default function ResultReview() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/attempts/${attemptId}`);
      if (res.success && res.data) {
        setResultData(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  if (loading) return <LoadingSpinner text="Evaluating scorecard & generating review sheet..." />;
  if (error) return <ErrorState message={error} onRetry={fetchResult} />;

  const { attempt, answers } = resultData || {};
  const isPassed = parseFloat(attempt.percentage) >= parseFloat(attempt.passing_percentage);

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex gap-2">
          <Link
            to="/student/quizzes"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            Take Another Quiz
          </Link>
          <Link
            to="/student/leaderboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-glow transition flex items-center gap-1.5"
          >
            <FiAward className="w-4 h-4" /> View Leaderboard
          </Link>
        </div>
      </div>

      {/* Outcome Banner */}
      <div
        className={`p-6 lg:p-8 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
          isPassed
            ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/40'
            : 'bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-red-500/40'
        }`}
      >
        <div className="flex items-center gap-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${
              isPassed
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {isPassed ? <FiCheckCircle className="w-10 h-10" /> : <FiXCircle className="w-10 h-10" />}
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isPassed ? 'Passed' : 'Needs Improvement'}
            </span>
            <h1 className="text-2xl lg:text-3xl font-black text-white mt-1">{attempt.quiz_title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Passing requirement: <strong>{attempt.passing_percentage}%</strong>
            </p>
          </div>
        </div>

        {/* Score Ring */}
        <div className="text-center md:text-right bg-slate-950/70 p-4 px-6 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Final Percentage</span>
          <div
            className={`text-4xl font-black mt-0.5 font-mono ${
              isPassed ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {attempt.percentage}%
          </div>
          <span className="text-xs text-slate-300 font-medium block mt-1">
            Score: <strong>{attempt.score}</strong> / {attempt.total_marks} marks
          </span>
        </div>
      </div>

      {/* Overview Stats Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Correct Answers</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{attempt.correct_answers}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Incorrect Answers</span>
          <p className="text-2xl font-black text-red-400 mt-1">{attempt.incorrect_answers}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Unanswered</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{attempt.unanswered}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Time Taken</span>
          <p className="text-2xl font-black text-blue-400 mt-1 font-mono">{formatSeconds(attempt.time_taken)}</p>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FiHelpCircle className="text-blue-400" /> Question-wise Answer Review
        </h3>

        {answers && answers.length > 0 ? (
          answers.map((ans, idx) => {
            const isCorrect = ans.is_correct;
            const isUnanswered = !ans.selected_answer;

            let cardBorder = 'border-slate-800';
            let badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            let badgeText = 'Unanswered (0 marks)';

            if (isCorrect) {
              cardBorder = 'border-emerald-500/30 bg-emerald-950/10';
              badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              badgeText = `Correct (+${ans.marks_obtained} marks)`;
            } else if (!isUnanswered) {
              cardBorder = 'border-red-500/30 bg-red-950/10';
              badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/30';
              badgeText = 'Incorrect (0 marks)';
            }

            const options = [
              { key: 'A', text: ans.option_a },
              { key: 'B', text: ans.option_b },
              { key: 'C', text: ans.option_c },
              { key: 'D', text: ans.option_d },
            ];

            return (
              <div key={ans.answer_id} className={`p-6 rounded-2xl bg-slate-900 border ${cardBorder} shadow-md space-y-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                  <span className={`px-2.5 py-1 text-xs font-bold border rounded-lg ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-relaxed">{ans.question_text}</h4>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                  {options.map((opt) => {
                    const isUserChoice = ans.selected_answer === opt.key;
                    const isRightChoice = ans.correct_answer === opt.key;

                    let optStyle = 'bg-slate-950/60 border-slate-800 text-slate-400';
                    let statusLabel = null;

                    if (isRightChoice) {
                      optStyle = 'bg-emerald-600/20 border-emerald-500/60 text-emerald-200 font-semibold';
                      statusLabel = '✓ Correct Answer';
                    }
                    if (isUserChoice && !isRightChoice) {
                      optStyle = 'bg-red-600/20 border-red-500/60 text-red-200 font-semibold';
                      statusLabel = '✗ Your Choice';
                    } else if (isUserChoice && isRightChoice) {
                      statusLabel = '✓ Your Choice (Correct)';
                    }

                    return (
                      <div key={opt.key} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${optStyle}`}>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center">
                            {opt.key}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {statusLabel && <span className="font-bold text-[10px] uppercase tracking-wider">{statusLabel}</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {ans.explanation && (
                  <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2.5 mt-2">
                    <FiInfo className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-blue-200 mb-0.5">Explanation:</strong>
                      {ans.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">No question breakdown available.</p>
        )}
      </div>
    </div>
  );
}
