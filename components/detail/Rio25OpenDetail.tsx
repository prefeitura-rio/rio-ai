import React from 'react';
import type { Model } from '../../types/index';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import {
  ComparisonMetric,
  LabelOverride,
  ModelComparisonDatum,
} from '../../types/chart';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { MathBenchmarkResultsTable } from './MathBenchmarkResultsTable';
import { AnimateOnScroll } from '../AnimateOnScroll';
import { OnPolicyDistillationFlow } from './OnPolicyDistillationFlow';
import {
  ParameterBenchmarkComparisonChart,
  ParameterBenchmarkDatum,
} from './ParameterBenchmarkComparisonChart';
import { useLocale } from '../../contexts/LocaleContext';

interface Rio25OpenDetailProps {
  model: Model;
  onBack: () => void;
}

const LABEL_POSITION_OVERRIDES: Partial<Record<string, LabelOverride>> = {
  'Gemini 3 Pro': 'top-left',
  'GPT-5.2': 'bottom-right',
  'Gemini 3 Flash': 'bottom-right',
  'Claude Sonnet 4.5': 'bottom-left',
  'Gemini 2.5 Flash-Lite': { gpqa: 'bottom-right' },
  'GPT-5 mini': { aime: 'bottom-right' },
};

const MODEL_COMPARISON: ModelComparisonDatum[] = [
  { model: 'Gemini 3 Pro', cost: 12, gpqa: 91.9, aime: 95.0, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5.2', cost: 14, gpqa: 92.4, aime: 100.0, color: '#9CA3AF', isRio: false },
  { model: 'Rio 2.5 Open', cost: 0.1, gpqa: 77.2, aime: 93.33, color: '#1E40AF', isRio: true },
  { model: 'Gemini 3 Flash', cost: 3, gpqa: 90.4, aime: 95.2, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 mini', cost: 2, gpqa: 82.3, aime: 91.1, color: '#9CA3AF', isRio: false },
  { model: 'Gemini 2.5 Flash-Lite', cost: 0.4, gpqa: 71, aime: 69, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5 nano', cost: 0.4, gpqa: 71.2, aime: 85.2, color: '#9CA3AF', isRio: false },
  { model: 'Claude Sonnet 4.5', cost: 15, gpqa: 83.4, aime: 87, color: '#9CA3AF', isRio: false },
  { model: 'Claude Haiku 4.5', cost: 5, gpqa: 73, aime: 80.7, color: '#9CA3AF', isRio: false },
];

const METRIC_CONFIGS: Array<{
  metric: ComparisonMetric;
  label: string;
  yTicks: number[];
  minY?: number;
}> = [
    {
      metric: 'aime',
      label: 'AIME 2025',
      yTicks: [70, 80, 90, 100],
    },
    {
      metric: 'gpqa',
      label: 'GPQA-Diamond',
      yTicks: [70, 80, 90],
      minY: 67,
    },
  ];

const COMPOSITE_MATH_PARAMETER_DATA: ParameterBenchmarkDatum[] = [
  {
    model: 'Rio 2.5 Open',
    paramsB: 30,
    score: 87.53,
    color: '#1E40AF',
    isRio: true,
    labelPosition: 'top-left',
  },
  { model: 'Rio 3.0 Open', paramsB: 235, score: 91.78, color: '#1E40AF', isRio: true, labelPosition: 'top-left' },
  { model: 'Rio 3.0 Open Mini', paramsB: 4, score: 78.11, color: '#1E40AF', isRio: true, labelPosition: 'top-right' },
  { model: 'Qwen 3 235B A22B 2507', paramsB: 235, score: 86.83, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'Qwen 3 30B A3B 2507', paramsB: 30, score: 76.08, color: '#9CA3AF', labelPosition: 'top-right' },
  { model: 'Qwen 3 4B 2507', paramsB: 4, score: 71.12, color: '#9CA3AF', labelPosition: 'top-right' },
  { model: 'GPT OSS 120B', paramsB: 120, score: 89.17, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'GPT OSS 20B', paramsB: 20, score: 82.34, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'DeepSeek V3.2', paramsB: 671, score: 90.93, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'Kimi K2.5 Thinking', paramsB: 1000, score: 93.12, color: '#9CA3AF', labelPosition: 'top-left' },
];

export const Rio25OpenDetail: React.FC<Rio25OpenDetailProps> = ({ model, onBack }) => {
  const { isEnglish } = useLocale();
  const huggingFaceWeightsUrl =
    model.huggingFaceUrl ?? 'https://huggingface.co/krzonkalla/rio-2.5-preview-beta';

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-prose-light hover:text-rio-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEnglish ? 'Back to Open models' : 'Voltar para modelos Open'}
          </button>

          <div className="mt-6 space-y-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-6 lg:max-w-3xl">
                <h1 className="text-4xl font-bold leading-tight text-prose sm:text-5xl">
                  {model.name}
                </h1>
                <p className="whitespace-pre-line text-lg text-prose-light leading-relaxed">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
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

            <AnimateOnScroll>
              <OnPolicyDistillationFlow
                teacherName="Rio 2.5"
                studentName={model.baseModel ?? 'Qwen 3 30B 2507'}
                finalModelName={model.name}
              />
            </AnimateOnScroll>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <ParameterBenchmarkComparisonChart
                  label={isEnglish ? 'Performance on Math Benchmarks' : 'Desempenho em Benchmarks Matemáticos'}
                  yMin={70}
                  yMax={95}
                  yTicks={[70, 75, 80, 85, 90, 95]}
                  data={COMPOSITE_MATH_PARAMETER_DATA}
                />
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  {METRIC_CONFIGS.map((config) => (
                    <ComparisonChart
                      key={config.metric}
                      {...config}
                      data={MODEL_COMPARISON}
                      labelOverrides={LABEL_POSITION_OVERRIDES}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <MathBenchmarkResultsTable />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="space-y-12">
            {model.useCases && <DetailUseCases useCases={model.useCases} />}
            {model.codeSnippets && <DetailCodeSnippets snippets={model.codeSnippets} />}
          </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
};
