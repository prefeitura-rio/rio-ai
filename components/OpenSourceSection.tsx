import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import type { Model } from '../types/index';
import { ModelCard } from './ModelCard';
import { useLocale } from '../contexts/LocaleContext';

interface OpenSourceSectionProps {
  models: Model[];
  onSelectModel: (model: Model) => void;
}

export const OpenSourceSection: React.FC<OpenSourceSectionProps> = ({ models, onSelectModel }) => {
  const { isEnglish } = useLocale();

  return (
    <section id="open-source" className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-[linear-gradient(90deg,#3F38AC_0%,#429FEB_100%)] bg-clip-text text-transparent sm:text-4xl">
            {isEnglish ? 'Democratizing AI in Brazil' : 'Democratizando a IA no Brasil'}
          </h2>
          <p className="mt-4 text-lg text-prose-light">
            {isEnglish
              ? 'We believe in the power of collaboration to accelerate innovation. Explore our open-source models under the MIT license and join us in building the future of artificial intelligence.'
              : 'Acreditamos no poder da colaboração para acelerar a inovação. Explore nossos modelos de código aberto, sob a licença MIT, e junte-se a nós na construção do futuro da inteligência artificial.'}
          </p>
        </AnimateOnScroll>

        <div className="mt-16 max-w-[96rem] mx-auto grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {models.map((model, index) => (
            <AnimateOnScroll key={model.name} delay={index * 100}>
              <ModelCard model={model} onSelectModel={onSelectModel} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
