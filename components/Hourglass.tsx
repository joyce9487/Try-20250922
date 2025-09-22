import React from 'react';

interface HourglassProps {
  duration: number;
  state: 'playing' | 'paused' | 'stopped';
}

export const Hourglass: React.FC<HourglassProps> = ({ duration, state }) => {
  let sandContainerClassName = 'sand-container';
  if (state === 'playing') {
    sandContainerClassName += ' playing';
  } else if (state === 'paused') {
    sandContainerClassName += ' playing paused';
  }

  const animationStyle = {
    '--duration': `${duration}s`
  } as React.CSSProperties;

  return (
    <div className="w-20 h-32 text-teal-500 dark:text-teal-400" style={animationStyle}>
        <svg viewBox="0 0 100 150" className="w-full h-full" aria-hidden="true">
            {/* Glass Frame */}
            <path d="M 20 10 H 80 L 50 75 L 80 140 H 20 L 50 75 Z" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="3" fill="rgba(148, 163, 184, 0.1)" />
            <path d="M 20 10 H 80" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="3" fill="none" />
            <path d="M 20 140 H 80" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="3" fill="none" />
            
            {/* Sand - these parts will be animated */}
            <g className={sandContainerClassName}>
            {/* Top Sand - shrinks vertically */}
            <path
                className="sand-top"
                d="M 25 15 H 75 L 50 70 Z"
                fill="currentColor"
            />
            {/* Bottom Sand - grows vertically */}
            <path
                className="sand-bottom"
                d="M 25 135 H 75 L 50 80 Z"
                fill="currentColor"
            />
            {/* Falling Sand Stream */}
            <path
                className="sand-stream"
                d="M 50 70 V 80"
                stroke="currentColor"
                strokeWidth="2"
            />
            </g>
        </svg>
    </div>
  );
};
