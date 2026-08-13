import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Timer from '../../components/quiz/Timer';
import QuestionCard from '../../components/quiz/QuestionCard';
import QuestionPalette from '../../components/quiz/QuestionPalette';
import SubmitConfirmModal from '../../components/quiz/SubmitConfirmModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' }
  const [markedForReview, setMarkedForReview] = useState({}); // { questionId: true }
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSubmittingRef = useRef(false);

  const initAttempt = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/attempts/start', { quiz_id: parseInt(quizId, 10) });
      if (res.success && res.data) {
        const { attempt: attData, questions: qList, saved_answers } = res.data;
        setAttempt(attData);
        setQuestions(qList);
        setRemainingSeconds(attData.remaining_seconds);

        // Pre-fill saved answers if resuming
        const savedMap = {};
        if (Array.isArray(saved_answers)) {
          saved_answers.forEach((sa) => {
            if (sa.selected_answer) {
              savedMap[sa.question_id] = sa.selected_answer;
            }
          });
        }
        setAnswers(savedMap);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAttempt();
  }, [quizId]);

  const handleAnswerSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleToggleMark = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuizAttempt = async () => {
    if (isSubmittingRef.current || !attempt) return;
    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, choice]) => ({
        questionId: parseInt(qId, 10),
        selectedAnswer: choice,
      }));

      const res = await api.post(`/attempts/${attempt.id}/submit`, {
        answers: formattedAnswers,
      });

      if (res.success && res.data?.attempt) {
        navigate(`/student/result/${res.data.attempt.id}`, { replace: true });
      }
    } catch (err) {
      alert(`Submission Error: ${err.message}`);
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleTimerExpire = () => {
    if (!isSubmittingRef.current) {
      submitQuizAttempt();
    }
  };

  if (loading) return <LoadingSpinner text="Initializing examination timer & loading questions..." />;
  if (error) return <ErrorState message={error} onRetry={initAttempt} />;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header bar during attempt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl sticky top-20 z-20 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-black text-white">{attempt?.quiz_title}</h2>
          <p className="text-xs text-slate-400">
            Total Questions: {questions.length} • Total Marks: {attempt?.total_marks}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <Timer initialSeconds={remainingSeconds} onExpire={handleTimerExpire} />

          <button
            onClick={() => setConfirmModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-glow transition flex items-center gap-1.5"
          >
            <FiCheckCircle className="w-4 h-4" /> Submit Quiz
          </button>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 cols: Question Card */}
        <div className="lg:col-span-3 space-y-4">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestion?.id]}
            isMarked={markedForReview[currentQuestion?.id]}
            onAnswerSelect={handleAnswerSelect}
            onToggleMark={handleToggleMark}
          />

          {/* Previous / Next Bar */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FiArrowLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Question {currentIndex + 1} of {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow transition"
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setConfirmModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition"
              >
                Finish & Review
              </button>
            )}
          </div>
        </div>

        {/* Right 1 col: Question Palette */}
        <div className="lg:col-span-1">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={submitQuizAttempt}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        markedCount={markedCount}
        submitting={submitting}
      />
    </div>
  );
}
