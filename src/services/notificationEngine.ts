export type NotificationChannel = 'WHATSAPP' | 'SMS' | 'PUSH';

export interface AppNotification {
  id: string;
  recipientRole: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  recipientId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    recipientRole: 'CUSTOMER',
    recipientId: 'usr_cust_01',
    title: '✨ Service Completed & Verified',
    message: 'Your Toyota Fortuner (KA 03 MX 4492) at Slot B2-104 has been cleaned by Ramesh Kumar. Tap to view before/after photo proof.',
    channel: 'WHATSAPP',
    timestamp: '06:52 AM',
    isRead: false
  },
  {
    id: 'notif_02',
    recipientRole: 'CUSTOMER',
    recipientId: 'usr_cust_01',
    title: '🚗 Cleaner En Route to Slot',
    message: 'Ramesh Kumar (#AC-104) has arrived in Basement 2 and started today\'s exterior care service.',
    channel: 'PUSH',
    timestamp: '06:34 AM',
    isRead: true
  },
  {
    id: 'notif_03',
    recipientRole: 'PROVIDER',
    recipientId: 'prov_ramesh_01',
    title: '📋 Today\'s Morning Manifest Ready',
    message: '28 cars scheduled in Prestige Lakeside Habitat (Basement 2). Check-in completed at 05:42 AM.',
    channel: 'SMS',
    timestamp: '05:45 AM',
    isRead: true
  },
  {
    id: 'notif_04',
    recipientRole: 'ADMIN',
    recipientId: 'usr_admin_01',
    title: '⚠️ Service Dispute Logged',
    message: 'Customer Arjun Nambiar filed a review for Slot B2-104 (Category: Missed Spots). Photo audit available in Operations Console.',
    channel: 'PUSH',
    timestamp: '07:05 AM',
    isRead: false
  }
];

class NotificationService {
  private notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];
  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getNotificationsForRole(role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'): AppNotification[] {
    return this.notifications.filter(n => n.recipientRole === role);
  }

  public getUnreadCount(role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'): number {
    return this.notifications.filter(n => n.recipientRole === role && !n.isRead).length;
  }

  public markAllAsRead(role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN') {
    this.notifications.forEach(n => {
      if (n.recipientRole === role) n.isRead = true;
    });
    this.notify();
  }

  public sendNotification(item: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotif: AppNotification = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    this.notifications.unshift(newNotif);
    this.notify();
  }
}

export const notificationService = new NotificationService();
