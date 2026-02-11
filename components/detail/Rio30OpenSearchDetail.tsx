import React, { useRef, useState } from 'react';
import type { Model } from '../../types/index';
import { DetailHeader } from './DetailHeader';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { AnimateOnScroll } from '../AnimateOnScroll';
import { OnPolicyDistillationFlow } from './OnPolicyDistillationFlow';
import { CHART_DIMENSIONS, CHART_PADDING } from '../../types/chart';
import { useLocale } from '../../contexts/LocaleContext';

interface Rio30OpenSearchDetailProps {
  model: Model;
  onBack: () => void;
}

interface BenchmarkScoreRow {
  benchmark: string;
  rioWithContextManagement: string;
  rioWithoutContextManagement: string;
  kimiK25: string;
  deepSeekV32: string;
  glm47: string;
  miniMaxM21: string;
  tongyiDeepResearch30BA3B: string;
  step35Flash: string;
  isAverage?: boolean;
}

type ScoreKey =
  | 'rioWithContextManagement'
  | 'rioWithoutContextManagement'
  | 'kimiK25'
  | 'deepSeekV32'
  | 'glm47'
  | 'miniMaxM21'
  | 'tongyiDeepResearch30BA3B'
  | 'step35Flash';

type BenchmarkLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface BenchmarkChartDatum {
  model: string;
  sizeB: number;
  score: number;
  color: string;
  isRio?: boolean;
  labelPosition?: BenchmarkLabelPosition;
}

const SCORE_KEYS: ScoreKey[] = [
  'rioWithContextManagement',
  'rioWithoutContextManagement',
  'kimiK25',
  'deepSeekV32',
  'glm47',
  'miniMaxM21',
  'tongyiDeepResearch30BA3B',
  'step35Flash',
];

const BENCHMARK_BASE_ROWS: BenchmarkScoreRow[] = [
  {
    benchmark: "Humanity's Last Exam",
    rioWithContextManagement: '42.5',
    rioWithoutContextManagement: '36.7',
    kimiK25: '50.2',
    deepSeekV32: '40.8',
    glm47: '42.8',
    miniMaxM21: '38.9',
    tongyiDeepResearch30BA3B: '32.9',
    step35Flash: '38.6',
  },
  {
    benchmark: 'GAIA',
    rioWithContextManagement: '85.2',
    rioWithoutContextManagement: '80.7',
    kimiK25: '75.9',
    deepSeekV32: '75.1',
    glm47: '61.9',
    miniMaxM21: '64.3',
    tongyiDeepResearch30BA3B: '70.9',
    step35Flash: '84.5',
  },
  {
    benchmark: 'BrowseComp',
    rioWithContextManagement: '75.1',
    rioWithoutContextManagement: '58.2',
    kimiK25: '74.9',
    deepSeekV32: '67.6',
    glm47: '67.5',
    miniMaxM21: '62.0',
    tongyiDeepResearch30BA3B: '43.4',
    step35Flash: '69.0',
  },
  {
    benchmark: 'BrowseComp-ZH',
    rioWithContextManagement: '77.4',
    rioWithoutContextManagement: '67.3',
    kimiK25: '76.4',
    deepSeekV32: '65.0',
    glm47: '66.6',
    miniMaxM21: '63.8',
    tongyiDeepResearch30BA3B: '46.7',
    step35Flash: '73.7',
  },
];

const buildAverageScoreRow = (rows: BenchmarkScoreRow[]): BenchmarkScoreRow => {
  const averageByKey = (key: ScoreKey) => {
    const scores = rows
      .map((row) => Number.parseFloat(row[key]))
      .filter((value) => Number.isFinite(value));

    if (scores.length === 0) {
      return '0.0';
    }

    const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    return average.toFixed(1);
  };

  return {
    benchmark: 'Avg',
    rioWithContextManagement: averageByKey('rioWithContextManagement'),
    rioWithoutContextManagement: averageByKey('rioWithoutContextManagement'),
    kimiK25: averageByKey('kimiK25'),
    deepSeekV32: averageByKey('deepSeekV32'),
    glm47: averageByKey('glm47'),
    miniMaxM21: averageByKey('miniMaxM21'),
    tongyiDeepResearch30BA3B: averageByKey('tongyiDeepResearch30BA3B'),
    step35Flash: averageByKey('step35Flash'),
    isAverage: true,
  };
};

