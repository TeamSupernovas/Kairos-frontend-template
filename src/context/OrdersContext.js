import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const OrdersContext = createContext();

const determineOrderStatus = (orderItems) => {
    if (!orderItems || orderItems.length === 0) return "pending"; // Default
  
    const statuses = orderItems.map(item => item.dishOrderStatus?.toLowerCase());
  
    const allCanceled = statuses.every(status => status === "canceled");
    const allCompleted = statuses.every(status => status === "completed");
    const allPending = statuses.every(status => status === "pending");
    const allConfirmed = statuses.every(status => status === "confirmed");
    const allReady = statuses.every(status => status === "ready");
  
    if (allCanceled) return "canceled";
    if (allCompleted) return "completed";
    if (allPending) return "pending";
    if (allConfirmed) return "confirmed";
    if (allReady) return "ready";
  
    return "pending"; // Mixed statuses
  };
  

export const OrdersProvider = ({ children }) => {
  const userId = useSelector((state) => state.auth.userId);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8008/orders/?user_id=${userId}`);
      const data = await response.json();
      const rawOrders = data.orders || [];
  
      // 👇 Update each order with the correct calculated status
      const updatedOrders = rawOrders.map(orderWrapper => {
        const updatedStatus = determineOrderStatus(orderWrapper.order_items);
        return {
          ...orderWrapper,
          order: {
            ...orderWrapper.order,
            orderStatus: updatedStatus,
          },
        };
      });
  
      setOrders(updatedOrders);
      
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, fetchOrders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
