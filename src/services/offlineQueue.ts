export interface QueuedPhotoUpload {
  id: string;
  jobId: string;
  slotNumber: string;
  type: 'BEFORE' | 'AFTER';
  photoDataUrl: string;
  capturedAt: string;
  status: 'PENDING_SYNC' | 'SYNCING' | 'SYNCED';
  attempts: number;
}

class OfflineSyncManager {
  private queue: QueuedPhotoUpload[] = [];
  private isOnline: boolean = true;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('auracar_offline_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auracar_offline_queue', JSON.stringify(this.queue));
    } catch {
      // Fallback
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(l => l());
  }

  public getQueue(): QueuedPhotoUpload[] {
    return this.queue;
  }

  public getPendingCount(): number {
    return this.queue.filter(q => q.status === 'PENDING_SYNC').length;
  }

  public isNetworkConnected(): boolean {
    return this.isOnline;
  }

  public setNetworkStatus(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.flushQueue();
    }
    this.notify();
  }

  public enqueuePhoto(item: Omit<QueuedPhotoUpload, 'id' | 'status' | 'attempts'>): QueuedPhotoUpload {
    const queuedItem: QueuedPhotoUpload = {
      ...item,
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: this.isOnline ? 'SYNCED' : 'PENDING_SYNC',
      attempts: 0
    };

    this.queue.unshift(queuedItem);
    this.notify();

    if (this.isOnline) {
      // Direct sync simulation
      setTimeout(() => {
        queuedItem.status = 'SYNCED';
        this.notify();
      }, 600);
    }

    return queuedItem;
  }

  public flushQueue() {
    if (!this.isOnline) return;

    this.queue.forEach(item => {
      if (item.status === 'PENDING_SYNC') {
        item.status = 'SYNCING';
        setTimeout(() => {
          item.status = 'SYNCED';
          this.notify();
        }, 800);
      }
    });
    this.notify();
  }

  public clearSynced() {
    this.queue = this.queue.filter(q => q.status !== 'SYNCED');
    this.notify();
  }
}

export const offlineSync = new OfflineSyncManager();
