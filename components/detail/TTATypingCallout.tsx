import React, { useEffect, useRef, useState } from 'react';
import { useLocale } from '../../contexts/LocaleContext';

const PHRASES_PT = [
  'Mas o que são 1 bilhão de tokens?',
  'Se escrevêssemos cada token lado a lado em folhas de papel, eles percorreriam um quarto da circunferência do planeta.',
  'Isso equivale à distância entre ...',
];

const PHRASES_EN = [
  'But what is 1 billion tokens?',
  "If we wrote every token side by side on sheets of paper, they would span a quarter of the planet's circumference.",
  'That is equivalent to the distance between ...',
];

export const TTATypingCallout: React.FC = () => {
  const { isEnglish } = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const phrases = isEnglish ? PHRASES_EN : PHRASES_PT;

  useEffect(() => {
    if (hasStarted) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;

    const fullText = phrases[phraseIndex] ?? '';

    if (!isDeleting && displayText === fullText) {
      if (phraseIndex === phrases.length - 1) {
        setIsComplete(true);
        return;
      }
      const pause = window.setTimeout(() => setIsDeleting(true), 1100);
      return () => window.clearTimeout(pause);
    }

    if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => prev + 1);
      return;
    }

    const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1;
    const stepDelay = isDeleting ? 26 : 38;
    const tick = window.setTimeout(() => {
      setDisplayText(fullText.slice(0, nextLength));
    }, stepDelay);

    return () => window.clearTimeout(tick);
  }, [displayText, hasStarted, isDeleting, isComplete, phraseIndex, phrases]);

  useEffect(() => {
    if (!isComplete) return;
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('tta-typewriter-complete'));
  }, [isComplete]);

  return (
    <div ref={containerRef} className="my-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <p className="text-center text-2xl font-semibold leading-snug tracking-tight text-slate-900 whitespace-normal break-words md:text-3xl">
            <span>{displayText}</span>
            {!isComplete && (
              <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-rio-primary align-[-0.15em]" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
