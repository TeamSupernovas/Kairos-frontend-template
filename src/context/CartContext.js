import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Get user from Auth0
  const [chefId, setChefId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (dish, delta) => {
    if (chefId && chefId !== dish.chef_id) {
      alert("You can only order from one chef at a time!");
      return;
    }

    const existingItem = cartItems.find(item => item.dish_id === dish.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.dish_id === dish.id
          ? { ...item, quantity: item.quantity + delta }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          dish_id: dish.id,
          dish_name:dish.dish_name,
          quantity: delta,
          dish_order_status: "pending",
          price_per_unit: dish.price,
          chef_id: dish.chef_id,
          chef_name: dish.chef_name
        }
      ]);
      setChefId(dish.chef_id);
    }
  };

  const removeFromCart = (dishId) => {
    const updatedItems = cartItems.filter(item => item.dish_id !== dishId);
    setCartItems(updatedItems);
    if (updatedItems.length === 0) {
      setChefId(null);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setChefId(null);
  };

  const updateCartItemQuantity = (dishId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.dish_id === dishId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, chefId, addToCart, removeFromCart, clearCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
