import { dbService } from './db';
import type { CivicIssue } from '../types';

export const syncService = {
  isSyncing: false,

  syncQueue: async (
    onSyncSuccess?: (issue: CivicIssue) => void,
    onToast?: (message: string, type: 'success' | 'info') => void,
    t?: any
  ): Promise<void> => {
    if (syncService.isSyncing) return;
    
    const queue = dbService.getQueue();
    if (queue.length === 0) return;

    syncService.isSyncing = true;
    if (onToast && t) {
      onToast(t.toastSyncing, 'info');
    }

    try {
      for (const issue of queue) {
        // Simulate network latency (Slow 3G tolerant simulation)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mark as synced
        const syncedIssue: CivicIssue = {
          ...issue,
          synced: true,
          status: 'submitted', // Starts lifecycle
        };

        // Save to submitted history
        dbService.saveToHistory(syncedIssue);
        
        // Remove from offline queue
        dbService.removeFromQueue(issue.id);

        if (onSyncSuccess) {
          onSyncSuccess(syncedIssue);
        }
      }

      if (onToast && t) {
        onToast(t.toastSyncSuccess, 'success');
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
    } finally {
      syncService.isSyncing = false;
    }
  }
};
