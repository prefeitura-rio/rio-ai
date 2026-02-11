import React, { useRef, useState } from 'react';
import type { Model } from '../../types/index';
import {
  ArrowLeft,
  ArrowUpRight,
} from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import {
  ComparisonMetric,
  LabelOverride,
  ModelComparisonDatum,
  CHART_DIMENSIONS,
  CHART_PADDING,
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

interface Rio30OpenDetailProps {
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

const MIN_COST = 0.3;

const MODEL_COMPARISON: ModelComparisonDatum[] = [
  { model: 'Gemini 3 Pro', cost: 12, gpqa: 91.9, aime: 95.0, color: '#9CA3AF', isRio: false },
  { model: 'GPT-5.2', cost: 14, gpqa: 92.4, aime: 100.0, color: '#9CA3AF', isRio: false },
  { model: 'Rio 3.0 Open', cost: 0.4, gpqa: 85.1, aime: 96.67, color: '#1E40AF', isRio: true },
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
  { model: 'Rio 2.5 Open', paramsB: 30, score: 87.53, color: '#1E40AF', isRio: true, labelPosition: 'top-left' },
  {
    model: 'Rio 3.0 Open',
    paramsB: 235,
    score: 91.78,
    color: '#1E40AF',
    isRio: true,
    labelPosition: 'top-left',
  },
  { model: 'Rio 3.0 Open Mini', paramsB: 4, score: 78.11, color: '#1E40AF', isRio: true, labelPosition: 'top-right' },
  { model: 'Qwen 3 235B A22B 2507', paramsB: 235, score: 86.83, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'Qwen 3 30B A3B 2507', paramsB: 30, score: 76.08, color: '#9CA3AF', labelPosition: 'top-right' },
  { model: 'Qwen 3 4B 2507', paramsB: 4, score: 71.12, color: '#9CA3AF', labelPosition: 'top-right' },
  { model: 'GPT OSS 120B', paramsB: 120, score: 89.17, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'GPT OSS 20B', paramsB: 20, score: 82.34, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'DeepSeek V3.2', paramsB: 671, score: 90.93, color: '#9CA3AF', labelPosition: 'bottom-right' },
  { model: 'Kimi K2.5 Thinking', paramsB: 1000, score: 93.12, color: '#9CA3AF', labelPosition: 'top-left' },
];

const PARAMETER_TICKS = [100, 235, 357, 685, 1000];

type ParameterLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ParameterDatum {
  model: string;
  paramsB: number;
  score: number;
  color: string;
  labelPosition?: ParameterLabelPosition;
  isRio?: boolean;
}

interface EmptyParameterChartProps {
  label: string;
  yMax: number;
  yTicks: number[];
  data: ParameterDatum[];
}

const formatParameterTick = (value: number) => {
  if (value >= 1000) return '1T';
  return `${value}B`;
};

const formatParameterValue = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}T`;
  return `${value}B`;
};

const formatScoreValue = (value: number) => {
  const formatted = value.toFixed(2);
  return formatted.replace(/\.?0+$/, '');
};

const EmptyParameterChart: React.FC<EmptyParameterChartProps> = ({ label, yMax, yTicks, data }) => {
  const { isEnglish } = useLocale();
  const [hovered, setHovered] = useState<ParameterDatum | null>(null);
  const [pinned, setPinned] = useState<ParameterDatum | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { width, height } = CHART_DIMENSIONS;
  const { top, right, bottom, left } = CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(PARAMETER_TICKS[0] ?? 1);
  const logMax = Math.log10(PARAMETER_TICKS[PARAMETER_TICKS.length - 1] ?? 1000);

  const getX = (value: number) => {
    const ratio = (Math.log10(value) - logMin) / Math.max(logMax - logMin, 1);
    return left + ratio * plotWidth;
  };

  const getY = (value: number) => {
    const ratio = value / Math.max(yMax, 1);
    return height - bottom - ratio * plotHeight;
  };

  const activeDatum = pinned ?? hovered;
  const tooltipMetrics = activeDatum
    ? {
        pointX: getX(activeDatum.paramsB),
        pointY: getY(activeDatum.score),
      }
    : null;

  const tooltipBox = (() => {
    if (!tooltipMetrics || !activeDatum) return null;
    const tooltipWidth = 248;
    const tooltipHeight = 94;
    const tooltipGap = 22;
    const xMin = left;
    const xMax = width - right - tooltipWidth;
    const clampedX = Math.min(Math.max(tooltipMetrics.pointX - tooltipWidth / 2, xMin), xMax);
    const clampedY = tooltipMetrics.pointY - tooltipHeight - tooltipGap;
    return {
      ...tooltipMetrics,
      boxX: clampedX,
      boxY: clampedY,
      width: tooltipWidth,
      height: tooltipHeight,
    };
  })();
  const tooltipLabel = label === "Humanity's Last Exam" ? 'HLE' : label;

  const scheduleClearHover = () => {
    if (pinned) return;
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = window.setTimeout(() => {
      setHovered(null);
    }, 90);
  };

  const handleHover = (item: ParameterDatum) => {
    if (pinned) return;
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
    }
    setHovered(item);
  };

  const handlePin = (item: ParameterDatum) => {
    if (pinned?.model === item.model) {
      setPinned(null);
      return;
    }
    setPinned(item);
    setHovered(null);
  };

  return (
    <div className="rounded-3xl bg-white/80 p-4 sm:p-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-rio-primary">
          {label}
        </p>
      </div>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          className="h-80 w-full overflow-visible"
          onMouseLeave={scheduleClearHover}
          onClick={() => {
            setPinned(null);
            setHovered(null);
          }}
        >
          <line
            x1={left}
            y1={height - bottom}
            x2={width - right}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />
          <line
            x1={left}
            y1={top}
            x2={left}
            y2={height - bottom}
            className="stroke-slate-300"
            strokeWidth={1}
          />

          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <text
                key={`${label}-y-${tick}`}
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-500"
              >
                {tick}
              </text>
            );
          })}

          {PARAMETER_TICKS.map((tick) => {
            const x = getX(tick);
            return (
              <text
                key={`${label}-x-${tick}`}
                x={x}
                y={height - bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                {formatParameterTick(tick)}
              </text>
            );
          })}

          <text
            x={(left + width - right) / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-[11px] fill-slate-400"
          >
            {isEnglish ? 'Model parameters' : 'Parâmetros do modelo'}
          </text>

          {data.map((item) => {
            const x = getX(item.paramsB);
            const y = getY(item.score);
            const position = item.labelPosition ?? 'top-right';
            const offset = {
              'top-right': { dx: 10, dy: -8, anchor: 'start' as const },
              'top-left': { dx: -10, dy: -8, anchor: 'end' as const },
              'bottom-right': { dx: 10, dy: 16, anchor: 'start' as const },
              'bottom-left': { dx: -10, dy: 16, anchor: 'end' as const },
            }[position];
            const radius = item.isRio ? 7 : 5;
            const isHovered = hovered?.model === item.model;
            const isPinned = pinned?.model === item.model;
            const isActive = isHovered || isPinned;
            const shouldFade = (Boolean(hovered) || Boolean(pinned)) && !isActive;
            const circleRadius = radius + (isActive ? 2 : 0);
            const strokeWidth = item.isRio ? 2.5 : 1.5;
            const fill = item.isRio ? item.color : '#ffffff';
            const stroke = item.isRio ? item.color : item.color;
            const labelX = x + offset.dx;
            const labelY = y + offset.dy;
            const isBelow = offset.dy >= 0;
            const lineStartX = x + (offset.anchor === 'end' ? -radius : radius);
            const lineStartY = y + (isBelow ? radius : -radius);
            const targetX = labelX;
            const targetY = labelY - (isBelow ? 2 : 4);
            const dxLine = targetX - lineStartX;
            const dyLine = targetY - lineStartY;
            const lineLength = Math.hypot(dxLine, dyLine);
            const shorten = 4;
            const scale = lineLength > shorten ? (lineLength - shorten) / lineLength : 0;
            const lineEndX = lineStartX + dxLine * scale;
            const lineEndY = lineStartY + dyLine * scale;
            return (
              <g
                key={`${label}-${item.model}`}
                className="cursor-pointer outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${item.model} - ${tooltipLabel} ${formatScoreValue(item.score)}, ${isEnglish ? 'parameters' : 'parâmetros'} ${formatParameterValue(item.paramsB)}`}
                onMouseEnter={() => handleHover(item)}
                onFocus={() => handleHover(item)}
                onMouseLeave={scheduleClearHover}
                onBlur={scheduleClearHover}
                onClick={(event) => {
                  event.stopPropagation();
                  handlePin(item);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handlePin(item);
                  }
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="transparent"
                  className="pointer-events-auto"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={circleRadius + (item.isRio ? 1 : 0)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  opacity={shouldFade ? 0.4 : 1}
                />
                <line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineEndX}
                  y2={lineEndY}
                  className="stroke-slate-300"
                  strokeWidth={1}
                  opacity={shouldFade ? 0.5 : 1}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={offset.anchor}
                  className="text-[11px] font-semibold fill-slate-700"
                  opacity={shouldFade ? 0.5 : 1}
                >
                  {item.model}
                </text>
              </g>
            );
          })}

          {tooltipBox && activeDatum && (
            <>
              <line
                x1={tooltipBox.pointX}
                y1={tooltipBox.pointY}
                x2={tooltipBox.pointX}
                y2={tooltipBox.boxY + tooltipBox.height}
                className="stroke-slate-300"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <foreignObject
                x={tooltipBox.boxX}
                y={tooltipBox.boxY}
                width={tooltipBox.width}
                height={tooltipBox.height}
                pointerEvents="none"
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: activeDatum.color ?? '#94A3B8' }}
                      />
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {activeDatum.model}
                      </p>
                    </div>
                    {activeDatum.isRio && (
                      <span className="rounded-full bg-rio-primary/10 px-2 py-0.5 text-[10px] font-semibold text-rio-primary">
                        RIO
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {tooltipLabel}
                    </span>
                    <span className="text-sm font-semibold text-rio-primary">
                      {formatScoreValue(activeDatum.score)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {isEnglish ? 'Parameters' : 'Parâmetros'}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatParameterValue(activeDatum.paramsB)}
                    </span>
                  </div>
                </div>
              </foreignObject>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

const PARAMETER_BENCHMARKS: Record<'hle' | 'matharena', ParameterDatum[]> = {
  hle: [
    { model: 'Kimi K2.5 Thinking', paramsB: 1000, score: 30.1, color: '#9CA3AF', labelPosition: 'bottom-left' },
    { model: 'GLM 4.7', paramsB: 357, score: 24.8, color: '#9CA3AF' },
    { model: 'gpt-oss-120b (high)', paramsB: 120, score: 14.9, color: '#9CA3AF' },
    { model: 'Qwen3-235B-Thinking-2507', paramsB: 235, score: 18.2, color: '#9CA3AF' },
    { model: 'DeepSeek V3.2', paramsB: 671, score: 25.1, color: '#9CA3AF' },
    { model: 'Rio 3.0 Open', paramsB: 235, score: 25.2, color: '#1E40AF', isRio: true },
  ],
  matharena: [
    { model: 'Kimi K2.5 Thinking', paramsB: 1000, score: 8.85, color: '#9CA3AF', labelPosition: 'top-left' },
    { model: 'GLM 4.7', paramsB: 357, score: 3.3, color: '#9CA3AF' },
    { model: 'gpt-oss-120b (high)', paramsB: 120, score: 1.04, color: '#9CA3AF' },
    { model: 'Qwen3-235B-Thinking-2507', paramsB: 235, score: 5.21, color: '#9CA3AF' },
    { model: 'DeepSeek V3.2', paramsB: 671, score: 2.08, color: '#9CA3AF' },
    { model: 'Rio 3.0 Open', paramsB: 235, score: 9.17, color: '#1E40AF', isRio: true },
  ],
};

export const Rio30OpenDetail: React.FC<Rio30OpenDetailProps> = ({ model, onBack }) => {
  const { isEnglish } = useLocale();
  const huggingFaceWeightsUrl = model.huggingFaceUrl;

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
                teacherName="Rio 3.0 Preview"
                studentName="Qwen 3 235B 2507"
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
                      minCost={MIN_COST}
                    />
                  ))}
                  <EmptyParameterChart
                    label="Humanity's Last Exam"
                    yMax={30}
                    yTicks={[10, 20, 30]}
                    data={PARAMETER_BENCHMARKS.hle}
                  />
                  <EmptyParameterChart
                    label="MathArena Apex"
                    yMax={15}
                    yTicks={[5, 10, 15]}
                    data={PARAMETER_BENCHMARKS.matharena}
                  />
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

