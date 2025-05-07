import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Tag } from "lucide-react";
import DishImage from "../pages/components/DishImage";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "ready":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderView = ({ orderWrapper }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const order = orderWrapper.order;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <li className="bg-white rounded-xl shadow hover:shadow-md transition p-5 space-y-4 border border-gray-200">
      {/* Header */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={toggleExpand}
      >
       <div className="space-y-1">
  <h3 className="text-lg font-semibold text-gray-800">
    Order #{order?.orderId?.slice(0, 8) || "N/A"}
  </h3>

  <div className="flex items-center gap-2 text-sm text-gray-500">
    <CalendarDays className="w-4 h-4" />
    {order?.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown date"}
  </div>

  {order?.chefName && (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      👨‍🍳 <span>Chef: {order.chefName}</span>
    </div>
  )}
</div>


        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor(
              order?.orderStatus
            )}`}
          >
            {order?.orderStatus?.toUpperCase() || "UNKNOWN"}
          </span>
          {isExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Items */}
      {isExpanded && orderWrapper.order_items?.length > 0 && (
        <ul className="space-y-3">
          {orderWrapper.order_items.map((item) => (
            <li
              key={item.orderItemId}
              onClick={() => navigate(`/dish/${item.dishId}`)}
              title="Click to view dish details"
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition"
            >
              <DishImage dishId={item.dishId} width={60} height={60} />

              <div className="flex-grow space-y-1">
                <p className="font-medium text-gray-800 hover:underline truncate">
                  Dish ID: {item.dishName}
                </p>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>Qty: {item.quantity}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${statusColor(
                      item.dishOrderStatus
                    )}`}
                  >
                    {item.dishOrderStatus?.toUpperCase() || "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="text-right text-sm font-semibold whitespace-nowrap text-gray-700">
                ${(item.pricePerUnit * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default OrderView;
