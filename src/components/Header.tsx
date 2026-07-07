import React from 'react';
import { LanguageSwitch } from './LanguageSwitch';
import { useLanguage } from '../features/language/LanguageContext';
import { FiGlobe } from 'react-icons/fi';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white border-b border-brand-blue-100 py-3.5 px-4 sticky top-0 z-30 select-none">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          {/* Logo Emblem - Shield indicating trust and official connection */}
          <div className="w-9 h-9 bg-brand-blue-900 rounded-xl flex items-center justify-center text-white shadow-glow-blue flex-shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-base font-extrabold text-brand-blue-900 tracking-tight leading-none m-0">
              {t.appName}
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 leading-tight uppercase tracking-wider mt-0.5">
              {t.appTagline}
            </span>
          </div>
        </div>

        {/* Action Elements */}
        <div className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4 text-brand-blue-400 hidden xs:block" />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};
