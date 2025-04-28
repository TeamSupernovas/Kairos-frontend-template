import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaUser, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
const Profile = () => {
  const navigate = useNavigate();
  const { userId, role } = useSelector((state) => state.auth);
  console.log(userId);
  console.log(role);
  return (
    <div className="flex flex-col min-h-screen">

    
      {/* Content Section with Colored Cards */}
      <div className="flex-1 p-4 grid gap-4">
        <div className="bg-red-200 p-6 rounded-lg shadow-md">🍔 Food Category 1</div>
        <div className="bg-blue-200 p-6 rounded-lg shadow-md">🍣 Food Category 2</div>
        <div className="bg-green-200 p-6 rounded-lg shadow-md">🍕 Food Category 3</div>
        <div className="bg-yellow-200 p-6 rounded-lg shadow-md">🥗 Food Category 4</div>
      </div>


    </div>
  );
};

export default Profile;
