import React from 'react';
import { useLanguage } from '../features/language/LanguageContext';

interface StatusBadgeProps {
  status: 'submitted' | 'under_review' | 'assigned' | 'resolved';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();

  const config = {
    submitted: {
      label: t.timelineSubmitted,
      bg: 'bg-brand-blue-50 text-brand-blue-700 border-brand-blue-100',
    },
    under_review: {
      label: t.timelineUnderReview,
      bg: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    assigned: {
      label: t.timelineAssigned,
      bg: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    resolved: {
      label: t.timelineResolved,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none ${current.bg}`}
    >
      {current.label}
    </span>
  );
};
