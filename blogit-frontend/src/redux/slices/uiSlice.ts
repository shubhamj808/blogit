import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types/notification';

interface UiState {
  notifications: Notification[];
}

const initialState: UiState = {
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;