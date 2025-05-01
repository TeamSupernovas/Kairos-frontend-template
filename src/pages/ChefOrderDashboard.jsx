import { useChefOrders } from "../context/ChefOrderContext";
import { useState } from "react";
import DishImage from "./components/DishImage"; 

const statuses = ["pending", "confirmed", "ready", "canceled", "completed"];

export default function ChefOrderDashboard() {
  const { orders, loading, updateOrderItemStatus } = useChefOrders();
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // console.log(orders)

  const handleStatusChange = async (userId,chefId,orderItemId, newStatus) => {
    await updateOrderItemStatus(userId,chefId,orderItemId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Incoming Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map(({ order, order_items }) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order ID:{" "}
                    <span className="text-indigo-600">
                      {order.orderId.slice(0, 8)}...
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full capitalize">
                    {order.userId}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order_items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex items-center justify-between border-t pt-4"
                  >
                    {/* Dish image + info */}
                    <div className="flex items-center gap-4">
                      <DishImage dishId={item.dishId} width={60} height={60} />

                      <div>
                        <p className="font-medium text-gray-700">
                          Dish ID: {item.dishId}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Price: ${item.pricePerUnit}
                        </p>
                      </div>
                    </div>

                    {/* Status dropdown */}
                    <div>
                      <select
                        value={
                          selectedStatuses[item.orderItemId] || item.dishOrderStatus
                        }
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setSelectedStatuses((prev) => ({
                            ...prev,
                            [item.orderItemId]: newStatus,
                          }));
                          handleStatusChange(order.userId,order.chefId,item.orderItemId, newStatus);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
