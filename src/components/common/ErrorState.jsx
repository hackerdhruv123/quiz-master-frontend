import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl my-4">
      <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
        <FiAlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-red-300">An Error Occurred</h4>
      <p className="text-sm text-slate-300 mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
