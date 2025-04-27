import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { cartItems, chefId, clearCart, removeFromCart, updateCartItemQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();

  const placeOrder = async () => {
    if (!isAuthenticated || !user?.sub) {
      alert("You must be logged in to place an order.");
      return;
    }

    const userId = user.sub.includes("|") ? user.sub.split("|")[1] : user.sub;
    const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price_per_unit), 0);

    const orderPayload = {
      user_id: userId,
      chef_id: chefId,
      total_price: total,
      order_items: cartItems.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        dish_order_status: item.dish_order_status,
        price_per_unit: item.price_per_unit,
      }))
    };

    try {
      const response = await fetch("http://localhost:8008/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price_per_unit, 0);

  const incrementQuantity = (dishId) => {
    updateCartItemQuantity(dishId, 1); // +1
  };

  const decrementQuantity = (dishId) => {
    updateCartItemQuantity(dishId, -1); // -1
  };

  return (
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
              <div key={item.dish_id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                <div>
                  <h5 className="mb-1">{item.dish_id}</h5>
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() => decrementQuantity(item.dish_id)}
                      className="btn btn-sm btn-outline-secondary me-2"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.dish_id)}
                      className="btn btn-sm btn-outline-secondary ms-2"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <h6 className="mb-0 me-3">${item.price_per_unit * item.quantity}</h6>
                  <button onClick={() => removeFromCart(item.dish_id)} className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="border p-4 rounded shadow-sm">
              <h4 className="fw-bold mb-3">Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span>Delivery Fee</span>
                <span>$0</span> {/* You can later make dynamic */}
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <button onClick={placeOrder} className="btn btn-success w-100 mt-4 fw-bold py-2">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
