import React from 'react';
import { useLocale } from '../../contexts/LocaleContext';

interface MathBenchmarkRow {
  model: string;
  aime2025: string;
  hmmt2025I: string;
  brumo2025: string;
  smt2025: string;
  cmimc2025: string;
  hmmt2025II: string;
  aime2026I: string;
  compositeMath: string;
  gpqaDiamond: string;
  liveCodeBench: string;
}

type ScoreKey =
  | 'aime2025'
  | 'hmmt2025I'
  | 'brumo2025'
  | 'smt2025'
  | 'cmimc2025'
  | 'hmmt2025II'
  | 'aime2026I'
  | 'compositeMath'
  | 'gpqaDiamond'
  | 'liveCodeBench';

const SCORE_KEYS: ScoreKey[] = [
  'gpqaDiamond',
  'liveCodeBench',
  'compositeMath',
  'aime2025',
  'aime2026I',
  'hmmt2025I',
  'hmmt2025II',
  'brumo2025',
  'cmimc2025',
  'smt2025',
];

const MATH_BENCHMARK_ROWS: MathBenchmarkRow[] = [
  {
    model: 'Rio 3.0 Open',
    aime2025: '96.67%',
    hmmt2025I: '90.00%',
    brumo2025: '95.00%',
    smt2025: '90.57%',
    cmimc2025: '86.88%',
    hmmt2025II: '90.00%',
    aime2026I: '93.33%',
    compositeMath: '91.78%',
    gpqaDiamond: '85.1%',
    liveCodeBench: '76.0%',
  },
  {
    model: 'Rio 3.0 Open (w/o latent)',
    aime2025: '95.00%',
    hmmt2025I: '85.83%',
    brumo2025: '92.50%',
    smt2025: '90.57%',
    cmimc2025: '85.00%',
    hmmt2025II: '90.83%',
    aime2026I: '89.17%',
    compositeMath: '89.84%',
    gpqaDiamond: '83.2%',
    liveCodeBench: '76.0%',
  },
  {
    model: 'Qwen 3 235B A22B 2507',
    aime2025: '91.67%',
    hmmt2025I: '83.33%',
    brumo2025: '87.50%',
    smt2025: '84.91%',
    cmimc2025: '83.75%',
    hmmt2025II: '89.17%',
    aime2026I: '87.50%',
    compositeMath: '86.83%',
    gpqaDiamond: '81.1%',
    liveCodeBench: '74.1%',
  },
  {
    model: 'Rio 2.5 Open',
    aime2025: '93.33%',
    hmmt2025I: '83.33%',
    brumo2025: '88.33%',
    smt2025: '83.96%',
    cmimc2025: '83.75%',
    hmmt2025II: '90.83%',
    aime2026I: '89.17%',
    compositeMath: '87.53%',
    gpqaDiamond: '77.2%',
    liveCodeBench: '69.6%',
  },
  {
    model: 'Rio 2.5 Open (w/o latent)',
    aime2025: '90.00%',
    hmmt2025I: '76.67%',
    brumo2025: '85.83%',
    smt2025: '80.19%',
    cmimc2025: '75.00%',
    hmmt2025II: '84.17%',
    aime2026I: '83.33%',
    compositeMath: '82.17%',
    gpqaDiamond: '75.8%',
    liveCodeBench: '69.4%',
  },
  {
    model: 'Qwen 3 30B A3B 2507',
    aime2025: '82.50%',
    hmmt2025I: '70.83%',
    brumo2025: '85.00%',
    smt2025: '75.47%',
    cmimc2025: '66.25%',
    hmmt2025II: '75.83%',
    aime2026I: '76.67%',
    compositeMath: '76.08%',
    gpqaDiamond: '73.4%',
    liveCodeBench: '66.0%',
  },
  {
    model: 'Rio 3.0 Open Mini',
    aime2025: '89.17%',
    hmmt2025I: '73.33%',
    brumo2025: '85.83%',
    smt2025: '77.36%',
    cmimc2025: '66.88%',
    hmmt2025II: '79.17%',
    aime2026I: '75.00%',
    compositeMath: '78.11%',
    gpqaDiamond: '71.9%',
    liveCodeBench: '63.5%',
  },
  {
    model: 'Rio 3.0 Open Mini (w/o latent)',
    aime2025: '85.83%',
    hmmt2025I: '66.67%',
    brumo2025: '84.17%',
    smt2025: '78.30%',
    cmimc2025: '63.75%',
    hmmt2025II: '74.17%',
    aime2026I: '75.83%',
    compositeMath: '75.53%',
    gpqaDiamond: '70.1%',
    liveCodeBench: '62.0%',
  },
  {
    model: 'Qwen 3 4B 2507',
    aime2025: '81.67%',
    hmmt2025I: '55.83%',
    brumo2025: '81.67%',
    smt2025: '74.53%',
    cmimc2025: '60.00%',
    hmmt2025II: '73.33%',
    aime2026I: '70.83%',
    compositeMath: '71.12%',
    gpqaDiamond: '65.8%',
    liveCodeBench: '55.2%',
  },
  {
    model: 'Kimi K2.5 Thinking',
    aime2025: '95.83%',
    hmmt2025I: '93.33%',
    brumo2025: '98.33%',
    smt2025: '90.57%',
    cmimc2025: '91.25%',
    hmmt2025II: '89.17%',
    aime2026I: '93.33%',
    compositeMath: '93.12%',
    gpqaDiamond: '87.6%',
    liveCodeBench: '85.0%',
  },
  {
    model: 'DeepSeek V3.2',
    aime2025: '94.17%',
    hmmt2025I: '92.50%',
    brumo2025: '96.67%',
    smt2025: '87.74%',
    cmimc2025: '83.75%',
    hmmt2025II: '90.00%',
    aime2026I: '91.67%',
    compositeMath: '90.93%',
    gpqaDiamond: '82.4%',
    liveCodeBench: '83.3%',
  },
  {
    model: 'GLM 4.6',
    aime2025: '91.67%',
    hmmt2025I: '93.33%',
    brumo2025: '94.17%',
    smt2025: '90.57%',
    cmimc2025: '88.75%',
    hmmt2025II: '91.67%',
    aime2026I: '91.67%',
    compositeMath: '91.69%',
    gpqaDiamond: '81.0%',
    liveCodeBench: '82.8%',
  },
  {
    model: 'GPT OSS 120B',
    aime2025: '90.00%',
    hmmt2025I: '90.00%',
    brumo2025: '91.67%',
    smt2025: '87.74%',
    cmimc2025: '85.62%',
    hmmt2025II: '90.00%',
    aime2026I: '89.17%',
    compositeMath: '89.17%',
    gpqaDiamond: '80.1%',
    liveCodeBench: '77.97%',
  },
  {
    model: 'GPT OSS 20B',
    aime2025: '89.17%',
    hmmt2025I: '76.67%',
    brumo2025: '86.67%',
    smt2025: '83.02%',
    cmimc2025: '72.50%',
    hmmt2025II: '83.33%',
    aime2026I: '85.00%',
    compositeMath: '82.34%',
    gpqaDiamond: '71.5%',
    liveCodeBench: '70.26%',
  },
];

