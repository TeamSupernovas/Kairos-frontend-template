// redux/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all: [],      // all notifications including initial + live
  unread: [],   // can be used for UI badge or highlights
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setInitialNotifications: (state, action) => {
      state.all = action.payload;
      state.unread = action.payload.filter(n => !n.read); // mark as unread notifications
    },
    addNotification: (state, action) => {
      state.all.push(action.payload);
      if (!action.payload.read) {
        state.unread.push(action.payload);
      }
    },
    // This will mark a notification as read and update both the 'all' and 'unread' lists
    updateNotification: (state, action) => {
      const { id, updatedData } = action.payload;
      const notification = state.all.find(n => n.id === id);
      if (notification) {
        Object.assign(notification, updatedData); // Update the notification's data (e.g., read status)
      }
      // If the notification was marked as read, remove it from unread list
      if (updatedData.read) {
        state.unread = state.unread.filter(n => n.id !== id);
      }
    },
    markAllAsRead: (state) => {
      state.all.forEach(notification => notification.read = true); // Mark all as read
      state.unread = []; // Clear unread list
    },
    clearNotifications: (state) => {
      state.all = [];
      state.unread = [];
    },
  },
});

export const {
  setInitialNotifications,
  addNotification,
  updateNotification,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
