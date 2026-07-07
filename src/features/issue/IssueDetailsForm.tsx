import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { VoiceButton } from '../../components/VoiceButton';
import { UploadCard } from '../../components/UploadCard';
import { Button } from '../../components/Button';
import { useLanguage } from '../language/LanguageContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useToast } from '../../components/Toast';
import { dbService } from '../../services/db';
import type { LocationData, IssueCategory } from '../../types';
import { FiMapPin, FiCheck, FiX } from 'react-icons/fi';

interface IssueDetailsFormProps {
  category: IssueCategory;
  onBack: () => void;
  onSubmitSuccess: (data: IssueFormValues) => void;
}

// Zod schema builder driven by localized translations
const getFormSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .min(3, { message: t.errorTitleRequired })
      .max(50, { message: t.errorTitleMaxLength }),
    description: z
      .string()
      .min(10, { message: t.errorDescRequired })
      .max(500, { message: t.errorDescMaxLength }),
    photo: z.string().nullable(),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
        accuracy: z.number(),
        address: z.string().optional(),
      })
      .nullable(),
    address: z.string().optional(),
  });

export type IssueFormValues = z.infer<ReturnType<typeof getFormSchema>>;

export const IssueDetailsForm: React.FC<IssueDetailsFormProps> = ({
  category,
  onBack,
  onSubmitSuccess,
}) => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  
  // Geolocation states
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<boolean | null>(null);

  const {
    isSupported: isSpeechSupported,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const schema = getFormSchema(t);

  // Initialize form with local storage draft if matches current category
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      photo: null,
      location: null,
      address: '',
    },
  });

  const formValues = watch();
  const descValue = watch('description') || '';
  const locationValue = watch('location');

  // Load draft from LocalStorage on mount
  useEffect(() => {
    const savedDraft = dbService.getDraft();
    if (savedDraft && savedDraft.category === category) {
      if (savedDraft.title) setValue('title', savedDraft.title);
      if (savedDraft.description) setValue('description', savedDraft.description);
      if (savedDraft.photo) setValue('photo', savedDraft.photo);
      if (savedDraft.location) setValue('location', savedDraft.location);
      if (savedDraft.address) setValue('address', savedDraft.address);
    }
  }, [category, setValue]);

  // Auto-save draft on form value modifications
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formValues.title || formValues.description || formValues.photo || formValues.location) {
        dbService.saveDraft({
          category,
          title: formValues.title,
          description: formValues.description,
          photo: formValues.photo,
          location: formValues.location,
          address: formValues.address,
        });
      }
    }, 400); // Debounce local storage writes

    return () => clearTimeout(timer);
  }, [formValues, category]);

  // Handle Speech Transcription Result
  const handleVoiceTranscription = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language, (resultText) => {
        const space = descValue.length > 0 ? ' ' : '';
        const updatedDesc = descValue + space + resultText;
        setValue('description', updatedDesc.slice(0, 500), { shouldValidate: true });
        showToast('Speech transcribed successfully.', 'success', 2000);
      });
    }
  };

  // Browser Geolocation API Call
  const detectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      setLocationSuccess(false);
      return;
    }

    setIsDetectingLocation(true);
    setLocationSuccess(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: LocationData = {
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        };
        
        setValue('location', loc);
        setLocationSuccess(true);
        setIsDetectingLocation(false);
        showToast(t.fieldLocationSuccess, 'success');
      },
      (error) => {
        console.warn('Geolocation access error:', error);
        setLocationSuccess(false);
        setIsDetectingLocation(false);
        showToast(t.fieldLocationError, 'warning');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleFormSubmit = (data: IssueFormValues) => {
    onSubmitSuccess(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5 w-full max-w-md mx-auto px-4 py-5 text-left select-none"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-brand-blue-900 tracking-tight">
          {t.issueDetailsTitle}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t.issueDetailsDesc}
        </p>
      </div>

      {/* Title Field */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            label={t.fieldTitleLabel}
            placeholder={t.fieldTitlePlaceholder}
            error={errors.title?.message}
            maxLength={50}
            {...field}
          />
        )}
      />

      {/* Description & Speech Transcription Field */}
      <div className="flex flex-col gap-2">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              label={t.fieldDescLabel}
              placeholder={t.fieldDescPlaceholder}
              error={errors.description?.message}
              maxLength={500}
              valueLength={descValue.length}
              {...field}
            />
          )}
        />
        
        {/* Voice Button */}
        <VoiceButton
          isListening={isListening}
          isSupported={isSpeechSupported}
          onClick={handleVoiceTranscription}
          label={t.fieldVoiceStart}
          listeningLabel={t.fieldVoiceListening}
          unsupportedLabel={t.fieldVoiceUnsupported}
        />
      </div>

      {/* Photo Upload Card */}
      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <UploadCard
            label={t.fieldPhotoLabel}
            hint={t.fieldPhotoHint}
            removeLabel={t.fieldPhotoRemove}
            value={field.value}
            onChange={(base64) => field.onChange(base64)}
            error={errors.photo?.message}
          />
        )}
      />

      {/* Geolocation Section */}
      <div className="flex flex-col gap-2 p-4 bg-white border border-brand-blue-100 rounded-2xl shadow-sm text-left">
        <span className="text-xs font-semibold text-brand-blue-700 tracking-wide uppercase select-none">
          {t.fieldLocationLabel}
        </span>

        <div className="flex flex-col gap-3">
          {/* Action Trigger */}
          <Button
            type="button"
            variant={locationValue ? 'secondary' : 'primary'}
            onClick={detectLocation}
            isLoading={isDetectingLocation}
            className="flex items-center justify-center gap-2"
          >
            <FiMapPin className="w-4 h-4 flex-shrink-0" />
            <span>
              {isDetectingLocation ? t.fieldLocationDetecting : t.fieldLocationDetect}
            </span>
          </Button>

          {/* GPS Results */}
          {locationValue && locationSuccess && (
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-800 text-xs font-medium">
              <FiCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold">{t.fieldLocationSuccess}</span>
                <span className="font-mono text-[10px] mt-0.5">
                  Lat: {locationValue.lat}, Lng: {locationValue.lng} (±{locationValue.accuracy}m)
                </span>
              </div>
            </div>
          )}

          {locationSuccess === false && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 p-3 rounded-xl text-amber-800 text-xs font-medium">
              <FiX className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="leading-tight">{t.fieldLocationError}</span>
            </div>
          )}

          {/* Manual Address Input */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={t.fieldLocationPlaceholder}
                error={errors.address?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onBack}
        >
          {t.back}
        </Button>
        <Button type="submit" className="flex-1">
          {t.submit}
        </Button>
      </div>
    </form>
  );
};
