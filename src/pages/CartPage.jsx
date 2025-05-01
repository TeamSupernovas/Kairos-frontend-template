import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import CartItemCard from "./components/CartItemCard";

const CartPage = () => {
  const {
    cartItems,
    chefId,
    clearCart,
    removeFromCart,
    updateCartItemQuantity
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const placeOrder = async () => {
    if (!isAuthenticated || !user?.sub) {
      alert("You must be logged in to place an order.");
      return;
    }

    const userId = user.sub.includes("|") ? user.sub.split("|")[1] : user.sub;
    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price_per_unit,
      0
    );

    const orderPayload = {
      user_id: userId,
      chef_id: chefId,
      total_price: total,
      order_items: cartItems.map((item) => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        dish_order_status: item.dish_order_status,
        price_per_unit: item.price_per_unit
      }))
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error("Failed to place order");

      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price_per_unit,
    0
  );

  const incrementQuantity = (dishId) => {
    updateCartItemQuantity(dishId, 1);
  };

  const decrementQuantity = (dishId) => {
    updateCartItemQuantity(dishId, -1);
  };

  return (
    <>
      <ProfileHeader />
      <div className="container mt-5">
        <h1 className="fw-bold mb-4">Checkout</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">Your cart is empty</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.dish_id}
                  item={item}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <div className="col-md-4">
              <div className="border p-4 rounded shadow-sm">
                <h4 className="fw-bold mb-3">Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span>Delivery Fee</span>
                  <span>$0</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  className="btn btn-success w-100 mt-4 fw-bold py-2"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
