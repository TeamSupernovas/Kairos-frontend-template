import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const OrdersContext = createContext();

const determineOrderStatus = (orderItems) => {
  if (!orderItems || orderItems.length === 0) return "pending";

  const statusCounts = orderItems.reduce((acc, item) => {
    const status = item.dishOrderStatus?.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Priority order: pending > confirmed > ready > completed > canceled
  const priority = ["pending", "confirmed", "ready", "completed", "canceled"];

  for (const status of priority) {
    if (statusCounts[status]) {
      return status;
    }
  }

  return "pending"; 
};
  

export const OrdersProvider = ({ children }) => {
  const userId = useSelector((state) => state.auth.userId);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/?user_id=${userId}`);
      const data = await response.json();
      const rawOrders = data.orders || [];
      console.log(data);
  
      // Update each order with the correct calculated status
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
