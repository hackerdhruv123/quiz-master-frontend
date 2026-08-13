import React from 'react';
import Modal from '../common/Modal';
import { FiAlertCircle, FiCheckCircle, FiHelpCircle, FiBookmark } from 'react-icons/fi';

export default function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  markedCount,
  submitting,
}) {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Quiz Submission" maxWidth="max-w-md">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <FiAlertCircle className="w-8 h-8" />
        </div>

        <h4 className="text-lg font-bold text-white">Are you sure you want to submit?</h4>
        <p className="text-xs text-slate-400 mt-1">
          Once submitted, your responses will be locked and automatically evaluated.
        </p>

        {/* Summary Breakdown */}
        <div className="grid grid-cols-3 gap-2 my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <div>
            <span className="text-xs text-emerald-400 font-bold block">{answeredCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Answered</span>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-xs text-purple-400 font-bold block">{markedCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Marked</span>
          </div>
          <div>
            <span className="text-xs text-amber-400 font-bold block">{unansweredCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Unanswered</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl mb-4 text-left">
            ⚠️ You still have <strong>{unansweredCount} unanswered questions</strong>. You can go back and complete them before submitting.
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition border border-slate-700"
          >
            Continue Quiz
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-glow flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" /> Submit Now
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
