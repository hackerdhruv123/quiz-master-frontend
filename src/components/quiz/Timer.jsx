import React, { useEffect, useState } from 'react';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

export default function Timer({ initialSeconds, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft < 120; // less than 2 mins

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-bold text-sm shadow-md transition-all ${
        isWarning
          ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
          : 'bg-slate-900/90 text-blue-400 border-slate-700'
      }`}
    >
      {isWarning ? <FiAlertCircle className="w-5 h-5 animate-bounce" /> : <FiClock className="w-5 h-5 text-blue-400" />}
      <div className="flex items-center gap-1 font-mono text-base">
        <span>{String(minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span>{String(seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
