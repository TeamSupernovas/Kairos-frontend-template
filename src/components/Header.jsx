import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { FaShoppingCart } from "react-icons/fa";
import { LoginButton, SignUpButton } from "../components/Button";
import SearchButton from "../components/SearchButton";

// Google Maps Config
const libraries = ["places"];
const containerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const Header = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [radius, setRadius] = useState("");
  const [location, setLocation] = useState("");
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [showUseLocation, setShowUseLocation] = useState(false);

  // Handle fetching current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
              setLocation(data.results[0].formatted_address);
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const autocompleteRef = useRef(null);
  useEffect(() => {
    if (
      isLoaded &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("location-input"),
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setLocation(place.formatted_address);
          setShowUseLocation(false);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [isLoaded]);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2">
      <div className="container-fluid d-flex align-items-center">
        {/* Kairos Logo */}
        <a className="navbar-brand fw-bold fs-4 text-success me-3" href="/">
          Kairos
        </a>

        {/* Location Input Field */}
        <div className="position-relative me-1" style={{ width: "400px" }}>
          <input
            type="text"
            id="location-input"
            name="location"
            value={location}
            className="form-control ps-3 pe-3 py-2 rounded-pill bg-light border-0 w-100"
            placeholder="Enter Location"
            onFocus={() => setShowUseLocation(true)}
            onBlur={() => setTimeout(() => setShowUseLocation(false), 200)}
            onChange={(e) => setLocation(e.target.value)}
          />
          {/* "Use My Location" Dropdown */}
          {showUseLocation && (
            <ul className="list-group position-absolute w-100 mt-1 z-3">
              <li
                className="list-group-item list-group-item-action text-primary"
                onClick={getCurrentLocation}
                style={{ cursor: "pointer" }}
              >
                📍 Use My Current Location
              </li>
            </ul>
          )}
        </div>

        {/* Search Radius Field */}
        <div className="position-relative me-1" style={{ width: "250px" }}>
          <input
            type="number"
            name="radius"
            value={radius}
            className="form-control ps-3 pe-3 py-2 rounded-pill bg-light border-0 w-100"
            placeholder="Search Radius (miles)"
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value !== "0") {
                setRadius(value);
              }
            }}
            min="1"
          />
        </div>

        {/* Search Button */}
        <SearchButton location={markerPosition} radius={radius} />

        {/* Shopping Cart, Login & Sign Up */}
        <div className="d-flex align-items-center ms-3">
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

      {/* Google Maps Integration (Hidden but Functional) */}
      {isLoaded && (
        <div className="d-none">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={12}
          >
            <Marker position={markerPosition} title="Selected Location" />
          </GoogleMap>
        </div>
      )}
    </nav>
  );
};

export default Header;
