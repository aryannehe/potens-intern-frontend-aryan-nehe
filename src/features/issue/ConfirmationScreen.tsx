import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { SubmissionTimeline } from './SubmissionTimeline';
import { useLanguage } from '../language/LanguageContext';
import { useToast } from '../../components/Toast';
import { FiCopy, FiShare2, FiPlusCircle, FiCheck } from 'react-icons/fi';

interface ConfirmationScreenProps {
  referenceId: string;
  onReset: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  referenceId,
  onReset,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  // Typewriter effect for Reference ID
  const [displayedId, setDisplayedId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayedId('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < referenceId.length) {
        setDisplayedId((prev) => prev + referenceId.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [referenceId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    showToast(t.copiedText, 'success', 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareData = {
      title: `CivicConnect Ticket ${referenceId}`,
      text: `Track my civic issue report: ${referenceId}`,
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => showToast(t.toastSharedSuccess, 'success'))
        .catch((e) => console.log('Share failed:', e));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/ticket/${referenceId}`);
      showToast(t.toastShareCopied, 'success');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 py-5 text-center select-none items-center">
      {/* SVG Success Checkmark Animation */}
      <div className="relative w-20 h-20 flex items-center justify-center bg-emerald-50 rounded-full border border-emerald-100 shadow-glow-emerald mt-2">
        <motion.svg
          className="w-10 h-10 text-emerald-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M20 6L9 17L4 12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
              delay: 0.1,
            }}
          />
        </motion.svg>
      </div>

      {/* Success Title & Description */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-brand-blue-900 tracking-tight">
          {t.successTitle}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {t.successDesc}
        </p>
      </div>

      {/* Reference Ticket Box */}
      <div className="w-full bg-white border border-brand-blue-100 rounded-2xl p-4.5 shadow-sm text-left flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-brand-blue-500 uppercase tracking-wide">
            {t.refIdLabel}
          </span>
          <span className="text-lg font-mono font-extrabold text-brand-blue-900 tracking-wider h-7 flex items-center">
            {displayedId}
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 border border-brand-blue-100/60 rounded-xl text-xs font-bold text-brand-blue-800 hover:bg-slate-100 active:scale-[0.98] transition-all focus-ring min-h-[38px]"
            aria-label={t.copyLabel}
          >
            {copied ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{t.copiedText}</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5 text-brand-blue-600" />
                <span>{t.copyLabel}</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 border border-brand-blue-100/60 rounded-xl text-xs font-bold text-brand-blue-800 hover:bg-slate-100 active:scale-[0.98] transition-all focus-ring min-h-[38px]"
            aria-label={t.shareLabel}
          >
            <FiShare2 className="w-3.5 h-3.5 text-brand-blue-600" />
            <span>{t.shareLabel}</span>
          </button>
        </div>
      </div>

      {/* Timeline Tracking visualization */}
      <div className="w-full bg-white border border-brand-blue-100 rounded-2xl p-4 shadow-sm">
        <span className="text-xs font-semibold text-brand-blue-700 tracking-wide uppercase block text-left mb-4 select-none">
          {t.timelineTitle}
        </span>
        {/* Simulating 'submitted' phase */}
        <SubmissionTimeline status="submitted" />
      </div>

      {/* Reset Action */}
      <div className="w-full mt-2">
        <Button
          fullWidth={true}
          variant="secondary"
          onClick={onReset}
          className="flex items-center justify-center gap-2"
        >
          <FiPlusCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t.reportAnother}</span>
        </Button>
      </div>
    </div>
  );
};
