import React, { useRef, useState } from 'react';
import type { Model } from '../../types/index';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { AnimateOnScroll } from '../AnimateOnScroll';
import { OnPolicyDistillationFlow } from './OnPolicyDistillationFlow';
import { CHART_DIMENSIONS, CHART_PADDING } from '../../types/chart';
import { useLocale } from '../../contexts/LocaleContext';

interface Rio25OpenVLDetailProps {
  model: Model;
  onBack: () => void;
}

interface BenchmarkRow {
  benchmark: string;
  rio: string;
  qwen2: string;
  qwen4: string;
  qwen8: string;
  qwen30: string;
  isAverage?: boolean;
}

type ScoreKey = 'rio' | 'qwen2' | 'qwen4' | 'qwen8' | 'qwen30';
const SCORE_KEYS: ScoreKey[] = ['rio', 'qwen2', 'qwen4', 'qwen8', 'qwen30'];

const PARAMETER_DOMAIN_MIN = 1.8;
const PARAMETER_TICKS = [2, 4, 8, 30];
const PARAMETER_CHART_SCALE = 1.25;
const PARAMETER_CHART_DIMENSIONS = {
  width: Math.round(CHART_DIMENSIONS.width * PARAMETER_CHART_SCALE),
  height: Math.round(CHART_DIMENSIONS.height * PARAMETER_CHART_SCALE),
};
const PARAMETER_CHART_PADDING = {
  top: Math.round(CHART_PADDING.top * PARAMETER_CHART_SCALE),
  right: Math.round(CHART_PADDING.right * PARAMETER_CHART_SCALE),
  bottom: Math.round(CHART_PADDING.bottom * PARAMETER_CHART_SCALE),
  left: Math.round(CHART_PADDING.left * PARAMETER_CHART_SCALE),
};

type ParameterLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ParameterDatum {
  model: string;
  paramsB: number;
  score: number;
  color: string;
  labelPosition?: ParameterLabelPosition;
  isRio?: boolean;
}

interface ParameterComparisonChartProps {
  label: string;
  yMin: number;
  yMax: number;
  yTicks: number[];
  data: ParameterDatum[];
}

const BENCHMARK_ROWS: BenchmarkRow[] = [
  {
    benchmark: 'AI2D_test',
    rio: '88.5',
    qwen2: '80.4',
    qwen4: '84.9',
    qwen8: '84.9',
    qwen30: '86.9',
  },
  {
    benchmark: 'InfoVQA_test',
    rio: '87.4',
    qwen2: '77.1',
    qwen4: '83.0',
    qwen8: '86.0',
    qwen30: '86.0',
  },
  {
    benchmark: 'DocVQA_test',
    rio: '95.0',
    qwen2: '92.9',
    qwen4: '94.2',
    qwen8: '95.3',
    qwen30: '95.0',
  },
  {
    benchmark: 'CharXiv_reas.',
    rio: '58.1',
    qwen2: '37.1',
    qwen4: '50.3',
    qwen8: '53.0',
    qwen30: '56.6',
  },
  {
    benchmark: 'CharXiv_desc.',
    rio: '87.2',
    qwen2: '70.1',
    qwen4: '83.9',
    qwen8: '85.9',
    qwen30: '86.9',
  },
  {
    benchmark: 'ScienceQA',
    rio: '96.5',
    qwen2: '88.2',
    qwen4: '94.5',
    qwen8: '94.1',
    qwen30: '95.7',
  },
  {
    benchmark: 'MathVerse_mini',
    rio: '80.7',
    qwen2: '66.9',
    qwen4: '75.2',
    qwen8: '77.7',
    qwen30: '79.6',
  },
  {
    benchmark: 'MathVista_mini',
    rio: '83.2',
    qwen2: '73.6',
    qwen4: '79.5',
    qwen8: '81.4',
    qwen30: '81.9',
  },
  {
    benchmark: 'DynaMath_test',
    rio: '81.9',
    qwen2: '68.4',
    qwen4: '76.0',
    qwen8: '76.8',
    qwen30: '80.5',
  },
  {
    benchmark: 'LogicVista_test',
    rio: '69.0',
    qwen2: '49.9',
    qwen4: '63.2',
    qwen8: '66.2',
    qwen30: '64.9',
  },
  {
    benchmark: 'VisuLogic_test',
    rio: '30.2',
    qwen2: '26.5',
    qwen4: '25.1',
    qwen8: '27.0',
    qwen30: '25.8',
  },
  {
    benchmark: 'RWQA_test',
    rio: '76.7',
    qwen2: '70.5',
    qwen4: '73.4',
    qwen8: '74.2',
    qwen30: '77.0',
  },
  {
    benchmark: 'MMStar_test',
    rio: '73.2',
    qwen2: '68.1',
    qwen4: '73.2',
    qwen8: '75.3',
    qwen30: '75.5',
  },
  {
    benchmark: 'MMBench-EN',
    rio: '88.3',
    qwen2: '81.9',
    qwen4: '86.7',
    qwen8: '87.5',
    qwen30: '88.9',
  },
  {
    benchmark: 'Avg',
    rio: '78.3',
    qwen2: '68.0',
    qwen4: '74.5',
    qwen8: '76.1',
    qwen30: '77.2',
    isAverage: true,
  },
];

const avgRow = BENCHMARK_ROWS.find((row) => row.benchmark === 'Avg');

