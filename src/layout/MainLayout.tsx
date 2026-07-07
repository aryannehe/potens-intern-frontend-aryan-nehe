import React from 'react';
import { Header } from '../components/Header';
import { useOffline } from '../hooks/useOffline';
import { useLanguage } from '../features/language/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWifiOff } from 'react-icons/fi';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isOnline = useOffline();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen min-h-svh bg-slate-50 text-slate-800 antialiased w-full relative">
      {/* Global Header */}
      <Header />

      {/* Connection Warning Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full bg-amber-500 text-white flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold shadow-sm select-none z-20"
            role="alert"
          >
            <FiWifiOff className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>{t.offline}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col relative pb-16">
        {children}
      </main>

      {/* Footer/Trademark - Sleek, minimal and authoritative */}
      <footer className="w-full text-center py-4 bg-transparent text-[10px] text-slate-400 font-semibold uppercase tracking-wider select-none max-w-md mx-auto">
        © 2026 Municipal Administration Office
      </footer>
    </div>
  );
};
