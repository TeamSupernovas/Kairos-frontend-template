import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DishDetails = ({cart, setCart}) => {
  const { id } = useParams(); // Get the dish ID from URL

  const [dishData, setDishData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const order = (dishData, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.find((item) => item.dish_id === dishData.dish_id)
        ? prevCart.map((item) =>
            item.dish_id === dishData.dish_id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prevCart, { ...dishData, quantity }];
      
      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log(cart);
      return updatedCart;
    });
  };
  


  useEffect(() => {
    async function fetchDishDetails() {
      if (!id) {
        return;
      }
      const response = await fetch(`http://localhost:8080/dishes/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch dish details for " + id);
      }

      const data = await response.json();

      setDishData(data.dish);
      console.log("details set for ", id, ":", data);
    }
    fetchDishDetails();
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="position-relative">
            <img
              src={dishData.images && dishData.images[0].image_url}
              alt={dishData.dish_name}
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{dishData.dish_name}</h2>
          <p className="text-muted">By {dishData.chef_id}</p>
          <h4 className="fw-bold text-success">
            ${dishData.price && dishData.price.toFixed(2)}
          </h4>
          <p className="text-muted">
            {dishData.available_portions} portions • until{" "}
            {dishData.available_until}
          </p>
          <div className="mb-3">
            {dishData.dietary_category}
            <span className="badge bg-secondary">{dishData.meal_course}</span>
          </div>
          <h5 className="fw-bold">Description</h5>
          <p className="p-3 bg-light rounded">{dishData.description}</p>
          <h5 className="fw-bold">Ingredients</h5>
          <div className="d-flex flex-wrap">
            {dishData.ingredients &&
              dishData.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border me-2 mb-2 p-2"
                >
                  {ingredient}
                </span>
              ))}
          </div>
          <h5 className="fw-bold mt-3">Select Portions</h5>
          <select
            className="form-select w-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[...Array(dishData.available_portions).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
          <button className="btn btn-success w-100 mt-3 py-2 fw-bold" onClick={()=>order(dishData, quantity)}>
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
