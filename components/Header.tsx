import React from 'react';
import type { View } from '../types/index';
import { useLocale } from '../contexts/LocaleContext';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Logos: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const { isEnglish } = useLocale();

  return (
    <button
      onClick={() => onNavigate('home')}
      className="flex items-center gap-4 text-sm text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary rounded-md"
    >
      <div className="flex items-center gap-2 font-bold text-slate-800">
        <img
          src="/logos/Logo%20Prefeitura%20Horizontal%202025.png"
          alt={isEnglish ? 'Rio de Janeiro City Hall logo' : 'Logo da Prefeitura do Rio de Janeiro'}
          className="h-10 w-auto"
        />
      </div>
    </button>
  );
};

const IplanRioLogo = () => {
  const { isEnglish } = useLocale();

  return (
    <div className="flex items-center">
      <img
        src="/logos/iplanrio%20logo%20horizontal.png"
        alt={isEnglish ? 'IplanRio logo' : 'Logo da IplanRio'}
        className="h-8 w-auto"
      />
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const navLinks: { name: string; view: View }[] = [
    { name: 'Home', view: 'home' },
    { name: 'Chat', view: 'chat' },
    { name: 'Open Source', view: 'opensource' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-6">
          <div className="flex-shrink-0">
            <Logos onNavigate={onNavigate} />
          </div>
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate(link.view)}
                    className={`text-[15px] font-medium transition-colors duration-200 ${
                      currentView === link.view
                        ? 'text-[#3262B7]'
                        : 'text-[#212529] hover:text-rio-primary'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex-shrink-0">
            <IplanRioLogo />
          </div>
        </div>
      </div>
    </header>
  );
};
