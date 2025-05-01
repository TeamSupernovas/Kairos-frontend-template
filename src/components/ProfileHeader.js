import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { FaShoppingCart } from "react-icons/fa";
import { LoginButton, SignUpButton } from "../components/Button";
import SearchButton from "../components/SearchButton";
import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import LogoutButton from "../components/LogoutButton";

// Google Maps Config
const libraries = ["places"];
const containerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const ProfileHeader = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const userId = useSelector((state) => state.auth.userId);
  const { cartItems } = useCart();

  const [radius, setRadius] = useState("");
  const [location, setLocation] = useState("");
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [showUseLocation, setShowUseLocation] = useState(false);
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2">
      <div className="container-fluid d-flex align-items-center">
        {/* Kairos Logo */}
        <a className="navbar-brand fw-bold fs-4 text-success me-3" href="/">
          Kairos
        </a>

        {/* Right-side buttons */}
        <div className="d-flex align-items-center ms-3">
          {/* Cart Icon */}
          <Link to="/cart" className="position-relative me-3">
            <FaShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                {cartItems.length}
              </span>
            )}
          </Link>

          <div style={{ width: "20px" }}></div>

          {userId ? (
            <>
              <LoginButton
                label="Profile"
                onClick={() => navigate('/profile')}
              />
              <div style={{ width: "20px" }}></div>

              <LoginButton
                label="Orders"
                onClick={() => navigate('/orders')}
              />
              <div style={{ width: "20px" }}></div>

              <LoginButton
                label="Search"
                onClick={() => navigate('/search')}
              />
              <div style={{ width: "20px" }}></div>

              <LogoutButton />
            </>
          ) : (
            <>
              <LoginButton
                label="Log in"
                onClick={() => navigate('/login')}
              />
              <div style={{ width: "20px" }}></div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProfileHeader;
