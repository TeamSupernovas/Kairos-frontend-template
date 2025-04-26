import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const [chefId, setChefId] = useState(null);

const defaultCartItems = [
    {
      dish_id: "dish001",
      quantity: 2,
      dish_order_status: "pending",
      price_per_unit: 15,
      chef_id: "chef123"
    },
    {
      dish_id: "dish002",
      quantity: 1,
      dish_order_status: "pending",
      price_per_unit: 20,
      chef_id: "chef123"
    },
    {
      dish_id: "dish003",
      quantity: 3,
      dish_order_status: "pending",
      price_per_unit: 12    ,
      chef_id: "chef123"
    }
  ];
  

const [cartItems, setCartItems] = useState(defaultCartItems);
const [chefId, setChefId] = useState("chef123");


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

  return (
    <CartContext.Provider value={{ cartItems, chefId, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
