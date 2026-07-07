import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import { FiCheck } from 'react-icons/fi';

interface SubmissionTimelineProps {
  status: 'submitted' | 'under_review' | 'assigned' | 'resolved';
}

export const SubmissionTimeline: React.FC<SubmissionTimelineProps> = ({ status }) => {
  const { t } = useLanguage();

  const statusOrder: Array<'submitted' | 'under_review' | 'assigned' | 'resolved'> = [
    'submitted',
    'under_review',
    'assigned',
    'resolved',
  ];

  const getStepDetails = (id: typeof statusOrder[number]) => {
    switch (id) {
      case 'submitted':
        return { label: t.timelineSubmitted, desc: t.timelineSubmittedDesc };
      case 'under_review':
        return { label: t.timelineUnderReview, desc: t.timelineUnderReviewDesc };
      case 'assigned':
        return { label: t.timelineAssigned, desc: t.timelineAssignedDesc };
      case 'resolved':
      default:
        return { label: t.timelineResolved, desc: t.timelineResolvedDesc };
    }
  };

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full py-4 text-left select-none">
      <div className="flex flex-col relative pl-6 border-l-2 border-slate-100 ml-4 gap-6">
        {statusOrder.map((step, index) => {
          const { label, desc } = getStepDetails(step);
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step} className="relative flex flex-col gap-0.5">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 z-10 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-glow-emerald'
                    : 'bg-white border-slate-200 text-transparent'
                }`}
                aria-hidden="true"
              >
                {isCompleted && <FiCheck className="w-3.5 h-3.5 stroke-[3.5]" />}
              </div>

              {/* Step Info */}
              <h4
                className={`text-sm font-bold leading-none ${
                  isActive
                    ? 'text-brand-blue-900'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </h4>
              <p
                className={`text-xs leading-relaxed mt-1 ${
                  isCompleted ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
