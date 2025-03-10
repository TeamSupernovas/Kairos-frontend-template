import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { LoginButton, SignUpButton } from "../components/Button";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState("");
  const [location, setLocation] = useState("");

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
      <div className="container-fluid d-flex align-items-center">
        <a className="navbar-brand fw-bold fs-4 text-success" href="/">
          Kairos
        </a>

        <div className="flex-grow-1 mx-3">
          <div className="position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
              <FaSearch className="text-secondary" />
            </span>
            <input
              type="text"
              name="search"
              value={searchQuery}
              className="form-control ps-5 pe-5 py-2 rounded-pill bg-light border-0 w-100"
              placeholder="Search for a dish..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ cursor: "pointer" }}
                onClick={clearSearch}
              >
                <FaTimes className="text-secondary" />
              </span>
            )}
          </div>
        </div>

        <div className="position-relative mx-3">
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <FaMapMarkerAlt className="text-secondary" />
          </span>
          <input
            type="text"
            name="location"
            value={location}
            className="form-control ps-5 pe-5 py-2 rounded-pill bg-light border-0 w-100"
            placeholder="Enter Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="position-relative mx-3">
          <input
            type="number"
            name="radius"
            value={radius}
            className="form-control ps-5 pe-5 py-2 rounded-pill bg-light border-0 w-100"
            placeholder="Search Radius (miles)"
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <FaShoppingCart size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
              1
            </span>
          </div>
          <LoginButton
            label="Log in"
            onClick={() => console.log("Login Clicked")}
          />
          <div style={{ width: "20px" }}></div>
          <SignUpButton
            label="Sign up"
            onClick={() => console.log("Sign Up Clicked")}
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
