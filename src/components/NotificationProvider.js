import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import {
  setInitialNotifications,
  addNotification,
} from "../redux/notificationSlice";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const connectWebSocket = (userId) => {
    const socket = new WebSocket(`${process.env.REACT_APP_NOTIFICATION_SERVICE}/${userId}`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to Notification Service");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("New notification:", message);
      dispatch(addNotification(message));
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected. Reconnecting...");
      reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(userId), 3000);
    };
  };

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const userId = user.sub.split("|")[1];

      // Initial fetch before WebSocket
      const fetchInitialNotifications = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_SERVICE}/${userId}/initial`);
          if (response.ok) {
            const data = await response.json();
            dispatch(setInitialNotifications(data));
          } else {
            console.error("Failed to fetch initial notifications");
          }
        } catch (e) {
          console.error("Error fetching initial notifications", e);
        }
      };

      fetchInitialNotifications();
      connectWebSocket(userId);
    }

    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectTimeoutRef.current);
    };
  }, [isAuthenticated, user, dispatch]);

  return <NotificationContext.Provider value={{}}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);
