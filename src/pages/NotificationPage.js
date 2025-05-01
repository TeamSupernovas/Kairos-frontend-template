import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, updateNotification } from "../redux/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";
import ProfileHeader from "../components/ProfileHeader";

const NotificationPage = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.all);
  const [isBellAnimated, setBellAnimated] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      dispatch(addNotification(data));
      setBellAnimated(true);
      setTimeout(() => setBellAnimated(false), 1500);
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [socket, dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_NOTIFICATION_READ_SERVICE}/${id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        dispatch(updateNotification({ id, updatedData: { read: true } }));
      } else {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <>
    <ProfileHeader />
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center justify-start py-12 px-4">
      <motion.div

        className="w-full max-w-4xl bg-white/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-t-3xl relative">
          <motion.div
            animate={isBellAnimated ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
            transition={{ duration: 0.6 }}
          >
            <FaBell className="text-2xl drop-shadow-lg" />
          </motion.div>
          <h4 className="font-bold tracking-wide">Notifications</h4>
        </div>

        {/* Body */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center text-gray-500">
            <img src="https://www.svgrepo.com/show/413181/notification-bell.svg" alt="No notifications" className="w-32 h-32 mb-4 opacity-60" />
            <p className="text-lg">You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {sortedNotifications.map((n) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className={`p-6 cursor-pointer transition-all group ${
                    !n.read ? "bg-green-50 hover:bg-green-100" : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-semibold text-gray-800 mb-1">{n.type}</p>
                      <p className="text-gray-700">{n.message}</p>
                    </div>
                    <span
                      className={`ml-4 mt-1 text-xs px-3 py-1 rounded-full shadow-sm ${
                        n.read
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-300 text-green-800 animate-pulse group-hover:animate-none"
                      }`}
                    >
                      {n.read ? "Read" : "Unread"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-3 italic">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default NotificationPage;
