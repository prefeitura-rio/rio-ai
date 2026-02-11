import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { HeroTitleAnimation } from './HeroTitleAnimation';
import type { View } from '../types/index';
import { useLocale } from '../contexts/LocaleContext';

interface HeroProps {
  onNavigate?: (view: View) => void;
  onAnimationComplete?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onAnimationComplete }) => {
  const { isEnglish } = useLocale();

  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <HeroTitleAnimation onComplete={onAnimationComplete} />
        <AnimateOnScroll delay={200}>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-prose-light sm:text-xl md:text-2xl">
            {isEnglish ? 'Introducing our smartest models,' : 'Apresentando nossos modelos mais inteligentes,'}
            <br className="hidden sm:block" />
            {isEnglish
              ? 'built to power the city\'s future.'
              : 'desenvolvidos para impulsionar o futuro da cidade.'}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={400}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate?.('opensource')}
              className="group relative inline-flex h-[67px] min-w-[227px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(90deg,#3C36B9_0%,#42AFE1_100%)] px-8 text-base font-semibold text-white shadow-[0_8px_18px_rgba(60,54,185,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(60,54,185,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rio-primary"
            >
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative z-10">{isEnglish ? 'Explore models' : 'Conheça os modelos'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('chat')}
              className="group relative inline-flex h-[67px] min-w-[227px] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(90deg,#42AFE1_0%,#3C36B9_100%)] p-px shadow-[0_8px_18px_rgba(47,95,190,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(47,95,190,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rio-primary"
            >
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.45)_50%,transparent_75%)] transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-[#2F5FBE] transition-colors duration-300 group-hover:bg-[#F7FBFF]">
                {isEnglish ? 'Chat with Rio 3' : 'Converse com o Rio 3'}
              </span>
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
