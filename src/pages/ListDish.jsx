import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import Auth context
import { CancelButton, SubmitButton } from "../components/Button";

const ListDish = () => {
  const { user, isAuthenticated } = useAuth(); // Get user from Auth0
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [dish, setDish] = useState({
    dish_name: "",
    chef_id: "",
    price: "",
    available_portions: "",
    description: "",
    meal_course: "",
    dietary_category: "",
    ingredients: "",
    available_until: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const chefId = user.sub.includes("|") ? user.sub.split("|")[1] : user.sub;
      setDish((prev) => ({ ...prev, chef_id: chefId }));
    }
  }, [user, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (!regex.test(value) && value !== "") return;
    }
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setDish({
      ...dish,
      address: { ...dish.address, [e.target.name]: e.target.value },
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCancel = () => {
    setDish({
      dish_name: "",
      chef_id: isAuthenticated ? user?.sub || "" : "",
      price: "",
      available_portions: "",
      description: "",
      meal_course: "",
      dietary_category: "",
      ingredients: "",
      available_until: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isAuthenticated || !user?.sub) {
      setError("You must be logged in to list a dish.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    let availableUntil = dish.available_until
      ? new Date(dish.available_until)
      : null;
    if (availableUntil && isNaN(availableUntil.getTime())) {
      setError("Invalid date format for 'Available Until'");
      setLoading(false);
      return;
    }

    const dishWithAddress = {
      ...dish,
      chef_id: dish.chef_id,
      price: parseFloat(dish.price),
      available_portions: parseInt(dish.available_portions, 10),
      available_until: availableUntil ? availableUntil.toISOString() : null,
      address: { ...dish.address },
    };

    const dishBlob = new Blob([JSON.stringify(dishWithAddress)], {
      type: "application/json",
    });
    formData.append("dish", dishBlob);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:8080/dishes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Dish successfully listed");
        setShowSuccessPopup(true);
        handleCancel();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to list dish");
      }
    } catch (error) {
      console.error("Error submitting dish:", error);
      setError("Network error: Unable to reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="border rounded bg-light p-4 text-center position-relative">
            <label htmlFor="imageUpload" className="d-block">
              {imagePreview ? (
                <img
                  src={imagePreview}
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
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold mb-3">List Your Dish</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Dish Name"
              name="dish_name"
              value={dish.dish_name}
              onChange={handleChange}
              required
            />
            <div className="d-flex gap-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price ($)"
                name="price"
                value={dish.price}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                className="form-control"
                placeholder="Portions Available"
                name="available_portions"
                value={dish.available_portions}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              className="form-control bg-light mt-3"
              placeholder="Describe your dish..."
              name="description"
              value={dish.description}
              onChange={handleChange}
              rows={3}
              required
            ></textarea>
            <div className="d-flex gap-3 mt-3">
              <select
                className="form-select"
                name="dietary_category"
                value={dish.dietary_category}
                onChange={handleChange}
                required
              >
                <option value="">Dietary Category</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              <select
                className="form-select"
                name="meal_course"
                value={dish.meal_course}
                onChange={handleChange}
                required
              >
                <option value="">Meal Course</option>
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            {/* Address Fields (FIXED) */}
            <h5 className="mt-4">Pickup Address</h5>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Street"
              name="street"
              value={dish.address.street}
              onChange={handleAddressChange}
              required
            />
            <div className="d-flex gap-3 mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                name="city"
                value={dish.address.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                className="form-control"
                placeholder="State"
                name="state"
                value={dish.address.state}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="d-flex gap-3 mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                name="country"
                value={dish.address.country}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                className="form-control"
                placeholder="Postal Code"
                name="postal_code"
                value={dish.address.postal_code}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <CancelButton label="Cancel" onClick={handleCancel} />
              <SubmitButton
                label={loading ? "Publishing..." : "Publish Dish"}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
          {showSuccessPopup && (
            <div
              className="alert alert-success position-fixed top-50 start-50 translate-middle text-center shadow-lg"
              style={{ zIndex: 1050, padding: "20px", borderRadius: "10px" }}
            >
              <p>Dish successfully listed!</p>
              <button
                className="btn btn-success mt-2"
                onClick={() => setShowSuccessPopup(false)}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDish;
