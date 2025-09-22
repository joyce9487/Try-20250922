import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MoodInput } from './components/MoodInput';
import { MeditationScript } from './components/MeditationScript';
import { generateMeditationScript } from './services/geminiService';
import { AudioPlayer } from './components/AudioPlayer';

const App: React.FC = () => {
  const [mood, setMood] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = useCallback(async () => {
    if (!mood.trim() || isLoading) return;

    setIsLoading(true);
    setScript('');
    setError(null);

    try {
      const stream = await generateMeditationScript(mood);
      for await (const chunk of stream) {
        setScript((prev) => prev + chunk.text);
      }
    } catch (err) {
      console.error(err);
      setError('生成引導時發生錯誤，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  }, [mood, isLoading]);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 antialiased selection:bg-teal-300/70">
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-3xl flex flex-col items-center gap-8">
        <Header />
        <div className="w-full bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-xl">
          <MoodInput
            mood={mood}
            setMood={setMood}
            onSubmit={handleGenerateScript}
            isLoading={isLoading}
          />
          {script && !isLoading && <AudioPlayer script={script} />}
          <MeditationScript script={script} isLoading={isLoading} error={error} />
        </div>
        <footer className="text-center text-sm text-slate-400 dark:text-slate-500">
          <p>由 AI 生成，僅供參考。冥想時請注意自身感受。</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
