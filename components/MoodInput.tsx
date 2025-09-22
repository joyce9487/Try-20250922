
import React from 'react';

interface MoodInputProps {
  mood: string;
  setMood: (mood: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const MoodInput: React.FC<MoodInputProps> = ({ mood, setMood, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="mood-input" className="font-semibold text-slate-700 dark:text-slate-300">
        我現在的感覺是...
      </label>
      <textarea
        id="mood-input"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="例如：感到焦慮、思緒混亂，或只想放鬆一下..."
        rows={3}
        className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !mood.trim()}
        className="w-full flex justify-center items-center gap-2 bg-teal-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-teal-600 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-all duration-200 transform hover:scale-105 active:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </>
        ) : (
          '生成引導'
        )}
      </button>
    </form>
  );
};
