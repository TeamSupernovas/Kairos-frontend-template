import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import ProfileHeader from '../components/ProfileHeader';
import DishImage from './components/DishImage';
import { Loader2, XCircle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const OrdersPage = () => {
  const { orders, loading, fetchOrders } = useOrders();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const statusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const cancelFullOrder = async (orderId ,userId, userName, chefId, chefName, orderItems) => {
    if (!orderItems?.length) return;

    try {
      await Promise.all(
        orderItems.map((item) =>
          fetch(`${process.env.REACT_APP_ORDERS_SERVICE}/orders/${item.orderItemId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'canceled',
              user_id: userId,
              user_name: userName,
              chef_id: chefId,
              chef_name: chefName,
              dish_name: item.dishName || item.dishId,
              order_id:orderId
            }),
          })
        )
      );
      await fetchOrders();
      alert('Order canceled successfully!');
    } catch (error) {
      console.error('Cancel Full Order Error:', error);
      alert('Failed to cancel the order. Please try again.');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-center text-gray-600">
        You must be logged in to view your orders.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        <p className="text-sm text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader />
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-balance">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <XCircle className="mx-auto w-12 h-12 text-gray-400 mb-2" />
            <p>No orders found.</p>
          </div>
        ) : (
          orders.map(({ order, order_items }) => {
            const isCancelable = (order?.orderStatus || '').toLowerCase() === 'pending';

            return (
              <div
                key={order?.orderId}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 space-y-4 border"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold cursor-pointer hover:underline">
                      {order?.orderId ? `Order #${order.orderId.slice(0, 8)}` : 'Order'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {order?.createdAt
                        ? `${new Date(order.createdAt).toLocaleDateString()} • ${new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                        : 'Date Unknown'}
                    </p>
                    {order?.chefName && (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      👨‍🍳 <span>Chef: {order.chefName}</span>
    </div>
  )}
                  </div>

                  <div className="text-right space-y-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClasses(order?.orderStatus)}`}
                    >
                      {order?.orderStatus?.toUpperCase() || 'UNKNOWN'}
                    </span>
                    <p className="text-sm text-gray-500">
                      Total: ${order?.totalPrice?.toFixed(2) || 0}
                    </p>

                    {isCancelable && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this entire order?')) {
                            cancelFullOrder(
                              order.orderId ,
                              order.userId,
                              user.name,
                              order.chefId,
                              order.chefName,
                              order_items
                            );
                          }
                        }}
                        className="mt-1 inline-flex items-center px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order_items?.length > 0 ? (
                    order_items.map((item) => (
                      <div
                        key={item.orderItemId}
                        onClick={() => navigate(`/dish/${item.dishId}`)}
                        className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm gap-4 cursor-pointer hover:bg-gray-100 transition"
                        title="View dish details"
                      >
                        <DishImage dishId={item.dishId} width={60} height={60} />

                        <div className="flex-grow space-y-1 text-sm">
                          <p className="font-medium truncate hover:underline">
                            {item.dishName ? item.dishName : `Dish ID: ${item.dishId}`}
                          </p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-semibold ${statusClasses(
                              item.dishOrderStatus
                            )}`}
                          >
                            {item.dishOrderStatus?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>

                        <div className="text-right font-semibold text-sm">
                          ${(item.pricePerUnit * item.quantity).toFixed(2)}
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
