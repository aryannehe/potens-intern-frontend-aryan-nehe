import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { useLanguage } from '../features/language/LanguageContext';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast(t.online, 'success', 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast(t.offline, 'warning', 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast, t.offline, t.online]);

  return isOnline;
};
