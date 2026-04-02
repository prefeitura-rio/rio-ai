export interface TTABenchmarkPoint {
  context: number;
  'Claude Opus 4.5'?: number;
  'DeepSeek v3.2'?: number;
  'GPT-5.2 xhigh'?: number;
  'Gemini 3 Pro'?: number;
  'Rio 3 TTA 1'?: number;
  'Rio 3 TTA 10'?: number;
  'Rio 3 TTA 100'?: number;
  'Rio 3 TTA 1000'?: number;
  'Rio 3 TTA 10000'?: number;
}

export const TTA_BENCHMARK_DATA: TTABenchmarkPoint[] = [
  { context: 13.0, 'Claude Opus 4.5': 60.8, 'DeepSeek v3.2': 21.4, 'GPT-5.2 xhigh': 91.1, 'Gemini 3 Pro': 96.0, 'Rio 3 TTA 1': 50.1, 'Rio 3 TTA 10': 90.5, 'Rio 3 TTA 100': 98.8, 'Rio 3 TTA 1000': 99.5, 'Rio 3 TTA 10000': 99.4 },
  { context: 14.0, 'Claude Opus 4.5': 27.9, 'DeepSeek v3.2': 12.5, 'GPT-5.2 xhigh': 78.3, 'Gemini 3 Pro': 81.6, 'Rio 3 TTA 1': 45.3, 'Rio 3 TTA 10': 83.0, 'Rio 3 TTA 100': 95.4, 'Rio 3 TTA 1000': 99.1, 'Rio 3 TTA 10000': 99.3 },
  { context: 15.0, 'Claude Opus 4.5': 22.3, 'DeepSeek v3.2': 9.9, 'GPT-5.2 xhigh': 72.1, 'Gemini 3 Pro': 70.6, 'Rio 3 TTA 1': 35.0, 'Rio 3 TTA 10': 77.1, 'Rio 3 TTA 100': 97.6, 'Rio 3 TTA 1000': 98.0, 'Rio 3 TTA 10000': 98.5 },
  { context: 16.0, 'Claude Opus 4.5': 14.0, 'DeepSeek v3.2': 6.4, 'GPT-5.2 xhigh': 73.1, 'Gemini 3 Pro': 49.6, 'Rio 3 TTA 1': 24.2, 'Rio 3 TTA 10': 62.2, 'Rio 3 TTA 100': 91.0, 'Rio 3 TTA 1000': 95.9, 'Rio 3 TTA 10000': 95.7 },
  { context: 17.0, 'Claude Opus 4.5': 14.8, 'DeepSeek v3.2': 8.9, 'GPT-5.2 xhigh': 57.7, 'Gemini 3 Pro': 28.9, 'Rio 3 TTA 1': 10.1, 'Rio 3 TTA 10': 54.0, 'Rio 3 TTA 100': 86.3, 'Rio 3 TTA 1000': 94.5, 'Rio 3 TTA 10000': 96.9 },
  { context: 18.0, 'GPT-5.2 xhigh': 39.4, 'Gemini 3 Pro': 20.0, 'Rio 3 TTA 1': 8.7, 'Rio 3 TTA 10': 39.6, 'Rio 3 TTA 100': 75.5, 'Rio 3 TTA 1000': 92.5, 'Rio 3 TTA 10000': 94.2 },
  { context: 19.0, 'Gemini 3 Pro': 10.7, 'Rio 3 TTA 1': 4.7, 'Rio 3 TTA 10': 33.2, 'Rio 3 TTA 100': 78.2, 'Rio 3 TTA 1000': 87.3, 'Rio 3 TTA 10000': 92.6 },
  { context: 20.0, 'Gemini 3 Pro': 5.7, 'Rio 3 TTA 1': 0.4, 'Rio 3 TTA 10': 25.8, 'Rio 3 TTA 100': 62.8, 'Rio 3 TTA 1000': 82.1, 'Rio 3 TTA 10000': 90.0 },
  { context: 21.0, 'Rio 3 TTA 1': 2.3, 'Rio 3 TTA 10': 12.6, 'Rio 3 TTA 100': 41.6, 'Rio 3 TTA 1000': 70.9, 'Rio 3 TTA 10000': 85.7 },
  { context: 22.0, 'Rio 3 TTA 1': 1.9, 'Rio 3 TTA 10': 6.8, 'Rio 3 TTA 100': 37.5, 'Rio 3 TTA 1000': 50.6, 'Rio 3 TTA 10000': 73.2 },
  { context: 23.0, 'Rio 3 TTA 1': 0.1, 'Rio 3 TTA 10': 2.1, 'Rio 3 TTA 100': 25.9, 'Rio 3 TTA 1000': 52.6, 'Rio 3 TTA 10000': 70.1 },
  { context: 24.0, 'Rio 3 TTA 1': 2.7, 'Rio 3 TTA 10': 1.8, 'Rio 3 TTA 100': 11.2, 'Rio 3 TTA 1000': 37.4, 'Rio 3 TTA 10000': 59.9 },
  { context: 25.0, 'Rio 3 TTA 1': 0.4, 'Rio 3 TTA 10': 2.5, 'Rio 3 TTA 100': 5.1, 'Rio 3 TTA 1000': 25.0, 'Rio 3 TTA 10000': 56.2 },
  { context: 26.0, 'Rio 3 TTA 1': 0.1, 'Rio 3 TTA 10': 3.1, 'Rio 3 TTA 100': 2.6, 'Rio 3 TTA 1000': 17.0, 'Rio 3 TTA 10000': 49.8 },
  { context: 27.0, 'Rio 3 TTA 1': 0.6, 'Rio 3 TTA 10': 0.9, 'Rio 3 TTA 100': 0.7, 'Rio 3 TTA 1000': 6.1, 'Rio 3 TTA 10000': 32.5 },
  { context: 28.0, 'Rio 3 TTA 1': 0.8, 'Rio 3 TTA 10': 1.2, 'Rio 3 TTA 100': 2.5, 'Rio 3 TTA 1000': 0.5, 'Rio 3 TTA 10000': 21.0 },
  { context: 29.0, 'Rio 3 TTA 1': 0.2, 'Rio 3 TTA 10': 0.6, 'Rio 3 TTA 100': 1.2, 'Rio 3 TTA 1000': 1.3, 'Rio 3 TTA 10000': 19.9 },
  { context: 30.0, 'Rio 3 TTA 1': 0.4, 'Rio 3 TTA 10': 1.5, 'Rio 3 TTA 100': 3.1, 'Rio 3 TTA 1000': 2.2, 'Rio 3 TTA 10000': 10.7 },
];

export interface TrainingComputePoint {
  compute: string;
  accuracy: number;
}

export const TRAINING_COMPUTE_DATA: TrainingComputePoint[] = [
  { compute: '10^20', accuracy: 27.0 },
  { compute: '10^21', accuracy: 34.8 },
  { compute: '10^22', accuracy: 39.2 },
  { compute: '10^23', accuracy: 45.1 },
];
