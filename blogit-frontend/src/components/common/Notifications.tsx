import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeNotification, addNotification } from '../../redux/slices/uiSlice';

interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export const useNotification = () => {
  const dispatch = useDispatch();

  const showNotification = (options: NotificationOptions) => {
    dispatch(addNotification({
      ...options,
      id: Date.now().toString()
    }));
  };

  const hideNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return { showNotification, hideNotification };
};

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);

  useEffect(() => {
    // Remove notifications after 5 seconds
    notifications.forEach(notification => {
      setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-100 text-red-800'
              : notification.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <p className="pr-4">{notification.message}</p>
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            className="text-sm opacity-75 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications; 