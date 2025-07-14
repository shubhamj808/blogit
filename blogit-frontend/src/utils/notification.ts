import { Notification } from '../types/notification';

export const createNotification = (
  type: 'success' | 'error' | 'warning' | 'info',
  message: string
): Notification => ({
  id: Date.now().toString(),
  type,
  message,
}); 