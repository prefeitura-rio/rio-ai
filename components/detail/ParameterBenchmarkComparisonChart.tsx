import React, { useRef, useState } from 'react';
import { CHART_DIMENSIONS, CHART_PADDING } from '../../types/chart';
import { useLocale } from '../../contexts/LocaleContext';

export type ParameterLabelPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ParameterBenchmarkDatum {
  model: string;
  paramsB: number;
  score: number;
  color: string;
  labelPosition?: ParameterLabelPosition;
  isRio?: boolean;
}

interface ParameterBenchmarkComparisonChartProps {
  label: string;
  yMin: number;
  yMax: number;
  yTicks: number[];
  data: ParameterBenchmarkDatum[];
}

const PARAMETER_DOMAIN_MIN = 1.8;
const PARAMETER_TICKS = [4, 30, 235, 1000];
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

const formatParameterTick = (value: number) => (value >= 1000 ? '1T' : `${value}B`);
const formatParameterValue = (value: number) => (value >= 1000 ? '1T' : `${value}B`);

const formatScoreValue = (value: number) => {
  const formatted = value.toFixed(2);
  return formatted.replace(/\.?0+$/, '');
};

export const ParameterBenchmarkComparisonChart: React.FC<ParameterBenchmarkComparisonChartProps> = ({
  label,
  yMin,
  yMax,
  yTicks,
  data,
}) => {
  const { isEnglish } = useLocale();
  const [hovered, setHovered] = useState<ParameterBenchmarkDatum | null>(null);
  const [pinned, setPinned] = useState<ParameterBenchmarkDatum | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const { width, height } = PARAMETER_CHART_DIMENSIONS;
  const { top, right, bottom, left } = PARAMETER_CHART_PADDING;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const logMin = Math.log10(PARAMETER_DOMAIN_MIN);
  const logMax = Math.log10(PARAMETER_TICKS[PARAMETER_TICKS.length - 1] ?? 1000);

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

  const handleHover = (item: ParameterBenchmarkDatum) => {
    if (pinned) return;
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
    }
    setHovered(item);
  };

  const handlePin = (item: ParameterBenchmarkDatum) => {
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
