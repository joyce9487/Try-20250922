import React from 'react';

interface MeditationScriptProps {
  script: string;
  isLoading: boolean;
  error: string | null;
}

export const MeditationScript: React.FC<MeditationScriptProps> = ({ script, isLoading, error }) => {
  const hasContent = script || isLoading || error;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">你的專屬引導</h2>
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg min-h-[100px] whitespace-pre-wrap transition-colors duration-300">
        {script}
        {isLoading && !script && <p className="text-slate-500">正在為您準備引導腳本，請稍候...</p>}
        {isLoading && <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse ml-1" />}
      </div>
    </div>
  );
};
