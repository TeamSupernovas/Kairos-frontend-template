import React from "react";
import { useNavigate } from "react-router-dom";
import DishImage from "./DishImage";

const CartItemCard = ({ item, onIncrement, onDecrement, onRemove }) => {
  const navigate = useNavigate();

  const handleGoToDish = () => {
    navigate(`/dish/${item.dish_id}`);
  };

  return (
    <div className="d-flex border-bottom py-3 gap-3 align-items-start">
      <div className="text-center">
        <DishImage
          dishId={item.dish_id}
          width={80}
          height={80}
          alt={item.dish_name || "Dish"}
          className="mb-2"
        />
        <button
          onClick={handleGoToDish}
          className="btn btn-sm btn-outline-primary w-100"
        >
          Go to Dish
        </button>
      </div>

      <div className="flex-grow-1 d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1 fw-semibold">{item.dish_name }</h6>
          <div className="d-flex align-items-center">
            <button
              onClick={() => onDecrement(item.dish_id)}
              className="btn btn-sm btn-outline-secondary me-2"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => onIncrement(item.dish_id)}
              className="btn btn-sm btn-outline-secondary ms-2"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-end">
          <h6 className="mb-2">
            ${(item.price_per_unit * item.quantity).toFixed(2)}
          </h6>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(item.dish_id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
