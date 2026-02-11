import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface ThinkingAnimationProps {
  modelName?: string;
}

/**
 * A minimal, elegant thinking indicator inspired by Jony Ive's design philosophy.
 * 
 * Design principles:
 * - Disappear into the experience — feels like a natural pause, not an interruption
 * - Communicate without demanding attention — subtle presence that says "working"
 * - Match the surrounding typography and color language
 * - Breathe — gentle, organic rhythm that feels alive but calm
 */
export const ThinkingAnimation: React.FC<ThinkingAnimationProps> = () => {
  const { isEnglish } = useLocale();

  return (
    <div className="flex justify-start">
      <span className="text-[14px] leading-relaxed text-slate-400 animate-thinking-pulse">
        {isEnglish ? 'Thinking...' : 'Pensando...'}
      </span>
    </div>
  );
};
