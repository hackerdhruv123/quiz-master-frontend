import React from 'react';
import { FiClock, FiHelpCircle, FiAward, FiPlay } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function QuizCard({ quiz, onStart }) {
  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const diffBadge = difficultyColors[quiz.difficulty] || difficultyColors.medium;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md transition-all group"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg uppercase tracking-wider">
            {quiz.category}
          </span>
          <span className={`px-2.5 py-0.5 border text-[11px] font-bold rounded-md capitalize ${diffBadge}`}>
            {quiz.difficulty}
          </span>
        </div>

        {/* Quiz Title & Description */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {quiz.title}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {quiz.description || 'Test your proficiency and evaluate your technical skills.'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <FiClock className="w-3 h-3 text-blue-400" /> Time
            </span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{quiz.duration} min</p>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <FiHelpCircle className="w-3 h-3 text-indigo-400" /> Questions
            </span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{quiz.question_count || 0}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <FiAward className="w-3 h-3 text-amber-400" /> Pass %
            </span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{quiz.passing_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={() => onStart(quiz)}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-glow flex items-center justify-center gap-2"
      >
        <FiPlay className="w-4 h-4 fill-white" /> Start Quiz
      </button>
    </motion.div>
  );
}
