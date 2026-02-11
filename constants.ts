import type { Model } from './types/index';
import type { Locale } from './types/locale';
import { Code2, Terminal, Eye, Search } from 'lucide-react';
import { ModelGlyphXL, ModelGlyphL, ModelGlyphM, ModelGlyphS } from './components/icons/ModelSizeGlyphs';

export const RIO_MODELS: Model[] = [
  {
    name: 'Rio 3.0 Open',
    description:
      'Nosso modelo Open Source flagship,\ncom performance igual aos melhores modelos abertos atuais.',
    category: 'Open Source',
    Icon: ModelGlyphXL,
    tags: ['235B parâmetros · 22B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen3-235B-A22B-Thinking-2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507',
    parameters: '235 Bilhões (22B ativados)',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open',
  },
  {
    name: 'Rio 3.0 Open Mini',
    description:
      'Nossa versão Open Source mobile,\nfeita para rodar em qualquer celular.',
    category: 'Open Source',
    Icon: ModelGlyphM,
    tags: ['4B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 4B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-4B-Thinking-2507',
    parameters: '4 Bilhões',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Mini',
  },
  {
    name: 'Rio 3.0 Open Nano',
    description:
      'Nosso modelo mais compacto.\nConsegue rodar dez mil perguntas por apenas 1 real.',
    category: 'Open Source',
    Icon: ModelGlyphS,
    tags: ['1.7B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 1.7B',
    parameters: '1.7 Bilhões',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Nano',
  },
  {
    name: 'Rio 2.5 Open',
    description:
      'Nosso modelo mais criativo e cheio de personalidade,\nfeito para rodar localmente no seu computador.',
    category: 'Open Source',
    Icon: ModelGlyphL,
    tags: ['30B parâmetros · 3B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 30B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507',
    parameters: '30 Bilhões (3B ativados)',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    datasets: ['nvidia/OpenScienceReasoning-2', 'nvidia/Nemotron-Post-Training-Dataset-v1'],
    datasetLinks: [
      {
        label: 'nvidia/OpenScienceReasoning-2',
        url: 'https://huggingface.co/datasets/nvidia/OpenScienceReasoning-2',
      },
      {
        label: 'nvidia/Nemotron-Post-Training-Dataset-v1',
        url: 'https://huggingface.co/datasets/nvidia/Nemotron-Post-Training-Dataset-v1',
      },
    ],
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-2.5-Open',
    codeSnippets: [
      {
        lang: 'Python',
        Icon: Code2,
        code: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-open")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-open")

# Experimente a nova geração de modelos Rio!`,
      },
      {
        lang: 'cURL',
        Icon: Terminal,
        code: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-open",
  "messages": [{"role": "user", "content": "Quais as novidades do Rio 2.5?"}]
}'`,
      },
    ],
  },
  {
    name: 'Rio 2.5 Open VL',
    description:
      'Nosso modelo de visão computacional.\nGrounding, OCR, QA, Vídeos? Ele faz tudo.',
    category: 'Open Source',
    Icon: Eye,
    tags: ['4B parâmetros', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 VL 4b',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-2.5-Open-VL',
  },
  {
    name: 'Rio 3.0 Open Search',
    description:
      'O modelo de pesquisa na web mais avançado do mundo.',
    category: 'Open Source',
    Icon: Search,
    tags: ['235B parâmetros · 22B ativos', 'Licença MIT'],
    isOpenSource: true,
    baseModel: 'Qwen 3 235B 2507',
    baseModelUrl: 'https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507',
    license: 'MIT',
    licenseUrl: 'https://opensource.org/license/mit',
    huggingFaceUrl: 'https://huggingface.co/prefeitura-rio/Rio-3.0-Open-Search',
  },
];

const RIO_MODELS_EN: Record<
  string,
  {
    description: string;
    tags?: string[];
    parameters?: string;
    codeSnippets?: Record<string, string>;
  }
> = {
  'Rio 3.0 Open': {
    description:
      'Our flagship open-source model,\nwith performance on par with today\'s best open models.',
    tags: ['235B parameters · 22B active', 'MIT License'],
    parameters: '235 Billion (22B active)',
  },
  'Rio 3.0 Open Mini': {
    description:
      'Our mobile open-source version,\nbuilt to run on any smartphone.',
    tags: ['4B parameters', 'MIT License'],
    parameters: '4 Billion',
  },
  'Rio 3.0 Open Nano': {
    description:
      'Our most compact model.\nIt can run ten thousand prompts for just 1 BRL.',
    tags: ['1.7B parameters', 'MIT License'],
    parameters: '1.7 Billion',
  },
  'Rio 2.5 Open': {
    description:
      'Our most creative model, full of personality,\nbuilt to run locally on your computer.',
    tags: ['30B parameters · 3B active', 'MIT License'],
    parameters: '30 Billion (3B active)',
    codeSnippets: {
      Python: `from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("IPLANRIO/rio-2.5-open")
model = AutoModelForCausalLM.from_pretrained("IPLANRIO/rio-2.5-open")

# Try the new generation of Rio models!`,
      cURL: `curl -X POST https://api.iplan.rio/v1/chat/completions \\
-H "Authorization: Bearer $RIO_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "model": "rio-2.5-open",
  "messages": [{"role": "user", "content": "What\'s new in Rio 2.5?"}]
}'`,
    },
  },
  'Rio 2.5 Open VL': {
    description:
      'Our computer vision model.\nGrounding, OCR, QA, videos? It does it all.',
    tags: ['4B parameters', 'MIT License'],
  },
  'Rio 3.0 Open Search': {
    description:
      'The world\'s most advanced web search model.',
    tags: ['235B parameters · 22B active', 'MIT License'],
  },
};

export const getRioModels = (locale: Locale): Model[] => {
  if (locale === 'pt-BR') {
    return RIO_MODELS;
  }

  return RIO_MODELS.map((model) => {
    const translatedModel = RIO_MODELS_EN[model.name];
    if (!translatedModel) {
      return model;
    }

    return {
      ...model,
      description: translatedModel.description,
      tags: translatedModel.tags ?? model.tags,
      parameters: translatedModel.parameters ?? model.parameters,
      codeSnippets: translatedModel.codeSnippets
        ? model.codeSnippets?.map((snippet) => ({
            ...snippet,
            code: translatedModel.codeSnippets?.[snippet.lang] ?? snippet.code,
          }))
        : model.codeSnippets,
    };
  });
};