const BENCHMARK_SCORE_ROWS: BenchmarkScoreRow[] = [
  ...BENCHMARK_BASE_ROWS,
  buildAverageScoreRow(BENCHMARK_BASE_ROWS),
];

const parseScore = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getTopScores = (row: BenchmarkScoreRow): Set<ScoreKey> => {
  const validScores = SCORE_KEYS.map((key) => ({
    key,
    score: parseScore(row[key]),
  })).filter((item): item is { key: ScoreKey; score: number } => item.score !== null);

  if (validScores.length === 0) {
    return new Set<ScoreKey>();
  }

  const maxScore = Math.max(...validScores.map((item) => item.score));
  return new Set(
    validScores.filter((item) => item.score === maxScore).map((item) => item.key)
  );
};

const scoreCellClass = (isTopScore: boolean) =>
  isTopScore
    ? 'px-4 py-3 font-semibold text-emerald-700 bg-emerald-50 whitespace-nowrap text-center'
    : 'px-4 py-3 text-prose whitespace-nowrap text-center';

const SIZE_DOMAIN_MIN = 25;
const SIZE_DOMAIN_MAX = 1000;
const SIZE_TICKS = [30, 100, 300, 1000];

const avgScoreRow = BENCHMARK_SCORE_ROWS.find((row) => row.isAverage);

