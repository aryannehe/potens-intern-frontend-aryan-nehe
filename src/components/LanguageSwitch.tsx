import React from 'react';
import { useLanguage } from '../features/language/LanguageContext';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex p-0.5 bg-brand-blue-50 border border-brand-blue-100 rounded-xl select-none">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus-ring min-h-0 ${
          language === 'en'
            ? 'bg-white text-brand-blue-900 shadow-sm'
            : 'text-brand-blue-500 hover:text-brand-blue-800'
        }`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('mr')}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus-ring min-h-0 ${
          language === 'mr'
            ? 'bg-white text-brand-blue-900 shadow-sm'
            : 'text-brand-blue-500 hover:text-brand-blue-800'
        }`}
        aria-label="मराठीमध्ये बदला"
        aria-pressed={language === 'mr'}
      >
        मराठी
      </button>
    </div>
  );
};
