import React from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  listeningLabel: string;
  unsupportedLabel: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isSupported,
  onClick,
  label,
  listeningLabel,
  unsupportedLabel,
}) => {
  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 select-none">
        <FiMicOff className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-medium">{unsupportedLabel}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center gap-3 px-4 py-3 border rounded-xl font-medium text-xs transition-all duration-200 focus-ring min-h-[44px] w-full select-none ${
        isListening
          ? 'bg-brand-red-50 border-brand-red-200 text-brand-red-600 animate-pulse-subtle'
          : 'bg-white border-brand-blue-200 text-brand-blue-700 hover:bg-brand-blue-50 active:scale-[0.98]'
      }`}
      aria-label={isListening ? listeningLabel : label}
    >
      {isListening ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red-500"></span>
          </span>
          <span>{listeningLabel}</span>
        </>
      ) : (
        <>
          <FiMic className="w-4 h-4 text-brand-blue-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