const COMPOSITE_MATH_BENCHMARKS = [
  'AIME 2025',
  'AIME 2026 I',
  'HMMT 2025 I',
  'HMMT 2025 II',
  'BRUMO 2025',
  'CMIMC 2025',
  'SMT 2025',
];

const parsePercent = (value: string): number | null => {
  if (value === '—') return null;
  const parsed = Number.parseFloat(value.replace('%', ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const TOP_SCORES_BY_METRIC: Record<ScoreKey, number> = SCORE_KEYS.reduce(
  (acc, key) => {
    const values = MATH_BENCHMARK_ROWS.map((row) => parsePercent(row[key])).filter(
      (score): score is number => score !== null
    );
    acc[key] = values.length > 0 ? Math.max(...values) : Number.NEGATIVE_INFINITY;
    return acc;
  },
  {} as Record<ScoreKey, number>
);

const scoreCellClass = (isTopScore: boolean) =>
  isTopScore
    ? 'px-4 py-3 text-center font-semibold text-emerald-700 bg-emerald-50 whitespace-nowrap'
    : 'px-4 py-3 text-center text-prose whitespace-nowrap';

const isTopScore = (row: MathBenchmarkRow, key: ScoreKey) => {
  const score = parsePercent(row[key]);
  if (score === null) return false;
  return score === TOP_SCORES_BY_METRIC[key];
};

export const MathBenchmarkResultsTable: React.FC = () => {
  const { isEnglish } = useLocale();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-prose whitespace-nowrap">
                Model
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                <span className="whitespace-nowrap">GPQA</span>
                <br />
                <span className="whitespace-nowrap">Diamond</span>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                LiveCodeBench
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                <span className="whitespace-nowrap">Composite</span>
                <br />
                <span className="whitespace-nowrap">Math*</span>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                AIME 2025
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                AIME 2026 I
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                HMMT 2025 I
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                HMMT 2025 II
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                BRUMO 2025
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                CMIMC 2025
              </th>
              <th className="px-4 py-3 text-center font-semibold text-prose whitespace-nowrap">
                SMT 2025
              </th>
            </tr>
          </thead>
          <tbody>
            {MATH_BENCHMARK_ROWS.map((row) => (
              <tr key={row.model} className="border-b border-slate-100 bg-white">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-prose whitespace-nowrap"
                >
                  {row.model}
                </th>
                <td className={scoreCellClass(isTopScore(row, 'gpqaDiamond'))}>
                  {row.gpqaDiamond}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'liveCodeBench'))}>
                  {row.liveCodeBench}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'compositeMath'))}>
                  {row.compositeMath}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'aime2025'))}>
                  {row.aime2025}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'aime2026I'))}>
                  {row.aime2026I}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'hmmt2025I'))}>
                  {row.hmmt2025I}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'hmmt2025II'))}>
                  {row.hmmt2025II}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'brumo2025'))}>
                  {row.brumo2025}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'cmimc2025'))}>
                  {row.cmimc2025}
                </td>
                <td className={scoreCellClass(isTopScore(row, 'smt2025'))}>
                  {row.smt2025}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 text-xs text-prose-light">
        <p>
          <span className="font-semibold text-prose">* Composite Math</span>{' '}
          {isEnglish
            ? 'is the average of the following benchmarks:'
            : 'é a média dos seguintes benchmarks:'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMPOSITE_MATH_BENCHMARKS.map((benchmark) => (
            <span
              key={benchmark}
              className="rounded-full bg-white px-2.5 py-1 font-medium text-prose ring-1 ring-slate-200"
            >
              {benchmark}
            </span>
          ))}
        </div>
        <p className="mt-3">
          <span className="font-semibold text-prose">**</span>{' '}
          {isEnglish
            ? 'The benchmark scores are from MathArena and the model\'s official reported scores when available. Otherwise, we run the evals.'
            : 'As pontuações dos benchmarks são do MathArena e dos scores oficiais reportados pelos modelos quando disponíveis. Caso contrário, executamos as avaliações.'}
        </p>
      </div>
    </section>
  );
};
