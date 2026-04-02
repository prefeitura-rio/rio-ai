import React from 'react';
import { useLocale } from '../contexts/LocaleContext';
import type { Locale } from '../types/locale';
import type { ResearchPost } from '../types/index';
import { AnimateOnScroll } from './AnimateOnScroll';

const RESEARCH_POSTS_PT: ResearchPost[] = [
  {
    id: 'elastic-vision',
    title: 'Introduzindo Rio 3',
    summary:
      'Nossa primeira geração de modelos publicamente anunciados, incluindo dois modelos State of the Art e seis modelos abertos para impulsionar o ecossistema de Large Language Models no Brasil.',
    content: `
Nossa primeira geração de modelos publicamente anunciados, incluindo dois modelos State of the Art e seis modelos abertos para impulsionar o ecossistema de Large Language Models no Brasil.

\`\`\`
RIO3_ULTRA_BENCHMARK_CHART
\`\`\`

\`\`\`
RIO3_EVAL_MINI_CHARTS
\`\`\`
`,
    date: '11 Jan 2026',
    imageUrl: '/images/research/on-policy-distillation.png',
    isFeatured: true,
  },
  {
    id: 'test-time-attention',
    title: 'Introduzindo <br /> Test-Time Attention',
    summary:
      'Uma análise técnica sobre como mecanismos de atenção adaptativos durante a inferência permitem que nossos modelos "pensem" mais profundamente antes de responder.',
    content: `
\`\`\`
ATTENTION_ACCURACY_CHART
\`\`\`

Em 12 de Setembro de 2024, a OpenAI introduziu o paradigma de raciocínio aos modelos de linguagem. A partir do o1 preview, as LLMs passaram a ser capazes de pensar sobre suas respostas, abrindo uma frente inteiramente nova de scaling. Hoje, trazemos o Rio 3.0 Preview, que desperta um novo eixo de aprendizado: a capacidade de pensar sobre e reler as perguntas ou, como chamamos essa técnica internamente, Test-Time Attention.

Apesar dos grandes avanços em sua qualidade e sofisticação, todas as LLMs atuais sofrem com um grave problema que atrapalha seu uso no dia a dia: a incapacidade de lidar com textos longos com precisão similar aos curtos. Como podemos observar no gráfico abaixo, o mecanismo de Test-Time Attention permite que superemos esse impasse, relendo o texto múltiplas vezes para capturar cada detalhe e minúcia:

\`\`\`
MANY_NEEDLES_CHART
\`\`\`

\`\`\`
TTA_TYPEWRITER_CALLOUT
\`\`\`

\`\`\`
SPINNING_EARTH_VISUALIZATION
\`\`\`

`,
    date: '10 Jan 2026',
    imageUrl: '/images/research/test-time-attention.png',
    isFeatured: true,
  },
];

const RESEARCH_POSTS_EN: ResearchPost[] = [
  {
    id: 'elastic-vision',
    title: 'Introducing Rio 3',
    summary:
      'Our first publicly announced generation of models, including two state-of-the-art models and six open models to drive the Large Language Model ecosystem in Brazil.',
    content: `
Our first publicly announced generation of models, including two state-of-the-art models and six open models to drive the Large Language Model ecosystem in Brazil.

\`\`\`
RIO3_ULTRA_BENCHMARK_CHART
\`\`\`

\`\`\`
RIO3_EVAL_MINI_CHARTS
\`\`\`
`,
    date: '11 Jan 2026',
    imageUrl: '/images/research/on-policy-distillation.png',
    isFeatured: true,
  },
  {
    id: 'test-time-attention',
    title: 'Introducing <br /> Test-Time Attention',
    summary:
      'A technical analysis of how adaptive attention mechanisms during inference allow our models to "think" more deeply before responding.',
    content: `
\`\`\`
ATTENTION_ACCURACY_CHART
\`\`\`

On September 12, 2024, OpenAI introduced the reasoning paradigm to language models. Starting with o1 preview, LLMs became capable of thinking about their responses, opening an entirely new scaling frontier. Today, we introduce Rio 3.0 Preview, which unlocks a new learning axis: the ability to think about and reread questions or, as we call this technique internally, Test-Time Attention.

Despite major advances in quality and sophistication, all current LLMs still suffer from a serious problem that limits their everyday usefulness: the inability to handle long texts with accuracy comparable to short ones. As we can see in the chart below, the Test-Time Attention mechanism allows us to overcome this limitation by rereading the text multiple times to capture every detail and nuance:

\`\`\`
MANY_NEEDLES_CHART
\`\`\`

\`\`\`
TTA_TYPEWRITER_CALLOUT
\`\`\`

\`\`\`
SPINNING_EARTH_VISUALIZATION
\`\`\`

`,
    date: '10 Jan 2026',
    imageUrl: '/images/research/test-time-attention.png',
    isFeatured: true,
  },
];

export const getResearchPosts = (locale: Locale): ResearchPost[] => {
  return locale === 'en-US' ? RESEARCH_POSTS_EN : RESEARCH_POSTS_PT;
};

export const ResearchSection: React.FC<{ onSelectPost?: (post: ResearchPost) => void }> = ({
  onSelectPost,
}) => {
  const { locale, isEnglish } = useLocale();
  const featuredPosts = getResearchPosts(locale).filter((post) => post.isFeatured);
  const technicalPosts = getResearchPosts(locale).filter((post) => !post.isFeatured);

  return (
    <section id="research" className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <AnimateOnScroll className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rio-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rio-primary" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {isEnglish ? 'Research feed' : 'Feed de pesquisa'}
            </span>
          </div>
        </AnimateOnScroll>

        <div className="mb-32">
          <div className="grid gap-10 md:grid-cols-2">
            {featuredPosts.map((post, index) => (
              <AnimateOnScroll key={post.id} delay={index * 100}>
                <button
                  type="button"
                  onClick={() => onSelectPost?.(post)}
                  className="group relative flex h-[500px] w-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/5"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title.replace(/<br \/>/g, ' ')}
                      className="h-full w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-10">
                      <h4
                        className="mb-4 text-3xl font-bold leading-tight text-white transition-colors group-hover:text-blue-200"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <p className="max-w-md text-sm leading-relaxed text-white/70 line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </button>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {technicalPosts.length > 0 && (
          <div>
            <div className="mb-12 flex items-center gap-4 overflow-hidden">
              <h3 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                {isEnglish ? 'Technical index' : 'Índice técnico'}
              </h3>
              <div className="h-[1px] w-full bg-slate-100" />
            </div>
            <div className="grid gap-x-10 gap-y-16 lg:grid-cols-3">
              {technicalPosts.map((post, index) => (
                <AnimateOnScroll key={post.id} delay={index * 50}>
                  <button
                    type="button"
                    onClick={() => onSelectPost?.(post)}
                    className="group w-full cursor-pointer text-left"
                  >
                    <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-3xl border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-900/5">
                      <img
                        src={post.imageUrl}
                        alt={post.title.replace(/<br \/>/g, ' ')}
                        className="h-full w-full object-cover grayscale-[0.8] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rio-primary">
                        {isEnglish ? 'Technical report' : 'Relatório técnico'}
                      </span>
                      <span className="text-slate-200">/</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {post.date}
                      </span>
                    </div>
                    <h4
                      className="mb-4 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-rio-primary"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <p className="text-sm leading-relaxed text-slate-500 line-clamp-3">
                      {post.summary}
                    </p>
                  </button>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
