import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button"; // adjust the path if needed

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      label="Logout"
      onClick={() => logout({ returnTo: window.location.origin })}
      variant="danger"
      className="rounded-pill"
    />
  );
};

export default LogoutButton;
