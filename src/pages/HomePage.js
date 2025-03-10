import React from "react";
import LogoutButton from "../components/LogoutButton";
import Profile from "../components/Profile";

const HomePage = () => {
  return (
    <div>
      <Profile />
      <LogoutButton />
    </div>
  );
};

export default HomePage;
