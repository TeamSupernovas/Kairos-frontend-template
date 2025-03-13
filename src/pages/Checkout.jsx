import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth context

const Checkout = ({ cart, setCart }) => {
  console.log(cart);
   const { user, isAuthenticated } = useAuth();
  const [address, setAddress] = useState("123 Main St, San Jose, CA");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    // Load cart from localStorage when the component mounts
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };


    //implement order logic here

    const order = async () => {
      console.log("Order Placed!");
      console.log(user);
  
      // Prepare the order data
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  
      const orderItems = cartData.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          dish_order_status: "pending",
          price_per_unit: item.price
      }));
  
      const orderData = {
          user_id: user.sub.includes("|") ? user.sub.split("|")[1] : user.sub,  // Replace with actual user ID
          chef_id: user.sub.includes("|") ? user.sub.split("|")[1] : user.sub,  // Replace with actual chef ID
          order_items: orderItems
      };
  
      try {
          // Make the POST request to the orders endpoint
          const response = await fetch("http://localhost:8008/orders/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(orderData)
          });
  
          if (response.ok) {
              console.log("Order successfully placed!");
              console.log(await response.json());
              // Clear the cart after placing the order
              localStorage.removeItem("cart");
              setCart([]);
          } else {
              const errorData = await response.json();
              console.error("Order failed:", errorData);
          }
      } catch (error) {
          console.error("Error placing the order:", error);
      }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Cart Items Section */}
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.dish_id} className="flex justify-between items-start border-b pb-6">
            {/* Dish Info */}
            <div className="flex items-center space-x-4">
              <img src={item.images&&item.images[0].image_url} alt={item.dish_name} className="w-20 h-20 object-cover rounded-md" />
             
              <div>
                <span className="text-lg font-semibold">{item.dish_name}</span>
                <div className="text-sm text-gray-500">{item.dietary_category} - {item.meal_course}</div>
                {item.description && <div className="text-sm text-gray-700 mt-1">{item.description}</div>}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded-md text-lg"
                onClick={() => updateQuantity(item.dish_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="text-lg">{item.quantity}</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded-md text-lg"
                onClick={() => updateQuantity(item.dish_id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            {/* Price */}
            <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span>${calculateTotal()}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Delivery Fee:</span>
          <span>$2.99</span>
        </div>
        <div className="flex justify-between text-xl font-bold mt-2">
          <span>Total:</span>
          <span>${(parseFloat(calculateTotal()) + 2.99).toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mt-6">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
        <input
          id="address"
          type="text"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          className="w-full mt-2 p-3 border border-gray-300 rounded-md"
          placeholder="Enter your address"
        />
      </div>

      {/* Payment Method */}
      <div className="mt-6">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mt-2 p-3 border border-gray-300 rounded-md"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      {/* Place Order Button */}
      <div className="mt-8">
        <button
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          onClick={order}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
export default Checkout;
