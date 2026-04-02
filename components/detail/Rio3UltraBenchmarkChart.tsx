import React, { useId, useState } from 'react';

type ModelKey = 'rio' | 'gpt' | 'geminiPro' | 'claude';

interface ModelDefinition {
  key: ModelKey;
  label: string;
  color: string;
}

interface BenchmarkDefinition {
  name: string;
  detail: string;
  scores: Partial<Record<ModelKey, number>>;
  isElo?: boolean;
  eloMax?: number;
}

const MODELS: ModelDefinition[] = [
  { key: 'rio', label: 'Rio 3 Ultra', color: '#2563EB' },
  { key: 'gpt', label: 'GPT-5.4', color: '#A8B4C8' },
  { key: 'geminiPro', label: 'Gemini 3.1 Pro', color: '#C0CCE0' },
  { key: 'claude', label: 'Claude Opus 4.6', color: '#DAE3F0' },
];

const BENCHMARKS: BenchmarkDefinition[] = [
  {
    name: 'HLE',
    detail: 'Search + code execution',
    scores: { rio: 62.1, geminiPro: 51.4, claude: 53.0, gpt: 52.1 },
  },
  {
    name: 'MMMU-Pro',
    detail: 'No tools',
    scores: { rio: 84.6, geminiPro: 80.5, claude: 73.9, gpt: 81.2 },
  },
  {
    name: 'Codeforces',
    detail: 'No tools, Elo',
    isElo: true,
    eloMax: 4000,
    scores: { rio: 3594, geminiPro: 3027, claude: 2352, gpt: 3209 },
  },
  {
    name: 'CMT-Bench',
    detail: '',
    scores: { rio: 58.0, geminiPro: 44.9, claude: 17.1, gpt: 45.5 },
  },
  {
    name: 'IMO 2025',
    detail: '',
    scores: { rio: 86.3, geminiPro: 73.2, claude: 67.9, gpt: 76.8 },
  },
  {
    name: 'IPhO 2025',
    detail: '',
    scores: { rio: 90.1, geminiPro: 82.6, claude: 71.6, gpt: 79.0 },
  },
  {
    name: 'IChO 2025',
    detail: '',
    scores: { rio: 88.5, geminiPro: 73.7, claude: 64.2, gpt: 76.2 },
  },
  {
    name: 'IOI 2025',
    detail: '50 submissions',
    scores: { rio: 75.8, geminiPro: 46.0, claude: 41.9, gpt: 63.9 },
  },
];

const SVG_W = 1000;
const SVG_H = 540;
const MARGIN = { top: 55, right: 25, bottom: 82, left: 72 };
const CHART_W = SVG_W - MARGIN.left - MARGIN.right;
const CHART_H = SVG_H - MARGIN.top - MARGIN.bottom;

interface StripedBarProps {
  color: string;
  height: number;
  id: string;
  width: number;
  x: number;
  y: number;
}

const StripedBar: React.FC<StripedBarProps> = ({ x, y, width, height, color, id }) => (
  <>
    <defs>
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
        patternTransform="rotate(45)"
      >
        <rect width="6" height="6" fill={color} />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" />
      </pattern>
    </defs>
    <rect x={x} y={y} width={width} height={height} fill={`url(#${id})`} rx={1.5} />
  </>
);

