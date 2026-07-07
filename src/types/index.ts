export type IssueCategory =
  | 'road_damage'
  | 'garbage'
  | 'street_light'
  | 'water_leakage'
  | 'public_transport'
  | 'electricity'
  | 'other';

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  address?: string;
}

export interface CivicIssue {
  id: string;
  category: IssueCategory;
  title: string;
  description: string;
  photo: string | null; // base64 string representation
  location: LocationData | null;
  address?: string; // manual address/landmark details
  timestamp: number;
  status: 'submitted' | 'under_review' | 'assigned' | 'resolved';
  referenceId: string;
  synced: boolean;
}

export type AppStep = 1 | 2 | 3;

export interface TranslationKeys {
  appName: string;
  tagline: string;
  appTagline: string; // Dynamic header tagline
  step: string;
  continue: string;
  back: string;
  submit: string;
  online: string;
  offline: string;
  
  // Screen 1: Categories
  selectCategoryTitle: string;
  selectCategoryDesc: string;
  road_damage: string;
  road_damage_desc: string;
  garbage: string;
  garbage_desc: string;
  street_light: string;
  street_light_desc: string;
  water_leakage: string;
  water_leakage_desc: string;
  public_transport: string;
  public_transport_desc: string;
  electricity: string;
  electricity_desc: string;
  other: string;
  other_desc: string;
  
  // Screen 2: Details Form
  issueDetailsTitle: string;
  issueDetailsDesc: string;
  fieldTitleLabel: string;
  fieldTitlePlaceholder: string;
  fieldDescLabel: string;
  fieldDescPlaceholder: string;
  fieldPhotoLabel: string;
  fieldPhotoHint: string;
  fieldPhotoRemove: string;
  fieldVoiceLabel: string;
  fieldVoiceListening: string;
  fieldVoiceStart: string;
  fieldVoiceUnsupported: string;
  fieldLocationLabel: string;
  fieldLocationDetect: string;
  fieldLocationDetecting: string;
  fieldLocationSuccess: string;
  fieldLocationError: string;
  fieldLocationPlaceholder: string;
  charCounter: string;
  
  // Screen 2 Errors
  errorTitleRequired: string;
  errorTitleMaxLength: string;
  errorDescRequired: string;
  errorDescMaxLength: string;
  errorImageSize: string;
  errorImageType: string;
  errorImageProcess: string;
  
  // Screen 3: Confirmation
  successTitle: string;
  successDesc: string;
  refIdLabel: string;
  copiedText: string;
  copyLabel: string;
  shareLabel: string;
  reportAnother: string;
  
  // Timeline States
  timelineSubmitted: string;
  timelineSubmittedDesc: string;
  timelineUnderReview: string;
  timelineUnderReviewDesc: string;
  timelineAssigned: string;
  timelineAssignedDesc: string;
  timelineResolved: string;
  timelineResolvedDesc: string;

  // New translations for hardcoded strings
  loadingText: string;
  processingImage: string;
  toastSubmitted: string;
  toastOfflineQueued: string;
  toastSyncing: string;
  toastSyncSuccess: string;
  toastSharedSuccess: string;
  toastShareCopied: string;
  timelineTitle: string;
}
