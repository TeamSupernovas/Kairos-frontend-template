import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import ProfileHeader from '../components/ProfileHeader';

const fallbackImage = "https://img.icons8.com/color/96/meal.png";

const OrdersPage = () => {
  const { orders, loading, fetchOrders } = useOrders();
  const navigate = useNavigate();
  const [dishImages, setDishImages] = useState({});

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'canceled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const fetchDishImages = async () => {
    const imageMap = {};
    const allItems = orders.flatMap(o => o.order_items);

    await Promise.all(allItems.map(async (item) => {
      if (dishImages[item.dishId]) return; // Skip if already fetched

      try {
        const res = await fetch(`http://localhost:8080/images/dish/${item.dishId}`);
        const data = await res.json();
        imageMap[item.dishId] = data?.[0]?.image_url || fallbackImage;
      } catch (err) {
        imageMap[item.dishId] = fallbackImage;
      }
    }));

    setDishImages((prev) => ({ ...prev, ...imageMap }));
  };

  useEffect(() => {
    if (orders?.length > 0) {
      fetchDishImages();
    }
  }, [orders]);

  const cancelFullOrder = async (orderItems) => {
    if (!orderItems || orderItems.length === 0) return;

    try {
      await Promise.all(orderItems.map(item =>
        fetch(`http://localhost:8008/orders/${item.orderItemId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'canceled' }),
        })
      ));

      await fetchOrders();
      alert('Order canceled successfully!');
    } catch (error) {
      console.error('Cancel Full Order Error:', error);
      alert('Failed to cancel the order. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading your orders...</div>;
  }

  return (
    <>
      <ProfileHeader />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          orders.map((orderWrapper) => {
            const { order, order_items } = orderWrapper;
            const isCancelable = (order?.orderStatus || "").toLowerCase() === "pending";

            return (
              <div
                key={order?.orderId}
                className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-4"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      className="text-lg font-semibold cursor-pointer"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      {order?.orderId ? `Order #${order.orderId.slice(0, 8)}` : "Order"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {order?.createdAt
                        ? `${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}`
                        : "Date Unknown"}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className={`text-base font-bold ${statusColor(order?.orderStatus)}`}>
                      {order?.orderStatus
                        ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                        : "Status Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ${order?.totalPrice || 0}
                    </p>
                    {/* Cancel Button */}
                    {isCancelable && (
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to cancel this entire order?")) {
                            cancelFullOrder(order_items);
                          }
                        }}
                        className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 space-y-2">
                  {order_items?.length > 0 ? (
                    order_items.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="flex items-center gap-4 text-sm bg-gray-50 p-3 rounded-md"
                      >
                        <img
                          src={dishImages[item.dishId] || fallbackImage}
                          alt={`Dish ${item.dishId}`}
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                          className="rounded"
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                        <div className="flex-grow">
                          <p className="font-semibold">Dish ID: {item.dishId}</p>
                          <p className="text-gray-500">Quantity: {item.quantity}</p>
                          <p className={`text-xs font-semibold ${statusColor(item.dishOrderStatus)}`}>
                            {item.dishOrderStatus?.toUpperCase() || "STATUS UNKNOWN"}
                          </p>
                        </div>
                        <div className="text-right font-semibold whitespace-nowrap">
                          ${item.pricePerUnit * item.quantity}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No items in this order.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default OrdersPage;
