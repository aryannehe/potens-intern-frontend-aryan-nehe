import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from '../layout/MainLayout';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { CategorySelection } from '../features/issue/CategorySelection';
import { IssueDetailsForm } from '../features/issue/IssueDetailsForm';
import type { IssueFormValues } from '../features/issue/IssueDetailsForm';
import { ConfirmationScreen } from '../features/issue/ConfirmationScreen';
import { useOffline } from '../hooks/useOffline';
import { useToast } from '../components/Toast';
import { useLanguage } from '../features/language/LanguageContext';
import { dbService } from '../services/db';
import { syncService } from '../services/syncService';
import { generateReferenceID } from '../utils/helpers';
import type { AppStep, IssueCategory, CivicIssue } from '../types';

export const CivicConnectApp: React.FC = () => {
  const [step, setStep] = useState<AppStep>(1);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | null>(null);
  const [referenceId, setReferenceId] = useState<string>('');
  
  const isOnline = useOffline();
  const { showToast } = useToast();
  const { t } = useLanguage();

  // Automatic sync execution when user reconnects
  useEffect(() => {
    if (isOnline) {
      syncService.syncQueue(
        (syncedIssue) => {
          console.log('Synchronized ticket:', syncedIssue.referenceId);
        },
        (msg, type) => {
          showToast(msg, type === 'success' ? 'success' : 'info');
        },
        t
      );
    }
  }, [isOnline, showToast, t]);

  const handleSelectCategory = (category: IssueCategory) => {
    setSelectedCategory(category);
  };



  const handleFormSubmitSuccess = (values: IssueFormValues) => {
    const refId = generateReferenceID();
    
    // Create new civic issue ticket
    const newIssue: CivicIssue = {
      id: Math.random().toString(36).substring(2, 9),
      category: selectedCategory!,
      title: values.title,
      description: values.description,
      photo: values.photo,
      location: values.location,
      timestamp: Date.now(),
      status: 'submitted',
      referenceId: refId,
      synced: isOnline,
    };

    if (isOnline) {
      // Direct save to user history
      dbService.saveToHistory(newIssue);
      showToast(t.toastSubmitted, 'success');
    } else {
      // Enqueue to offline-first synchronization database
      dbService.enqueueIssue(newIssue);
      dbService.saveToHistory(newIssue);
      showToast(t.toastOfflineQueued, 'warning', 6000);
    }

    // Clear autosaved draft
    dbService.clearDraft();

    setReferenceId(refId);
    setStep(3);
  };

  const handleResetApp = () => {
    setSelectedCategory(null);
    setReferenceId('');
    setStep(1);
  };

  // Screen animation transition variants
  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  // Track page directions for animation spring
  const [direction, setDirection] = useState(1);

  const navigateToStep = (nextStep: AppStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  return (
    <MainLayout>
      {/* Top step wizard bar */}
      <ProgressIndicator currentStep={step} />

      <div className="flex-1 w-full flex flex-col justify-start relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <CategorySelection
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onContinue={() => navigateToStep(2)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <IssueDetailsForm
                category={selectedCategory!}
                onBack={() => navigateToStep(1)}
                onSubmitSuccess={handleFormSubmitSuccess}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <ConfirmationScreen referenceId={referenceId} onReset={handleResetApp} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};
