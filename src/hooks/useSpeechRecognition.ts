import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../components/Toast';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop after a pause
      rec.interimResults = false;
      recognitionRef.current = rec;
    }
  }, []);

  const startListening = useCallback((lang: 'en' | 'mr', onResult: (text: string) => void) => {
    if (!isSupported || !recognitionRef.current) return;

    // Set voice language mapping
    recognitionRef.current.lang = lang === 'mr' ? 'mr-IN' : 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        onResult(resultText);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        showToast('Microphone access denied. Please enable microphone permissions in your browser.', 'error');
      } else if (event.error === 'network') {
        showToast('Network error during voice transcription. Please type manually.', 'error');
      } else {
        showToast(`Voice input error: ${event.error}`, 'error');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
    }
  }, [isSupported, showToast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isSupported,
    isListening,
    startListening,
    stopListening,
  };
};
