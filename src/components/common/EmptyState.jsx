import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No records found', message = 'There are no items to display at this time.', actionText, onAction, icon: Icon = FiInbox }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition shadow-glow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
