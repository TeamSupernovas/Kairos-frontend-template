import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaCheck,
  FaBoxOpen,
  FaHistory,
  FaStar
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import OrderView from "../components/OrderView";
import ProfileHeader from "../components/ProfileHeader";
import ReviewList from "./components/ReviewList"; 
const TABS = [
  { key: "CURRENT", label: "Current", icon: <FaBoxOpen /> },
  { key: "PAST", label: "Past", icon: <FaHistory /> },
  { key: "REVIEWS", label: "Reviews", icon: <FaStar /> }
];

const ProfilePage = () => {
  const userId = useSelector((state) => state.auth.userId);
  const { orders } = useOrders();
  const [userData, setUserData] = useState({ name: "", location: "" });
  const [location, setLocation] = useState("");
  const [editing, setEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("CURRENT");
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_USER_SERVICE}/${userId}`);
        const data = await res.json();
        setUserData({ name: data.name, location: data.location });
        setLocation(data.location);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (activeTab !== "REVIEWS" || !userId) return;
      setLoadingReviews(true);
      try {
        const res = await fetch(`http://localhost:8090/users/${userId}/ratings`);
        const data = await res.json();
        setUserReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch user reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchUserReviews();
  }, [activeTab, userId]);

  const currentOrders = orders?.filter(
    (o) => !["completed", "canceled"].includes(o.order?.orderStatus?.toLowerCase())
  );
  const pastOrders = orders?.filter(
    (o) => ["completed", "canceled"].includes(o.order?.orderStatus?.toLowerCase())
  );

  const fetchLocationSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await res.json();
      setSuggestions(data.map((place) => place.display_name));
    } catch (err) {
      console.error("Location fetch error:", err);
    }
  };

  const updateLocation = async (newLocation) => {
    if (!userId || !newLocation) return;
    try {
      await fetch(`${process.env.REACT_APP_USER_SERVICE}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation })
      });
      setUserData((prev) => ({ ...prev, location: newLocation }));
      setLocation(newLocation);
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "CURRENT") {
      return currentOrders?.length ? (
        <ul className="space-y-3">{currentOrders.map((o) => <OrderView key={o.order.orderId} orderWrapper={o} color="text-yellow-600" />)}</ul>
      ) : (
        <p className="text-gray-500 text-center">No current orders.</p>
      );
    }
    if (activeTab === "PAST") {
      return pastOrders?.length ? (
        <ul className="space-y-3">{pastOrders.map((o) => <OrderView key={o.order.orderId} orderWrapper={o} color="text-green-600" />)}</ul>
      ) : (
        <p className="text-gray-500 text-center">No past orders.</p>
      );
    }
    if (activeTab === "REVIEWS") {
      return loadingReviews ? (
        <p className="text-gray-500 text-center">Loading your reviews...</p>
      ) : (
        <ReviewList reviews={userReviews} />
      );
    }
    return null;
  };

  return (
    <>
      <ProfileHeader />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 px-4">
        <div className="bg-white w-full max-w-2xl rounded-t-2xl shadow-md">
          <div className="flex flex-col items-center py-5">
            <h2 className="text-xl font-bold text-gray-800">{userData.name || "Loading..."}</h2>

            <div className="flex items-center gap-2 mt-1 text-gray-600 relative">
              <FaMapMarkerAlt className="text-red-500" />
              {editing ? (
                <>
                  <input
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      fetchLocationSuggestions(e.target.value);
                    }}
                    className="border px-2 py-1 rounded-md text-sm w-60"
                    placeholder="Update location..."
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-10 top-8 bg-white border w-60 rounded shadow max-h-40 overflow-auto">
                      {suggestions.map((s, i) => (
                        <li key={i} className="px-3 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => updateLocation(s)}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <FaCheck className="text-green-500 cursor-pointer" onClick={() => updateLocation(location)} />
                </>
              ) : (
                <>
                  <span className="text-sm">{location || "No location set"}</span>
                  <FaEdit className="text-gray-400 cursor-pointer" onClick={() => setEditing(true)} />
                </>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-around border-t border-b bg-gray-50">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 flex flex-col items-center text-sm font-medium transition-all ${
                  activeTab === tab.key
                   ? "text-[#06C167] border-b-2 border-[#06C167]"
          : "text-gray-500 hover:text-[#06C167]"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-2xl bg-white rounded-b-2xl shadow-md px-4 py-6 mt-0">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
