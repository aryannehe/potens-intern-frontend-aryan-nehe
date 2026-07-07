import type { IssueCategory } from '../types';

export interface CategoryItem {
  id: IssueCategory;
  iconType: 'road' | 'garbage' | 'light' | 'water' | 'transport' | 'electricity' | 'other';
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'road_damage', iconType: 'road' },
  { id: 'garbage', iconType: 'garbage' },
  { id: 'street_light', iconType: 'light' },
  { id: 'water_leakage', iconType: 'water' },
  { id: 'public_transport', iconType: 'transport' },
  { id: 'electricity', iconType: 'electricity' },
  { id: 'other', iconType: 'other' },
];
