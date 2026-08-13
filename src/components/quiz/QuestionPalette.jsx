import React from 'react';

export default function QuestionPalette({
  questions = [],
  currentIndex,
  answers = {},
  markedForReview = {},
  onSelectQuestion,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
        <span>Question Palette</span>
        <span className="text-xs text-slate-400 font-normal">
          {Object.keys(answers).length} of {questions.length} Answered
        </span>
      </h4>

      {/* Palette Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 pb-3 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500 inline-block" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-500 inline-block" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500 border border-blue-400 inline-block" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" />
          <span>Unanswered</span>
        </div>
      </div>

      {/* Grid of Numbers */}
      <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const qId = q.id;
          const isCurrent = idx === currentIndex;
          const isAnswered = Boolean(answers[qId]);
          const isMarked = Boolean(markedForReview[qId]);

          let btnClass = 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700';

          if (isCurrent) {
            btnClass = 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50 font-bold';
          } else if (isMarked) {
            btnClass = 'bg-purple-600/30 text-purple-300 border-purple-500 font-bold';
          } else if (isAnswered) {
            btnClass = 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold';
          }

          return (
            <button
              key={qId}
              onClick={() => onSelectQuestion(idx)}
              className={`w-9 h-9 rounded-xl text-xs flex items-center justify-center border transition ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
