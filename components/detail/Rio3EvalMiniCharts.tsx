import React from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import { getRioModels } from '../../constants';
import { ModelCard } from '../ModelCard';
import type { Model } from '../../types/index';

type ModelKey = 'rioUltra' | 'rio3' | 'gpt' | 'gemini' | 'claude';
type MetricDirection = 'higher' | 'lower';

interface ModelDefinition {
  key: ModelKey;
  label: string;
  color: string;
  striped?: boolean;
}

interface MetricValue {
  raw: number;
  label: string;
}

interface BenchmarkCardDefinition {
  name: string;
  detail?: string;
  direction: MetricDirection;
  values: Record<ModelKey, MetricValue>;
}

const MODELS: ModelDefinition[] = [
  { key: 'rioUltra', label: 'Rio 3 Ultra', color: '#2563EB', striped: true },
  { key: 'rio3', label: 'Rio 3', color: '#60A5FA' },
  { key: 'gpt', label: 'GPT 5.4', color: '#94A3B8' },
  { key: 'gemini', label: 'Gemini 3.1 Pro', color: '#CBD5E1' },
  { key: 'claude', label: 'Claude Opus 4.6', color: '#E2E8F0' },
];

const DISCORD_URL = 'https://discord.com/invite/qsCfmwrwVP';

