import React from 'react';
import type { Model } from '../../types/index';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

interface DetailHeaderProps {
  model: Model;
  onBack: () => void;
  huggingFaceWeightsUrl?: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  model,
  onBack,
  huggingFaceWeightsUrl,
}) => {
  const { isEnglish } = useLocale();

  return (
    <header className="bg-light-bg border-b border-slate-200 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEnglish ? 'Back to Open models' : 'Voltar para modelos Open'}
          </button>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-prose">{model.name}</h1>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-lg text-prose-light">
              {model.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {huggingFaceWeightsUrl && (
            <a
              href={huggingFaceWeightsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-prose shadow-sm transition hover:border-rio-primary/50 hover:text-rio-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:self-start"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <img
                  src="/logos/huggingface-2.svg"
                  alt={isEnglish ? 'Hugging Face logo' : 'Logomarca do Hugging Face'}
                  className="h-6 w-6"
                />
              </span>
              <span className="text-base">{isEnglish ? 'Access weights' : 'Acessar pesos'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
