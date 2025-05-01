import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const fallbackImage = "https://img.icons8.com/color/96/meal.png";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "canceled":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const OrderView = ({ orderWrapper, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dishImages, setDishImages] = useState({});
  const order = orderWrapper.order;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch all images when expanded
  useEffect(() => {
    if (!isExpanded || !orderWrapper?.order_items?.length) return;

    const fetchImages = async () => {
      const newImages = {};

      await Promise.all(
        orderWrapper.order_items.map(async (item) => {
          try {
            const res = await fetch(`${process.env.REACT_APP_DISH_MANAGEMENT_SERVICE}/images/dish/${item.dishId}`);
            const data = await res.json();
            if (data?.[0]?.image_url) {
              newImages[item.dishId] = data[0].image_url;
            } else {
              newImages[item.dishId] = fallbackImage;
            }
          } catch (err) {
            console.error("Image fetch failed for", item.dishId);
            newImages[item.dishId] = fallbackImage;
          }
        })
      );

      setDishImages((prev) => ({ ...prev, ...newImages }));
    };

    fetchImages();
  }, [isExpanded, orderWrapper.order_items]);

  return (
    <li className="p-3 bg-gray-100 rounded-lg shadow-sm space-y-2">
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
              className="flex items-center gap-3 text-sm bg-white p-2 rounded-md shadow"
            >
              {/* Dish Image */}
              <img
                src={dishImages[item.dishId] || fallbackImage}
                alt={`Dish ${item.dishId}`}
                className="rounded"
                style={{ width: 60, height: 60, objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />

              {/* Dish Info */}
              <div className="flex-grow">
                <p className="font-semibold text-gray-700">Dish ID: {item.dishId}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
                <p className={`text-xs ${statusColor(item.dishOrderStatus)}`}>
                  {item.dishOrderStatus?.toUpperCase() || "Status Unknown"}
                </p>
              </div>

              {/* Price */}
              <div className="text-end font-semibold whitespace-nowrap">
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