const BENCHMARKS: BenchmarkCardDefinition[] = [
  {
    name: 'Input Price',
    detail: 'Dollars per million tokens',
    direction: 'lower',
    values: {
      rioUltra: { raw: 4.0, label: '$4.00' },
      rio3: { raw: 3.0, label: '$3.00' },
      gpt: { raw: 2.5, label: '$2.50' },
      gemini: { raw: 2.0, label: '$2.00' },
      claude: { raw: 5.0, label: '$5.00' },
    },
  },
  {
    name: 'Output Price',
    detail: 'Dollars per million tokens',
    direction: 'lower',
    values: {
      rioUltra: { raw: 32.0, label: '$32.00' },
      rio3: { raw: 1.5, label: '$1.50' },
      gpt: { raw: 15.0, label: '$15.00' },
      gemini: { raw: 12.0, label: '$12.00' },
      claude: { raw: 25.0, label: '$25.00' },
    },
  },
  {
    name: 'Output Speed',
    detail: 'Tokens per second',
    direction: 'higher',
    values: {
      rioUltra: { raw: 55, label: '55' },
      rio3: { raw: 630, label: '630' },
      gpt: { raw: 70, label: '70' },
      gemini: { raw: 120, label: '120' },
      claude: { raw: 45, label: '45' },
    },
  },
  {
    name: 'MathArena Apex',
    direction: 'higher',
    values: {
      rioUltra: { raw: 76.0, label: '76.0%' },
      rio3: { raw: 63.5, label: '63.5%' },
      gpt: { raw: 54.2, label: '54.2%' },
      gemini: { raw: 60.9, label: '60.9%' },
      claude: { raw: 34.5, label: '34.5%' },
    },
  },
  {
    name: 'ArXiv Math 02/26',
    direction: 'higher',
    values: {
      rioUltra: { raw: 71.1, label: '71.1%' },
      rio3: { raw: 58.6, label: '58.6%' },
      gpt: { raw: 59.4, label: '59.4%' },
      gemini: { raw: 62.5, label: '62.5%' },
      claude: { raw: 40.6, label: '40.6%' },
    },
  },
  {
    name: 'GPQA Diamond',
    direction: 'higher',
    values: {
      rioUltra: { raw: 94.9, label: '94.9%' },
      rio3: { raw: 93.7, label: '93.7%' },
      gpt: { raw: 92.8, label: '92.8%' },
      gemini: { raw: 94.3, label: '94.3%' },
      claude: { raw: 91.3, label: '91.3%' },
    },
  },
  {
    name: "Humanity's Last Exam",
    direction: 'higher',
    values: {
      rioUltra: { raw: 45.7, label: '45.7%' },
      rio3: { raw: 42.2, label: '42.2%' },
      gpt: { raw: 39.8, label: '39.8%' },
      gemini: { raw: 44.4, label: '44.4%' },
      claude: { raw: 40.0, label: '40.0%' },
    },
  },
  {
    name: "Humanity's Last Exam",
    detail: 'Search + Code',
    direction: 'higher',
    values: {
      rioUltra: { raw: 61.1, label: '61.1%' },
      rio3: { raw: 53.1, label: '53.1%' },
      gpt: { raw: 52.1, label: '52.1%' },
      gemini: { raw: 51.4, label: '51.4%' },
      claude: { raw: 53.1, label: '53.1%' },
    },
  },
  {
    name: 'Terminal-Bench 2.0',
    detail: 'Terminus-2 harness',
    direction: 'higher',
    values: {
      rioUltra: { raw: 75.0, label: '75.0%' },
      rio3: { raw: 68.4, label: '68.4%' },
      gpt: { raw: 69.4, label: '69.4%' },
      gemini: { raw: 68.5, label: '68.5%' },
      claude: { raw: 65.4, label: '65.4%' },
    },
  },
  {
    name: 'SciCode',
    direction: 'higher',
    values: {
      rioUltra: { raw: 63, label: '63%' },
      rio3: { raw: 56, label: '56%' },
      gpt: { raw: 57, label: '57%' },
      gemini: { raw: 59, label: '59%' },
      claude: { raw: 52, label: '52%' },
    },
  },
  {
    name: 'SWE-Bench Pro (Public)',
    direction: 'higher',
    values: {
      rioUltra: { raw: 63.4, label: '63.4%' },
      rio3: { raw: 56.5, label: '56.5%' },
      gpt: { raw: 57.7, label: '57.7%' },
      gemini: { raw: 54.2, label: '54.2%' },
      claude: { raw: 57.3, label: '57.3%' },
    },
  },
  {
    name: 'MCP Atlas (Public)',
    direction: 'higher',
    values: {
      rioUltra: { raw: 74.5, label: '74.5%' },
      rio3: { raw: 72.9, label: '72.9%' },
      gpt: { raw: 67.2, label: '67.2%' },
      gemini: { raw: 69.2, label: '69.2%' },
      claude: { raw: 59.5, label: '59.5%' },
    },
  },
  {
    name: 'τ2-bench',
    detail: 'Retail',
    direction: 'higher',
    values: {
      rioUltra: { raw: 90.6, label: '90.6%' },
      rio3: { raw: 91.3, label: '91.3%' },
      gpt: { raw: 88.6, label: '88.6%' },
      gemini: { raw: 90.8, label: '90.8%' },
      claude: { raw: 91.9, label: '91.9%' },
    },
  },
  {
    name: 'τ2-bench',
    detail: 'Telecom',
    direction: 'higher',
    values: {
      rioUltra: { raw: 99.3, label: '99.3%' },
      rio3: { raw: 99.1, label: '99.1%' },
      gpt: { raw: 98.9, label: '98.9%' },
      gemini: { raw: 99.3, label: '99.3%' },
      claude: { raw: 99.3, label: '99.3%' },
    },
  },
  {
    name: 'APEX-Agents',
    direction: 'higher',
    values: {
      rioUltra: { raw: 37.9, label: '37.9%' },
      rio3: { raw: 34.8, label: '34.8%' },
      gpt: { raw: 35.9, label: '35.9%' },
      gemini: { raw: 33.5, label: '33.5%' },
      claude: { raw: 29.8, label: '29.8%' },
    },
  },
  {
    name: 'BrowseComp',
    detail: 'Search + Code',
    direction: 'higher',
    values: {
      rioUltra: { raw: 79.8, label: '79.8%' },
      rio3: { raw: 81.4, label: '81.4%' },
      gpt: { raw: 82.7, label: '82.7%' },
      gemini: { raw: 85.9, label: '85.9%' },
      claude: { raw: 84.0, label: '84.0%' },
    },
  },
  {
    name: 'MMMU Pro',
    direction: 'higher',
    values: {
      rioUltra: { raw: 84.6, label: '84.6%' },
      rio3: { raw: 83.5, label: '83.5%' },
      gpt: { raw: 81.2, label: '81.2%' },
      gemini: { raw: 80.5, label: '80.5%' },
      claude: { raw: 73.9, label: '73.9%' },
    },
  },
  {
    name: 'MMLU Pro',
    direction: 'higher',
    values: {
      rioUltra: { raw: 91.2, label: '91.2%' },
      rio3: { raw: 89.7, label: '89.7%' },
      gpt: { raw: 87.6, label: '87.6%' },
      gemini: { raw: 90.8, label: '90.8%' },
      claude: { raw: 88.7, label: '88.7%' },
    },
  },
  {
    name: 'MRCR v2 (8-needle)',
    detail: '128k (average)',
    direction: 'higher',
    values: {
      rioUltra: { raw: 88.0, label: '88.0%' },
      rio3: { raw: 87.6, label: '87.6%' },
      gpt: { raw: 85.3, label: '85.3%' },
      gemini: { raw: 84.9, label: '84.9%' },
      claude: { raw: 84.0, label: '84.0%' },
    },
  },
];

const PRIMARY_BENCHMARKS = BENCHMARKS.slice(0, 3);
const SECONDARY_BENCHMARKS = BENCHMARKS.slice(3);