const AVERAGE_SIZE_DATA: BenchmarkChartDatum[] = avgScoreRow
  ? [
      {
        model: 'Rio 3.0 Open Search',
        sizeB: 235,
        score: Number.parseFloat(avgScoreRow.rioWithContextManagement),
        color: '#1E40AF',
        isRio: true,
        labelPosition: 'top-left',
      },
      {
        model: 'Kimi K2.5 Thinking',
        sizeB: 1000,
        score: Number.parseFloat(avgScoreRow.kimiK25),
        color: '#9CA3AF',
        labelPosition: 'top-left',
      },
      {
        model: 'DeepSeek V3.2',
        sizeB: 671,
        score: Number.parseFloat(avgScoreRow.deepSeekV32),
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
      {
        model: 'GLM 4.7',
        sizeB: 355,
        score: Number.parseFloat(avgScoreRow.glm47),
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'MiniMax-M2.1',
        sizeB: 230,
        score: Number.parseFloat(avgScoreRow.miniMaxM21),
        color: '#9CA3AF',
        labelPosition: 'bottom-left',
      },
      {
        model: 'Tongyi DeepResearch',
        sizeB: 30,
        score: Number.parseFloat(avgScoreRow.tongyiDeepResearch30BA3B),
        color: '#9CA3AF',
        labelPosition: 'top-right',
      },
      {
        model: 'Step 3.5 Flash',
        sizeB: 196,
        score: Number.parseFloat(avgScoreRow.step35Flash),
        color: '#9CA3AF',
        labelPosition: 'bottom-right',
      },
    ]
  : [];

interface AverageSizeComparisonChartProps {
  label: string;
  yMin: number;
  yMax: number;
  yTicks: number[];
  data: BenchmarkChartDatum[];
}

const AVERAGE_CHART_SCALE = 1.25;
const AVERAGE_CHART_DIMENSIONS = {
  width: Math.round(CHART_DIMENSIONS.width * AVERAGE_CHART_SCALE),
  height: Math.round(CHART_DIMENSIONS.height * AVERAGE_CHART_SCALE),
};
const AVERAGE_CHART_PADDING = {
  top: Math.round(CHART_PADDING.top * AVERAGE_CHART_SCALE),
  right: Math.round(CHART_PADDING.right * AVERAGE_CHART_SCALE),
  bottom: Math.round(CHART_PADDING.bottom * AVERAGE_CHART_SCALE),
  left: Math.round(CHART_PADDING.left * AVERAGE_CHART_SCALE),
};

const formatAverageSizeTick = (value: number) => (value >= 1000 ? '1T' : `${value}B`);
const formatAverageSizeValue = (value: number) => (value >= 1000 ? '1T' : `${value}B`);

const formatAverageScoreValue = (value: number) => {
  const formatted = value.toFixed(2);
  return formatted.replace(/\.?0+$/, '');
};

const AverageSizeComparisonChart: React.FC<AverageSizeComparisonChartProps> = ({
  label,
  yMin,
  yMax,
  yTicks,
  data,
}) => {
  const { isEnglish } = useLocale();
  const [hovered, setHovered] = useState<BenchmarkChartDatum | null>(null);
  const [pinned, setPinned] = useState<BenchmarkChartDatum | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { width, height } = AVERAGE_CHART_DIMENSIONS;
  const { top, right, bottom, left } = AVERAGE_CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(SIZE_DOMAIN_MIN);
  const logMax = Math.log10(SIZE_DOMAIN_MAX);

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
        pointX: getX(activeDatum.sizeB),
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

  const handleHover = (item: BenchmarkChartDatum) => {
    if (pinned) return;
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
    }
    setHovered(item);
  };

  const handlePin = (item: BenchmarkChartDatum) => {
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

          {SIZE_TICKS.map((tick) => {
            const x = getX(tick);
            return (
              <text
                key={`${label}-x-${tick}`}
                x={x}
                y={height - bottom + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                {formatAverageSizeTick(tick)}
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
            const x = getX(item.sizeB);
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
            const stroke = item.color;
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
                aria-label={`${item.model} - ${label} ${formatAverageScoreValue(item.score)}, ${isEnglish ? 'parameters' : 'parâmetros'} ${formatAverageSizeValue(item.sizeB)}`}
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
                      {formatAverageScoreValue(activeDatum.score)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {isEnglish ? 'Parameters' : 'Parâmetros'}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {formatAverageSizeValue(activeDatum.sizeB)}
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

export const Rio30OpenSearchDetail: React.FC<Rio30OpenSearchDetailProps> = ({
  model,
  onBack,
}) => {
  const { isEnglish } = useLocale();
  const huggingFaceWeightsUrl =
    model.huggingFaceUrl ?? 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Search';

  return (
    <div className="bg-white">
      <AnimateOnScroll>
        <DetailHeader
          model={model}
          onBack={onBack}
          huggingFaceWeightsUrl={huggingFaceWeightsUrl}
        />
      </AnimateOnScroll>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <AnimateOnScroll>
          <OnPolicyDistillationFlow
            teacherName="Rio 3.0 Preview"
            studentName="Qwen 3 235B 2507"
            finalModelName={model.name}
          />
        </AnimateOnScroll>

        {AVERAGE_SIZE_DATA.length > 0 && (
          <AnimateOnScroll>
            <section className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rio-primary/10 blur-2xl" />
              </div>
              <div className="relative flex h-full flex-col gap-6">
                <AverageSizeComparisonChart
                  label={isEnglish ? 'Performance on Search Benchmarks' : 'Desempenho em Benchmarks de Busca'}
                  yMin={45}
                  yMax={75}
                  yTicks={[45, 50, 55, 60, 65, 70, 75]}
                  data={AVERAGE_SIZE_DATA}
                />
              </div>
            </section>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-prose whitespace-nowrap">
                      Benchmark
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-rio-primary">
                      Rio 3.0 Open Search
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      <span className="whitespace-nowrap">Rio 3.0 Open Search</span>
                      <br />
                      <span className="whitespace-nowrap">(w/o context management)</span>
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">Kimi K2.5</th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">DeepSeek V3.2</th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">GLM 4.7</th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">MiniMax-M2.1</th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">
                      Tongyi DeepResearch
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-prose">Step 3.5 Flash</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_SCORE_ROWS.map((row) => {
                    const topScores = getTopScores(row);
                    return (
                      <tr
                        key={row.benchmark}
                        className={`border-b border-slate-100 ${
                          row.isAverage ? 'bg-slate-50 font-semibold' : 'bg-white'
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 text-left font-medium text-prose whitespace-nowrap"
                        >
                          {row.benchmark}
                        </th>
                        <td className={scoreCellClass(topScores.has('rioWithContextManagement'))}>
                          {row.rioWithContextManagement}
                        </td>
                        <td className={scoreCellClass(topScores.has('rioWithoutContextManagement'))}>
                          {row.rioWithoutContextManagement}
                        </td>
                        <td className={scoreCellClass(topScores.has('kimiK25'))}>{row.kimiK25}</td>
                        <td className={scoreCellClass(topScores.has('deepSeekV32'))}>
                          {row.deepSeekV32}
                        </td>
                        <td className={scoreCellClass(topScores.has('glm47'))}>{row.glm47}</td>
                        <td className={scoreCellClass(topScores.has('miniMaxM21'))}>
                          {row.miniMaxM21}
                        </td>
                        <td className={scoreCellClass(topScores.has('tongyiDeepResearch30BA3B'))}>
                          {row.tongyiDeepResearch30BA3B}
                        </td>
                        <td className={scoreCellClass(topScores.has('step35Flash'))}>
                          {row.step35Flash}
                        </td>
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
