import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8008/orders/?user_id=userid1');
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading your orders...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Your Past Orders</h1>
      {orders.length === 0 ? (
        <div>No past orders found.</div>
      ) : (
        orders.map((orderWrapper) => {
          const { order, order_items } = orderWrapper;
          return (
            <div
              key={order.orderId}
              className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-4"
              onClick={() => navigate(`/orders/${order.orderId}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.orderId.slice(0, 8)}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-base font-bold ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">Total: ${order.totalPrice}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                {order_items.map((item) => (
                  <div key={item.orderItemId} className="flex justify-between text-sm">
                    <div>
                      <p>Dish ID: {item.dishId}</p>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p>${item.pricePerUnit * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrdersPage;
