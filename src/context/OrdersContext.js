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

  const fetchDishName = async (dishId) => {
    console.log(dishId)
    try {
      const response = await fetch(`${process.env.REACT_APP_DISH_MANAGEMENT_SERVICE}/dishes/${dishId}`);
      const data = await response.json();
       console.log(data)
      return data.dish?.dish_name || "Unknown Dish";
    } catch (error) {
      console.error(`Failed to fetch dish name for ${dishId}:`, error);
      return "Unknown Dish";
    }
  };

  const fetchOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/?user_id=${userId}`);
      const data = await response.json();
      const rawOrders = data.orders || [];

      const updatedOrders = await Promise.all(rawOrders.map(async (orderWrapper) => {
        const updatedStatus = determineOrderStatus(orderWrapper.order_items);

        console.log(data)

        const orderItemsWithNames = await Promise.all(orderWrapper.order_items.map(async (item) => {
          const dishName = await fetchDishName(item.dishId);
          return {
            ...item,
            dish_name: dishName,
          };
        }));

        return {
          ...orderWrapper,
          order: {
            ...orderWrapper.order,
            orderStatus: updatedStatus,
          },
          order_items: orderItemsWithNames,
        };
      }));

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
