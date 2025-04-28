import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaEdit, FaCheck, FaBoxOpen, FaHistory } from "react-icons/fa";
import { useSelector } from "react-redux";
import Header from "../components/ProfileHeader";
import ProfileHeader from "../components/ProfileHeader";

const ProfilePage = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [userData, setUserData] = useState({ name: "", location: "", currentOrders: [], pastOrders: [] });
  const [location, setLocation] = useState("");
  const [editing, setEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      const userServiceUrl = `${process.env.REACT_APP_USER_SERVICE}/${userId}`;
      try {
        const response = await fetch(userServiceUrl);
        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUserData({
          name: data.name,
          location: data.location,
          currentOrders: data.currentOrders || [],
          pastOrders: data.pastOrders || [],
        });
        setLocation(data.location);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const fetchLocationSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data.map((place) => place.display_name));
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const updateLocation = async (newLocation) => {
    if (!userId || !newLocation) return;

    const userServiceUrl = `${process.env.REACT_APP_USER_SERVICE}/${userId}`;

    try {
      await fetch(userServiceUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation }),
      });

      setUserData((prev) => ({ ...prev, location: newLocation }));
      setLocation(newLocation);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  return (
    <>
    <ProfileHeader />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Profile Card */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{userData.name || "Loading..."}</h2>

        {/* Location Field */}
        <div className="flex items-center justify-center gap-2 mt-3 text-gray-600 relative">
          <FaMapMarkerAlt className="text-red-500" />
          {editing ? (
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  fetchLocationSuggestions(e.target.value);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 w-64"
                placeholder="Type location..."
              />
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md w-64 mt-1 shadow-md max-h-40 overflow-auto z-10">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setLocation(suggestion);
                        setSuggestions([]);
                        updateLocation(suggestion);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <span>{location || "No location set"}</span>
          )}
          {editing ? (
            <FaCheck
              className="text-green-500 cursor-pointer"
              onClick={() => updateLocation(location)}
            />
          ) : (
            <FaEdit className="text-gray-400 cursor-pointer" onClick={() => setEditing(true)} />
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div className="w-full max-w-2xl mt-6">
        {/* Current Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaBoxOpen className="text-blue-500" /> Current Orders
          </h3>
          {userData.currentOrders.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {userData.currentOrders.map((order, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg flex justify-between items-center shadow-sm"
                >
                  <span className="text-gray-700">{order}</span>
                  <span className="text-sm text-blue-600">In Progress</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No active orders</p>
          )}
        </div>

        {/* Past Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaHistory className="text-green-500" /> Past Orders
          </h3>
          {userData.pastOrders.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {userData.pastOrders.map((order, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-100 rounded-lg flex justify-between items-center shadow-sm"
                >
                  <span className="text-gray-700">{order}</span>
                  <span className="text-sm text-green-600">Completed</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No past orders</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
