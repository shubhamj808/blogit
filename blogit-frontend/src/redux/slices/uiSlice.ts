import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }[];
}

const initialState: UiState = {
  darkMode: false,
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<{ type: 'success' | 'error' | 'info' | 'warning'; message: string }>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;