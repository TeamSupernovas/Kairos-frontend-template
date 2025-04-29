import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

const OrderView = ({ orderWrapper, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const order = orderWrapper.order;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li
      key={order?.orderId}
      className="p-3 bg-gray-100 rounded-lg shadow-sm space-y-2"
    >
      {/* Order Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div>
          <p className="font-medium text-gray-700">
            {order?.orderId ? `Order #${order.orderId.slice(0, 8)}` : "Order"}
          </p>
          <p className="text-xs text-gray-400">
            {order?.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "Date Unknown"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${color}`}>
            {order?.orderStatus || "Status Unknown"}
          </span>
          {isExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded Order Items */}
      {isExpanded && orderWrapper.order_items?.length > 0 && (
        <ul className="mt-2 space-y-2">
          {orderWrapper.order_items.map((item) => (
            <li
              key={item.orderItemId}
              className="flex justify-between items-center text-sm bg-white p-2 rounded-md shadow"
            >
              <div>
                <p className="font-semibold text-gray-700">Dish ID: {item.dishId}</p>
                <p className="text-gray-400">Quantity: {item.quantity}</p>
                <p className={`text-xs ${statusColor(item.dishOrderStatus)}`}>
                  {item.dishOrderStatus ? item.dishOrderStatus.toUpperCase() : "Status Unknown"}
                </p>
              </div>
              <div className="text-right font-semibold">
                ${item.pricePerUnit * item.quantity}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default OrderView;
