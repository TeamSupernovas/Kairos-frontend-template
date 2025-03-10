import { useState } from "react";
import { CancelButton, SubmitButton } from "../components/Button";

const ListDish = () => {
  const [dish, setDish] = useState({
    name: "",
    price: "",
    portions: "",
    description: "",
    dietaryCategory: "",
    mealCourse: "",
    ingredients: "",
    delivery: "",
    image: "",
    pickupAddress: "",
    availableUntil: "",
  });

  const handleChange = (
    e
  ) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setDish({ ...dish, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dish submitted:", dish);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="border rounded bg-light p-4 text-center position-relative">
            <label htmlFor="imageUpload" className="d-block">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt="Dish Preview"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              ) : (
                <div className="border p-5 rounded bg-white text-muted">
                  + Add Dish Image
                </div>
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              className="d-none"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold mb-3">List Your Dish</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Dish Name"
              name="name"
              value={dish.name}
              onChange={handleChange}
            />
            <div className="d-flex gap-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price ($)"
                name="price"
                value={dish.price}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Portions Available"
                name="portions"
                value={dish.portions}
                onChange={handleChange}
              />
            </div>
            <textarea
              className="form-control bg-light mt-3"
              placeholder="Describe your dish..."
              name="description"
              value={dish.description}
              onChange={handleChange}
              rows={3}
            ></textarea>
            <div className="d-flex gap-3 mt-3">
              <select
                className="form-select"
                name="dietaryCategory"
                value={dish.dietaryCategory}
                onChange={handleChange}
              >
                <option value="">Dietary Category</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              <select
                className="form-select"
                name="mealCourse"
                value={dish.mealCourse}
                onChange={handleChange}
              >
                <option value="">Meal Course</option>
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Ingredients (comma-separated)"
              name="ingredients"
              value={dish.ingredients}
              onChange={handleChange}
            />
            <div className="d-flex gap-3 mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Pickup Address"
                name="pickupAddress"
                value={dish.pickupAddress}
                onChange={handleChange}
              />
              <input
                type="time"
                className="form-control"
                placeholder="Available Until"
                name="availableUntil"
                value={dish.availableUntil}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <CancelButton label="Cancel" onClick={handleCancel} />
              <SubmitButton
                label="Publish Dish"
                onClick={() => handleSubmit()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListDish;
