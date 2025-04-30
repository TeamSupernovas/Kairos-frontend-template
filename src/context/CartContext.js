import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Get user from Auth0
  const [chefId, setChefId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Set the chefId from authenticated user
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const derivedChefId = user.sub.includes("|") ? user.sub.split("|")[1] : user.sub;
      setChefId(derivedChefId);

      // Set default cart items using the derived chef ID
      const defaultCartItems = [
        {
          dish_id: "dish001",
          quantity: 2,
          dish_order_status: "pending",
          price_per_unit: 15,
          chef_id: derivedChefId
        },
        {
          dish_id: "dish002",
          quantity: 1,
          dish_order_status: "pending",
          price_per_unit: 20,
          chef_id: derivedChefId
        },
        {
          dish_id: "dish003",
          quantity: 3,
          dish_order_status: "pending",
          price_per_unit: 12,
          chef_id: derivedChefId
        }
      ];
      setCartItems(defaultCartItems);
    }
  }, [user, isAuthenticated]);

  const addToCart = (dish) => {
    if (chefId && chefId !== dish.chef_id) {
      alert("You can only order from one chef at a time!");
      return;
    }

    const existingItem = cartItems.find(item => item.dish_id === dish.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.dish_id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          dish_id: dish.id,
          quantity: 1,
          dish_order_status: "pending",
          price_per_unit: dish.price,
          chef_id: dish.chef_id
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
