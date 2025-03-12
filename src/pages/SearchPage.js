import React from "react";
import DishList from "./DishList";
import MapView from "./MapView";

const SearchPage = () => {
  return (
    <div
      className="container-fluid px-4 py-3"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="row h-100">
        {/* Left Side - Dish List */}
        <div className="col-md-6 overflow-auto" style={{ maxHeight: "100%" }}>
          <DishList />
        </div>

        {/* Right Side - Map View */}
        <div className="col-md-6 p-0">
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
