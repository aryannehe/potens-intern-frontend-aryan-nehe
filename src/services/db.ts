import type { CivicIssue } from '../types';

const DRAFT_KEY = 'civic_connect_draft';
const QUEUE_KEY = 'civic_connect_queue';
const HISTORY_KEY = 'civic_connect_history';

export const dbService = {
  // Draft Management
  saveDraft: (draft: Partial<CivicIssue>): void => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error('Error saving draft to localStorage:', e);
    }
  },

  getDraft: (): Partial<CivicIssue> | null => {
    try {
      const data = localStorage.getItem(DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading draft from localStorage:', e);
      return null;
    }
  },

  clearDraft: (): void => {
    localStorage.removeItem(DRAFT_KEY);
  },

  // Offline Submission Queue Management
  enqueueIssue: (issue: CivicIssue): void => {
    try {
      const queue = dbService.getQueue();
      queue.push(issue);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Error queueing issue to localStorage:', e);
    }
  },

  getQueue: (): CivicIssue[] => {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading queue from localStorage:', e);
      return [];
    }
  },

  clearQueue: (): void => {
    localStorage.removeItem(QUEUE_KEY);
  },

  removeFromQueue: (id: string): void => {
    try {
      const queue = dbService.getQueue();
      const filtered = queue.filter((item) => item.id !== id);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error removing issue from queue:', e);
    }
  },

  // Submitted Tickets History Management
  saveToHistory: (issue: CivicIssue): void => {
    try {
      const history = dbService.getHistory();
      // Add or update
      const index = history.findIndex((item) => item.id === issue.id);
      if (index > -1) {
        history[index] = issue;
      } else {
        history.unshift(issue); // latest first
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
    } catch (e) {
      console.error('Error saving history to localStorage:', e);
    }
  },

  getHistory: (): CivicIssue[] => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading history from localStorage:', e);
      return [];
    }
  }
};
