// src/context/ChefOrderContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChefOrderContext = createContext();
export const useChefOrders = () => useContext(ChefOrderContext);

export const ChefOrderProvider = ({ children }) => {
  const userId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDishName = async (dishId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DISH_MANAGEMENT_SERVICE}/dishes/${dishId}`);
      const data = await response.json();
      return data.dish?.dish_name || "Unknown Dish";
    } catch (error) {
      console.error(`Failed to fetch dish name for ${dishId}:`, error);
      return "Unknown Dish";
    }
  };

  const fetchChefOrders = async () => {
    if (!userId) {
      console.warn("You must be logged in as a chef to fetch orders.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/provider?chef_id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chef orders");
      }
      const data = await response.json();
      const rawOrders = data.orders || [];

      const updatedOrders = await Promise.all(
        rawOrders.map(async (orderWrapper) => {
          const itemsWithNames = await Promise.all(
            orderWrapper.order_items.map(async (item) => {
              const dishName = await fetchDishName(item.dishId);
              return {
                ...item,
                dish_name: dishName,
              };
            })
          );

          return {
            ...orderWrapper,
            order_items: itemsWithNames,
          };
        })
      );

      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to fetch chef orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderItemStatus = async (userId, chefId, orderItemId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/${orderItemId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, user_id: userId, chef_id: chefId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order item status");
      }

      await fetchChefOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Failed to update order item status:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChefOrders();
    }
  }, [userId, role]);

  return (
    <ChefOrderContext.Provider value={{ orders, loading, fetchChefOrders, updateOrderItemStatus }}>
      {children}
    </ChefOrderContext.Provider>
  );
};
