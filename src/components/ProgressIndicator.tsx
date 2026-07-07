import React from 'react';
import { useLanguage } from '../features/language/LanguageContext';
import type { AppStep } from '../types';

interface ProgressIndicatorProps {
  currentStep: AppStep;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const { t } = useLanguage();
  const totalSteps = 3;

  // Percentage calculated for progress bar width
  const progressPercent = (currentStep / totalSteps) * 100;

  // Localized label mapping
  const stepLabels = {
    1: t.selectCategoryTitle,
    2: t.issueDetailsTitle,
    3: t.successTitle,
  };

  return (
    <div className="w-full bg-white px-4 py-3 border-b border-brand-blue-50 select-none">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-blue-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-brand-blue-900 uppercase tracking-wide">
            {t.step} {currentStep} / {totalSteps}
          </span>
          <span className="font-semibold text-slate-500 truncate max-w-[200px] text-right">
            {stepLabels[currentStep]}
          </span>
        </div>
      </div>
    </div>
  );
};
