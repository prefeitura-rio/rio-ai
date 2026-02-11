import React from 'react';
import type { Model } from '../../types/index';
import { DetailHeader } from './DetailHeader';
import { DetailUseCases } from './DetailUseCases';
import { DetailCodeSnippets } from './DetailCodeSnippets';
import { AnimateOnScroll } from '../AnimateOnScroll';
import { OnPolicyDistillationFlow } from './OnPolicyDistillationFlow';

interface Rio30OpenNanoDetailProps {
  model: Model;
  onBack: () => void;
}

const NANO_BENCHMARK_ROWS = [
  { benchmark: 'Multi-IF', rio: '62.1', qwen: '44.7' },
  { benchmark: 'BFCL v3', rio: '58.9', qwen: '52.2' },
  { benchmark: 'MMLU-Pro', rio: '53.5', qwen: '41.8' },
  { benchmark: 'GPQA Diamond', rio: '45.1', qwen: '28.6' },
  { benchmark: 'AIME 2025', rio: '26.4', qwen: '9.8' },
  { benchmark: 'LiveCodeBench v6', rio: '25.0', qwen: '11.5' },
];

export const Rio30OpenNanoDetail: React.FC<Rio30OpenNanoDetailProps> = ({ model, onBack }) => {
  const huggingFaceWeightsUrl =
    model.huggingFaceUrl ?? 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Nano';

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
            studentName={model.baseModel ?? 'Qwen 3 1.7B'}
            finalModelName={model.name}
          />
        </AnimateOnScroll>

        <AnimateOnScroll>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-prose">Benchmark</th>
                    <th className="px-4 py-3 text-left font-semibold text-rio-primary">
                      Rio 3.0 Open Nano (Non-thinking)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-prose">
                      Qwen 3 1.7B (Non-thinking)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NANO_BENCHMARK_ROWS.map((row) => (
                    <tr key={row.benchmark} className="border-b border-slate-100 bg-white">
                      <th scope="row" className="px-4 py-3 text-left font-medium text-prose">
                        {row.benchmark}
                      </th>
                      <td className="px-4 py-3 font-semibold text-rio-primary">{row.rio}</td>
                      <td className="px-4 py-3 text-prose">{row.qwen}</td>
                    </tr>
                  ))}
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
