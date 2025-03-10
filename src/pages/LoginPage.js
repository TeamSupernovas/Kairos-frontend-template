import React from "react";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to <span className="text-green-600 font-bold">Kairos</span>
        </h1>
        <p className="text-gray-500 mb-6">Surprising Flavors, Anytime Anywhere!</p>
        <LoginButton />
        {/* <p className="text-blue-500 text-sm mt-4 cursor-pointer">Forgot Password</p>
        <div className="mt-4">
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg mb-2">New to Kairos? Sign Up!</button>
          <p className="text-gray-500 text-sm">OR</p>
          <button className="w-full bg-white border border-gray-300 text-gray-800 py-2 rounded-lg mt-2">
            Login with Google
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
