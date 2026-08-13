import React from 'react';
import { FiBookmark, FiCheckCircle } from 'react-icons/fi';

export default function QuestionCard({
  question,
  index,
  totalQuestions,
  selectedAnswer,
  isMarked,
  onAnswerSelect,
  onToggleMark,
}) {
  if (!question) return null;

  const options = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-lg">
            Question {index + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Marks: <strong className="text-slate-200">{question.marks || 1}</strong>
          </span>
        </div>

        <button
          onClick={() => onToggleMark(question.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isMarked
              ? 'bg-purple-600/20 text-purple-400 border-purple-500/40'
              : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <FiBookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-purple-400' : ''}`} />
          {isMarked ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      {/* Question Text */}
      <h3 className="text-lg lg:text-xl font-bold text-white leading-relaxed mb-6">
        {question.question_text}
      </h3>

      {/* Options List */}
      <div className="space-y-3.5">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;

          return (
            <div
              key={opt.key}
              onClick={() => onAnswerSelect(question.id, opt.key)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-glow'
                  : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                  isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {opt.key}
              </div>
              <span className="text-sm lg:text-base font-medium flex-1">{opt.text}</span>
              {isSelected && <FiCheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
