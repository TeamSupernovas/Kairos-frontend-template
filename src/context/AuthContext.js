import React, { createContext, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAndRegisterUser = async () => {
      if (!isAuthenticated || !user) return;

      const userIdFromAuth0 = user.sub.split("|")[1];
      const userServiceUrl = `${process.env.REACT_APP_USER_SERVICE}/${userIdFromAuth0}`;

      try {
        // Check if user exists
        const response = await fetch(userServiceUrl);
        const contentType = response.headers.get("content-type");

        let role = process.env.REACT_APP_ROLE;

        if (response.ok) {
          const data = contentType.includes("application/json")
            ? await response.json()
            : await response.text();
          console.log("User exists:", data);
          role = data.role || role; // Use role from API if available
        } else if (response.status === 404) {
          // User not found, register them
          const newUser = {
            name: user.name,
            role,
            user_id: userIdFromAuth0,
          };

          const createResponse = await fetch(process.env.REACT_APP_USER_SERVICE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });

          if (createResponse.ok) {
            console.log("User registered");
          } else {
            console.error("User registration failed");
            return;
          }
        } else {
          console.error("Error checking user:", response.status);
          return;
        }

        // Dispatch userId and role to Redux
        dispatch(setUser({ userId: userIdFromAuth0, role }));
      } catch (error) {
        console.error("Error during authentication process:", error);
      }
    };

    checkAndRegisterUser();
  }, [isAuthenticated, user, dispatch]);

  return <AuthContext.Provider value={{ user, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
