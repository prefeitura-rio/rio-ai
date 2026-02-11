import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OpenSourceSection } from './components/OpenSourceSection';
import { ModelDetailView } from './components/ModelDetailView';
import { ErrorBoundary, ChatErrorBoundary, SectionErrorBoundary } from './components/ErrorBoundary';
import { ChatSection } from './components/ChatSection';
import type { Model, View } from './types/index';
import { getRioModels } from './constants';
import { LocaleProvider, useLocale } from './contexts/LocaleContext';

const FloatingLanguageToggle = () => {
  const { isEnglish, toggleLocale } = useLocale();
  const isPtBr = !isEnglish;

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={isPtBr ? 'Mudar para inglês' : 'Switch to Brazilian Portuguese'}
      className="fixed z-[60] inline-flex items-center rounded-full border border-slate-300 bg-white p-1 text-xs font-semibold text-slate-700 shadow-md sm:bottom-6 sm:right-6"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <span
        className={`rounded-full px-3 py-1 ${isPtBr ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
      >
        PT-BR
      </span>
      <span
        className={`rounded-full px-3 py-1 ${!isPtBr ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`}
      >
        EN
      </span>
    </button>
  );
};

const AppContent = () => {
  const { locale } = useLocale();
  const models = useMemo(() => getRioModels(locale), [locale]);
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  const selectedModel = useMemo<Model | null>(() => {
    if (!selectedModelName) return null;
    return models.find((model) => model.name === selectedModelName) ?? null;
  }, [models, selectedModelName]);

  const handleSelectModel = (model: Model) => {
    setSelectedModelName(model.name);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedModelName(null);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setSelectedModelName(null);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatErrorBoundary>
            <ChatSection />
          </ChatErrorBoundary>
        );
      case 'opensource': {
        const openSourceModels = models.filter(
          (m) => m.isOpenSource && m.name.includes('Open'),
        );
        return openSourceModels.length > 0 ? (
          <SectionErrorBoundary sectionName="OpenSource">
            <OpenSourceSection models={openSourceModels} onSelectModel={handleSelectModel} />
          </SectionErrorBoundary>
        ) : null;
      }
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <ErrorBoundary name="App">
      <div className="min-h-screen bg-white font-sans">
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main>
          {selectedModel ? (
            <ErrorBoundary name="ModelDetail">
              <ModelDetailView model={selectedModel} onBack={handleBack} />
            </ErrorBoundary>
          ) : (
            renderView()
          )}
        </main>
        <FloatingLanguageToggle />
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <LocaleProvider>
      <AppContent />
    </LocaleProvider>
  );
}

export default App;