const isBestInRow = (benchmark: BenchmarkCardDefinition, modelKey: ModelKey) => {
  const values = Object.values(benchmark.values).map((value) => value.raw);
  const current = benchmark.values[modelKey].raw;

  if (benchmark.direction === 'lower') {
    return current === Math.min(...values);
  }

  return current === Math.max(...values);
};

const breakoutStyle: React.CSSProperties = {
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
};

interface Rio3EvalMiniChartsProps {
  onSelectModel?: (model: Model) => void;
}

export const Rio3EvalMiniCharts: React.FC<Rio3EvalMiniChartsProps> = ({ onSelectModel }) => {
  const { isEnglish, locale } = useLocale();
  const openSourceModels = getRioModels(locale).filter(
    (model) => model.isOpenSource && model.name.includes('Open'),
  );

  return (
    <div style={breakoutStyle} className="my-16 bg-slate-50/70 px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <p
          className="mb-6 w-full text-center text-sm leading-7 text-slate-500"
          style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
        >
          {isEnglish ? (
            <>
              Here are some standardized benchmarks for our closed models, Rio 3 and Rio 3
              Ultra. If you wish us to add your benchmark, please contact us via{' '}
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[#2F5FBE] hover:underline"
              >
                Discord
              </a>
              .
            </>
          ) : (
            <>
              Aqui estão alguns benchmarks padronizados para nossos modelos fechados, Rio 3 e
              Rio 3 Ultra. Se quiser que adicionemos seu benchmark, entre em contato conosco via{' '}
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[#2F5FBE] hover:underline"
              >
                Discord
              </a>
              .
            </>
          )}
        </p>

        <div className="overflow-x-auto">
          <table
            className="mx-auto min-w-[980px] border-collapse border-t border-b border-slate-900 text-left"
            style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
          >
            <thead>
              <tr className="border-b border-slate-900">
                <th className="px-4 py-3 text-sm font-semibold text-slate-900">
                  {isEnglish ? 'Benchmark' : 'Benchmark'}
                </th>
                <th className="px-3 py-3 text-sm font-semibold text-slate-900">
                  {isEnglish ? 'Details' : 'Detalhes'}
                </th>
                {MODELS.map((model) => (
                  <th
                    key={model.key}
                    className={`px-3 py-3 text-sm font-semibold ${
                      model.key === 'rioUltra' || model.key === 'rio3'
                        ? 'text-rio-primary'
                        : 'text-slate-900'
                    }`}
                  >
                    {model.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRIMARY_BENCHMARKS.map((benchmark) => (
                <tr
                  key={`${benchmark.name}-${benchmark.detail ?? 'base'}`}
                  className={
                    benchmark === PRIMARY_BENCHMARKS[PRIMARY_BENCHMARKS.length - 1]
                      ? 'border-b border-slate-900'
                      : 'border-b border-slate-200'
                  }
                >
                  <td className="px-4 py-2.5 text-sm font-semibold text-slate-900">
                    {benchmark.name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-500">
                    {benchmark.detail || '—'}
                  </td>
                  {MODELS.map((model) => (
                    <td
                      key={`${benchmark.name}-${model.key}`}
                      className={`px-3 py-2.5 text-sm text-slate-900 ${
                        isBestInRow(benchmark, model.key) ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {benchmark.values[model.key].label}
                    </td>
                  ))}
                </tr>
              ))}

              {SECONDARY_BENCHMARKS.map((benchmark, index) => (
                <tr
                  key={`${benchmark.name}-${benchmark.detail ?? 'base'}`}
                  className={index === SECONDARY_BENCHMARKS.length - 1 ? '' : 'border-b border-slate-200'}
                >
                  <td className="px-4 py-2.5 text-sm font-semibold text-slate-900">
                    {benchmark.name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-500">
                    {benchmark.detail || '—'}
                  </td>
                  {MODELS.map((model) => (
                    <td
                      key={`${benchmark.name}-${benchmark.detail ?? 'base'}-${model.key}`}
                      className={`px-3 py-2.5 text-sm text-slate-900 ${
                        isBestInRow(benchmark, model.key) ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {benchmark.values[model.key].label}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12">
          <p
            className="mx-auto max-w-4xl text-center text-base leading-8 text-slate-600"
            style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
          >
            {isEnglish ? (
              <>
                We are also open-sourcing 6 models distilled from Rio 3. You can find more
                details about each one of them here:
              </>
            ) : (
              <>
                Também estamos disponibilizando em open source 6 modelos destilados do Rio 3.
                Você pode encontrar mais detalhes sobre cada um deles aqui:
              </>
            )}
          </p>

          <div className="mt-10 max-w-[96rem] mx-auto grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {openSourceModels.map((model) => (
              <ModelCard
                key={model.name}
                model={model}
                onSelectModel={onSelectModel ?? (() => {})}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
