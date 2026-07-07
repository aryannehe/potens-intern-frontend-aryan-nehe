import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiTrash2, FiLoader } from 'react-icons/fi';
import { useLanguage } from '../features/language/LanguageContext';
import { compressImage } from '../utils/helpers';

interface UploadCardProps {
  label: string;
  hint: string;
  removeLabel: string;
  value: string | null; // base64 string
  onChange: (base64: string | null) => void;
  error?: string;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  label,
  hint,
  removeLabel,
  value,
  onChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFile = async (file: File) => {
    setLocalError(null);

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError(t.errorImageSize);
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setLocalError(t.errorImageType);
      return;
    }

    setIsCompressing(true);
    try {
      const base64 = await compressImage(file);
      onChange(base64);
    } catch (err) {
      console.error('Image compression error:', err);
      setLocalError(t.errorImageProcess);
    } finally {
      setIsCompressing(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeError = error || localError;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <span className="text-xs font-semibold text-brand-blue-700 tracking-wide uppercase select-none">
        {label}
      </span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="hidden"
        aria-invalid={activeError ? 'true' : 'false'}
      />

      <div
        onClick={triggerUpload}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 focus-ring min-h-[140px] select-none ${
          dragActive
            ? 'border-brand-blue-800 bg-brand-blue-50/50 scale-[1.01]'
            : 'border-brand-blue-200 hover:border-brand-blue-400 bg-white hover:bg-slate-50'
        } ${activeError ? 'border-brand-red-500' : ''}`}
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center gap-3 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl overflow-hidden max-h-[180px] w-full max-w-[280px] border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                <img
                  src={value}
                  alt="Issue thumbnail preview"
                  className="w-full h-full object-contain max-h-[180px]"
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-2 text-xs font-semibold text-brand-red-600 bg-brand-red-50 hover:bg-brand-red-100 px-3.5 py-2 rounded-xl transition-colors focus-ring min-h-[36px]"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>{removeLabel}</span>
              </button>
            </motion.div>
          ) : isCompressing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <FiLoader className="w-7 h-7 text-brand-blue-500 animate-spin" />
              <span className="text-xs font-medium text-slate-500">{t.processingImage}</span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="p-3 bg-brand-blue-50 rounded-full text-brand-blue-500 mb-1">
                <FiCamera className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-700 leading-tight">
                {hint}
              </span>
              <span className="text-xs text-slate-400">
                JPEG, PNG, WebP up to 5MB
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeError && (
        <span role="alert" className="text-xs font-semibold text-brand-red-600 mt-0.5">
          {activeError}
        </span>
      )}
    </div>
  );
};