export const Rio3UltraBenchmarkChart: React.FC = () => {
  const [hoverGroup, setHoverGroup] = useState<number | null>(null);
  const patternPrefix = useId().replace(/:/g, '');
  const yTicks = [0, 20, 40, 60, 80, 100];
  const groupWidth = CHART_W / BENCHMARKS.length;

  const getBarHeight = (val: number, bench: BenchmarkDefinition) => {
    if (bench.isElo && bench.eloMax) {
      return (val / bench.eloMax) * CHART_H;
    }
    return (val / 100) * CHART_H;
  };

  const formatVal = (val: number, isElo?: boolean) => {
    if (isElo) return val.toLocaleString();
    return val % 1 === 0 ? `${val}.0` : `${val}`;
  };

  const breakoutStyle: React.CSSProperties = {
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
  };

  return (
    <div
      style={breakoutStyle}
      className="my-16 flex flex-col items-center justify-center bg-white px-8"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="mb-5 flex flex-wrap justify-center gap-4 rounded border border-gray-300 bg-gray-50 px-6 py-2"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        {MODELS.map((model) => (
          <div key={model.key} className="flex items-center gap-2">
            <svg width="18" height="13">
              {model.key === 'rio' ? (
                <>
                  <defs>
                    <pattern
                      id={`${patternPrefix}-legend-${model.key}`}
                      patternUnits="userSpaceOnUse"
                      width="5"
                      height="5"
                      patternTransform="rotate(45)"
                    >
                      <rect width="5" height="5" fill={model.color} />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="5"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.8"
                      />
                    </pattern>
                  </defs>
                  <rect width="18" height="13" fill={`url(#${patternPrefix}-legend-${model.key})`} rx="2" />
                </>
              ) : (
                <rect width="18" height="13" fill={model.color} rx="2" />
              )}
            </svg>
            <span className="text-xs font-semibold text-gray-700">{model.label}</span>
          </div>
        ))}
      </div>

      <div
        className="w-full max-w-5xl bg-white p-4"
        style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      >
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="h-auto w-full">
          <text
            x={18}
            y={SVG_H / 2 - 10}
            textAnchor="middle"
            transform={`rotate(-90, 18, ${SVG_H / 2 - 10})`}
            fontSize={13}
            fontWeight={700}
            fill="#333"
            fontFamily="DM Sans, sans-serif"
          >
            ELO/Accuracy (%)
          </text>

          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {yTicks.map((tick) => {
              const y = CHART_H - (tick / 100) * CHART_H;
              return (
                <g key={tick}>
                  <line x1={0} y1={y} x2={CHART_W} y2={y} stroke="#E5E5E5" strokeWidth={0.7} />
                  <text
                    x={-12}
                    y={y + 4}
                    textAnchor="end"
                    fontSize={12}
                    fontWeight={500}
                    fill="#666"
                    fontFamily="DM Sans, sans-serif"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#444" strokeWidth={1} />

            {BENCHMARKS.map((bench, benchIndex) => {
              const presentModels = MODELS.filter((model) => bench.scores[model.key] != null);
              const barGap = 2.5;
              const totalBarArea = groupWidth * 0.76;
              const barW =
                (totalBarArea - barGap * (presentModels.length - 1)) / presentModels.length;
              const groupStartX =
                benchIndex * groupWidth +
                (groupWidth -
                  (presentModels.length * barW + (presentModels.length - 1) * barGap)) /
                  2;

              return (
                <g
                  key={bench.name}
                  onMouseEnter={() => setHoverGroup(benchIndex)}
                  onMouseLeave={() => setHoverGroup(null)}
                  className="cursor-default"
                >
                  <rect
                    x={benchIndex * groupWidth}
                    y={0}
                    width={groupWidth}
                    height={CHART_H}
                    fill="transparent"
                  />

                  {presentModels.map((model, modelIndex) => {
                    const val = bench.scores[model.key];
                    if (val == null) return null;

                    const barHeight = getBarHeight(val, bench);
                    const barX = groupStartX + modelIndex * (barW + barGap);
                    const barY = CHART_H - barHeight;
                    const dimmed = hoverGroup !== null && hoverGroup !== benchIndex;

                    return (
                      <g
                        key={model.key}
                        opacity={dimmed ? 0.35 : 1}
                        style={{ transition: 'opacity 0.2s' }}
                      >
                        {model.key === 'rio' ? (
                          <StripedBar
                            x={barX}
                            y={barY}
                            width={barW}
                            height={barHeight}
                            color={model.color}
                            id={`${patternPrefix}-stripe-${benchIndex}`}
                          />
                        ) : (
                          <rect
                            x={barX}
                            y={barY}
                            width={barW}
                            height={barHeight}
                            fill={model.color}
                            rx={1.5}
                          />
                        )}
                        <text
                          x={barX + barW / 2}
                          y={barY - 4}
                          textAnchor="middle"
                          fontSize={bench.isElo ? 9 : 10}
                          fontWeight={model.key === 'rio' ? 700 : 600}
                          fill={model.key === 'rio' ? '#1D4ED8' : '#555'}
                          fontFamily="DM Sans, sans-serif"
                        >
                          {formatVal(val, bench.isElo)}
                        </text>
                      </g>
                    );
                  })}

                  <text
                    x={benchIndex * groupWidth + groupWidth / 2}
                    y={CHART_H + 24}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill="#222"
                    fontFamily="DM Sans, sans-serif"
                  >
                    {bench.name}
                  </text>

                  {bench.detail && (
                    <text
                      x={benchIndex * groupWidth + groupWidth / 2}
                      y={CHART_H + 40}
                      textAnchor="middle"
                      fontSize={10}
                      fontStyle="italic"
                      fill="#999"
                      fontFamily="DM Sans, sans-serif"
                    >
                      ({bench.detail})
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