const AVERAGE_PARAMETER_DATA: ParameterDatum[] = avgRow
  ? [
      {
        model: 'Rio 2.5 Open VL',
        paramsB: 4,
        score: Number.parseFloat(avgRow.rio),
        color: '#1E40AF',
        labelPosition: 'top-right',
        isRio: true,
      },
      {
        model: 'Qwen3-VL 2B Thinking',
        paramsB: 2,
        score: Number.parseFloat(avgRow.qwen2),
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'Qwen3-VL 4B Thinking',
        paramsB: 4,
        score: Number.parseFloat(avgRow.qwen4),
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'Qwen3-VL 8B Thinking',
        paramsB: 8,
        score: Number.parseFloat(avgRow.qwen8),
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'Qwen3-VL 30B-A3B Thinking',
        paramsB: 30,
        score: Number.parseFloat(avgRow.qwen30),
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
    ]
  : [];

const getTopScores = (row: BenchmarkRow): Set<ScoreKey> => {
  const maxScore = Math.max(...SCORE_KEYS.map((key) => Number.parseFloat(row[key])));
  return new Set(
    SCORE_KEYS.filter((key) => Number.parseFloat(row[key]) === maxScore)
  );
};

const scoreCellClass = (isTopScore: boolean) =>
  isTopScore
    ? 'px-4 py-3 font-semibold text-emerald-700 bg-emerald-50 text-center'
    : 'px-4 py-3 text-prose text-center';

const formatParameterTick = (value: number) => `${value}B`;
const formatParameterValue = (value: number) => `${value}B`;

const formatScoreValue = (value: number) => {
  const formatted = value.toFixed(2);
  return formatted.replace(/\.?0+$/, '');
};

const ParameterComparisonChart: React.FC<ParameterComparisonChartProps> = ({
  label,
  yMin,
  yMax,
  yTicks,
  data,
}) => {
  const { isEnglish } = useLocale();
  const [hovered, setHovered] = useState<ParameterDatum | null>(null);
  const [pinned, setPinned] = useState<ParameterDatum | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { width, height } = PARAMETER_CHART_DIMENSIONS;
  const { top, right, bottom, left } = PARAMETER_CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(PARAMETER_DOMAIN_MIN);
  const logMax = Math.log10(PARAMETER_TICKS[PARAMETER_TICKS.length - 1] ?? 30);

  const getX = (value: number) => {
    const ratio = (Math.log10(value) - logMin) / Math.max(logMax - logMin, 1);
    return left + ratio * plotWidth;
  };

  const getY = (value: number) => {
    const ratio = (value - yMin) / Math.max(yMax - yMin, 1);
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
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-rio-primary">{label}</p>
      </div>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          className="h-[26rem] sm:h-[30rem] w-full overflow-visible"
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
                aria-label={`${item.model} - ${label} ${formatScoreValue(item.score)}, ${isEnglish ? 'parameters' : 'parâmetros'} ${formatParameterValue(item.paramsB)}`}
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
                <circle cx={x} cy={y} r={14} fill="transparent" className="pointer-events-auto" />
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
                      {isEnglish ? 'Average score' : 'Score médio'}
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

export const Rio25OpenVLDetail: React.FC<Rio25OpenVLDetailProps> = ({ model, onBack }) => {
  const { isEnglish } = useLocale();
  const huggingFaceWeightsUrl =
    model.huggingFaceUrl ?? 'https://huggingface.co/prefeitura-rio/Rio-2.5-Open-VL';

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
                <p className="text-lg text-prose-light leading-relaxed whitespace-pre-line">
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
                teacherName="Rio 2.5 Omni"
                studentName="Qwen 3 VL 4b"
                finalModelName={model.name}
              />
            </AnimateOnScroll>

            <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <ParameterComparisonChart
                  label={isEnglish ? 'Performance on Visual Benchmarks' : 'Desempenho em Benchmarks Visuais'}
                  yMin={65}
                  yMax={80}
                  yTicks={[65, 70, 75, 80]}
                  data={AVERAGE_PARAMETER_DATA}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-prose">Benchmark</th>
                    <th className="px-4 py-3 text-center font-semibold text-rio-primary">
                      Rio 2.5 Open VL
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      Qwen3-VL 2B Thinking
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      Qwen3-VL 4B Thinking
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      Qwen3-VL 8B Thinking
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      Qwen3-VL 30B-A3B Thinking
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_ROWS.map((row) => {
                    const topScores = getTopScores(row);
                    return (
                      <tr
                        key={row.benchmark}
                        className={`border-b border-slate-100 ${
                          row.isAverage ? 'bg-slate-50 font-semibold' : 'bg-white'
                        }`}
                      >
                        <th scope="row" className="px-4 py-3 text-left font-medium text-prose">
                          {row.benchmark}
                        </th>
                        <td className={scoreCellClass(topScores.has('rio'))}>{row.rio}</td>
                        <td className={scoreCellClass(topScores.has('qwen2'))}>{row.qwen2}</td>
                        <td className={scoreCellClass(topScores.has('qwen4'))}>{row.qwen4}</td>
                        <td className={scoreCellClass(topScores.has('qwen8'))}>{row.qwen8}</td>
                        <td className={scoreCellClass(topScores.has('qwen30'))}>{row.qwen30}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
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
