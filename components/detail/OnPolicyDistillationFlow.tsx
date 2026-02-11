import React from 'react';
import { ArrowDown, Box, Brain, GraduationCap } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

interface OnPolicyDistillationFlowProps {
  teacherName: string;
  studentName: string;
  finalModelName: string;
}

const DESKTOP_PARTICLES = [
  { delay: 0, y: 20, size: 6, duration: 1.8 },
  { delay: 0.3, y: 45, size: 8, duration: 1.5 },
  { delay: 0.5, y: 30, size: 5, duration: 2.0 },
  { delay: 0.8, y: 55, size: 7, duration: 1.6 },
  { delay: 1.1, y: 15, size: 6, duration: 1.9 },
  { delay: 1.4, y: 40, size: 5, duration: 1.7 },
  { delay: 1.7, y: 60, size: 8, duration: 1.4 },
  { delay: 2.0, y: 25, size: 6, duration: 2.1 },
];

const MOBILE_PARTICLES = [
  { delay: 0, x: 30, size: 6, duration: 1.4 },
  { delay: 0.35, x: 55, size: 7, duration: 1.2 },
  { delay: 0.7, x: 40, size: 5, duration: 1.5 },
  { delay: 1.0, x: 65, size: 6, duration: 1.3 },
  { delay: 1.3, x: 25, size: 7, duration: 1.1 },
];

export const OnPolicyDistillationFlow: React.FC<OnPolicyDistillationFlowProps> = ({
  teacherName,
  studentName,
  finalModelName,
}) => {
  const { isEnglish } = useLocale();

  return (
    <section className="rounded-3xl p-6 sm:p-10">
      <div className="mt-10 rounded-[32px] bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex flex-col items-center gap-4 rounded-3xl px-8 py-6">
            <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rio-primary shadow-sm">
              On-Policy Distillation
            </p>

            <div className="mt-2 flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rio-primary/15">
                  <GraduationCap className="h-5 w-5 text-rio-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-prose">{teacherName}</p>
                  <p className="text-xs text-prose-light">{isEnglish ? 'Teacher' : 'Professor'}</p>
                </div>
              </div>

              <div className="relative hidden h-16 w-24 items-center justify-center sm:flex">
                {DESKTOP_PARTICLES.map((particle, index) => (
                  <span
                    key={`desktop-particle-${index}`}
                    className="absolute rounded-full bg-rio-primary shadow-lg shadow-rio-primary/40"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      top: `${particle.y}%`,
                      animationName: 'opdFlowHorizontal',
                      animationDuration: `${particle.duration}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${particle.delay}s`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>

              <div className="relative flex h-16 w-16 items-center justify-center sm:hidden">
                {MOBILE_PARTICLES.map((particle, index) => (
                  <span
                    key={`mobile-particle-${index}`}
                    className="absolute rounded-full bg-rio-primary shadow-lg shadow-rio-primary/40"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      left: `${particle.x}%`,
                      animationName: 'opdFlowVertical',
                      animationDuration: `${particle.duration}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${particle.delay}s`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Box className="h-5 w-5 text-slate-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-prose">{studentName}</p>
                  <p className="text-xs text-prose-light">{isEnglish ? 'Student' : 'Aluno'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="-mt-2 flex items-center justify-center py-0">
            <div className="flex flex-col items-center text-slate-300">
              <span className="block h-12 w-[2px] rounded-full bg-slate-300" />
              <ArrowDown className="-mt-1 h-6 w-6 text-slate-300" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rio-primary/15">
              <Brain className="h-6 w-6 text-rio-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-prose">{finalModelName}</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes opdFlowHorizontal {
          0% { left: -8px; opacity: 0; transform: translateY(0) scale(0.3); }
          20% { opacity: 0.85; transform: translateY(-6px) scale(1); }
          50% { transform: translateY(0) scale(0.9); }
          80% { opacity: 0.85; transform: translateY(6px) scale(1); }
          100% { left: calc(100% + 8px); opacity: 0; transform: translateY(0) scale(0.3); }
        }
        @keyframes opdFlowVertical {
          0% { top: -8px; opacity: 0; transform: translateX(0) scale(0.3); }
          20% { opacity: 0.85; transform: translateX(-6px) scale(1); }
          50% { transform: translateX(0) scale(0.9); }
          80% { opacity: 0.85; transform: translateX(6px) scale(1); }
          100% { top: calc(100% + 8px); opacity: 0; transform: translateX(0) scale(0.3); }
        }
      `}</style>
    </section>
  );
};
