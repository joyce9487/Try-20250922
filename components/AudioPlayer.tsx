import React, { useState, useEffect, useCallback } from 'react';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { StopIcon } from './icons/StopIcon';
import { ReplayIcon } from './icons/ReplayIcon';
import { Hourglass } from './Hourglass';

interface AudioPlayerProps {
  script: string;
}

// Average characters per second for Mandarin speech for duration estimation
const CHARS_PER_SECOND = 3.8;

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ script }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [animationState, setAnimationState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [duration, setDuration] = useState(0);
  const [animationKey, setAnimationKey] = useState(Date.now());


  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!script) {
        return;
    }
    
    // Estimate duration for animation
    const estimatedDuration = Math.max(1, script.length / CHARS_PER_SECOND);
    setDuration(estimatedDuration);
    setAnimationState('stopped'); // Reset on new script
    setAnimationKey(Date.now()); // Force re-render of hourglass with fresh state

    const u = new SpeechSynthesisUtterance(script);
    u.lang = 'zh-TW';
    u.rate = 0.9;
    u.pitch = 1;

    const setVoice = () => {
        const voices = synth.getVoices();
        const mandarinVoice = voices.find(voice => voice.lang.includes('zh-TW') || voice.lang.includes('zh-CN'));
        if (mandarinVoice) {
            u.voice = mandarinVoice;
        }
    };

    setVoice();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }

    u.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setAnimationState('playing');
    };

    u.onpause = () => {
      setIsSpeaking(true);
      setIsPaused(true);
      setAnimationState('paused');
    };

    u.onresume = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setAnimationState('playing');
    };

    u.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setAnimationState('stopped');
    };
    
    setUtterance(u);

    // Cleanup function
    return () => {
      synth.cancel();
      synth.onvoiceschanged = null;
      setIsSpeaking(false);
      setIsPaused(false);
      setAnimationState('stopped');
    };
  }, [script]);

  const handlePlayPause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!utterance) return;

    if (isSpeaking && !isPaused) { // is playing, so pause
      synth.pause();
    } else if (isSpeaking && isPaused) { // is paused, so resume
      synth.resume();
    } else { // not speaking, so start
      synth.cancel();
      setAnimationKey(Date.now()); // Reset animation by changing key
      // A small delay to allow the DOM to update with the new key before playing
      setTimeout(() => {
          synth.speak(utterance);
      }, 50);
    }
  }, [utterance, isSpeaking, isPaused]);

  const handleStop = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    // onend is not guaranteed to fire on cancel, so we manually set state
    setIsSpeaking(false);
    setIsPaused(false);
    setAnimationState('stopped');
    setAnimationKey(Date.now());
  }, []);

  const handleReplay = useCallback(() => {
      const synth = window.speechSynthesis;
      if (!utterance) return;
      synth.cancel();
      setAnimationKey(Date.now());
      // Need a slight delay to ensure cancel finishes and DOM updates before speaking again
      setTimeout(() => synth.speak(utterance), 100);
  }, [utterance]);

  const baseButtonClass = "p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-teal-500";
  const enabledButtonClass = "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300";
  const disabledButtonClass = "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed";

  return (
    <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <SpeakerIcon className="w-6 h-6 text-teal-500" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">收聽引導</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">點擊播放，讓 AI 引導您進入冥想</p>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={handlePlayPause} className={`${baseButtonClass} ${!script ? disabledButtonClass : enabledButtonClass}`} disabled={!script} aria-label={isSpeaking && !isPaused ? "Pause" : "Play"}>
                {isSpeaking && !isPaused ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
             <button onClick={handleStop} className={`${baseButtonClass} ${!isSpeaking ? disabledButtonClass : enabledButtonClass}`} disabled={!isSpeaking} aria-label="Stop">
                <StopIcon className="w-6 h-6" />
            </button>
             <button onClick={handleReplay} className={`${baseButtonClass} ${!script ? disabledButtonClass : enabledButtonClass}`} disabled={!script} aria-label="Replay">
                <ReplayIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Hourglass key={animationKey} duration={duration} state={animationState} />
      </div>
    </div>
  );
};