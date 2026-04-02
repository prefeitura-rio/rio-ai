import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  AttentionAccuracyChart,
  ManyNeedlesChart,
  TTABenchmarkChart,
} from './detail/TTABenchmarkChart';
import { Rio3EvalMiniCharts } from './detail/Rio3EvalMiniCharts';
import { Rio3UltraBenchmarkChart } from './detail/Rio3UltraBenchmarkChart';
import { TTATypingCallout } from './detail/TTATypingCallout';
import SpinningEarth from './SpinningEarth';
import type { Model, ResearchPost } from '../types/index';

interface ResearchDetailViewProps {
  post: ResearchPost;
  onBack: () => void;
  onSelectModel?: (model: Model) => void;
}

export const ResearchDetailView: React.FC<ResearchDetailViewProps> = ({
  post,
  onBack,
  onSelectModel,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  return (
    <div className="min-h-screen bg-white pb-24">
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-rio-primary"
        style={{ scaleX }}
      />

      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="group fixed top-6 left-6 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
        aria-label="Go back to research"
      >
        <ChevronLeft className="h-5 w-5 text-slate-600 transition-colors group-hover:text-rio-primary" />
        <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-rio-primary">
          Back
        </span>
      </motion.button>

      <article className="pt-16 md:pt-24">
        <header className="container mx-auto mb-8 max-w-4xl px-6">
          <h1
            className="mb-0 text-center text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-7xl"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </header>

        <main className="container mx-auto max-w-3xl px-6">
          <div className="prose prose-slate prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="mt-16 mb-8 text-3xl font-bold tracking-tight text-slate-900"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="mt-14 mb-6 border-b border-slate-100 pb-4 text-2xl font-bold text-slate-900"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="mt-10 mb-5 text-xl font-bold text-slate-900" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-12 text-lg leading-[1.8] text-slate-600" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="mb-8 ml-6 list-outside list-disc space-y-4 text-slate-600"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="font-medium marker:text-rio-primary" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="my-12 rounded-2xl border-l-4 border-rio-primary bg-slate-50 px-8 py-10 text-2xl font-medium leading-relaxed text-slate-800 italic"
                    {...props}
                  />
                ),
                code: ({ node, inline, className, children, ...props }: any) => {
                  const content = String(children).trim();
                  if (!inline && content === 'TTA_BENCHMARK_CHART') {
                    return <TTABenchmarkChart />;
                  }
                  if (!inline && content === 'RIO3_ULTRA_BENCHMARK_CHART') {
                    return <Rio3UltraBenchmarkChart />;
                  }
                  if (!inline && content === 'RIO3_EVAL_MINI_CHARTS') {
                    return <Rio3EvalMiniCharts onSelectModel={onSelectModel} />;
                  }
                  if (!inline && content === 'ATTENTION_ACCURACY_CHART') {
                    return <AttentionAccuracyChart />;
                  }
                  if (!inline && content === 'MANY_NEEDLES_CHART') {
                    return <ManyNeedlesChart />;
                  }
                  if (!inline && content === 'TTA_TYPEWRITER_CALLOUT') {
                    return <TTATypingCallout />;
                  }
                  if (!inline && content === 'SPINNING_EARTH_VISUALIZATION') {
                    return <SpinningEarth />;
                  }
                  return (
                    <code
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-rio-primary"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                img: ({ node, ...props }) => (
                  <div className="my-16 flex flex-col items-center">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/10">
                      <img className="h-auto max-w-full" {...props} />
                    </div>
                    {props.alt && (
                      <span className="mt-4 text-sm font-medium text-slate-400">
                        — {props.alt}
                      </span>
                    )}
                  </div>
                ),
              }}
            >
              {post.content || post.summary}
            </ReactMarkdown>
          </div>
        </main>
      </article>
    </div>
  );
};
