// src/context/ChefOrderContext.js
import { createContext, useContext, useEffect, useState } from "react";

const ChefOrderContext = createContext();

export const useChefOrders = () => useContext(ChefOrderContext);

export const ChefOrderProvider = ({ chefId, children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChefOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8008/orders/provider?chef_id=${chefId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chef orders");
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch chef orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderItemStatus = async (orderItemId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8008/orders/${orderItemId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order item status");
      }

      // Refresh orders after successful update
      await fetchChefOrders();
    } catch (error) {
      console.error("Failed to update order item status:", error);
    }
  };

  useEffect(() => {
    if (chefId) {
      fetchChefOrders();
    }
  }, [chefId]);

  return (
    <ChefOrderContext.Provider value={{ orders, loading, fetchChefOrders, updateOrderItemStatus }}>
      {children}
    </ChefOrderContext.Provider>
  );
};
