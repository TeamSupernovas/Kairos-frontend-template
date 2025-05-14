import React, {useState} from "react";
import DishList from "./DishList";
import MapView from "./MapView";
import Header from "../components/Header";
import RecommendedDishList from "./RecommendedDishList";
import { RecommendedContext } from "../context/RecommendedContext";
const SearchPage = () => {
    const [recommendedIds, setRecommendedIds] = useState(new Set());
  return (
    <>
     <RecommendedContext.Provider value={{ recommendedIds, setRecommendedIds }}>
      <Header />
      <div
        className="container-fluid px-4 py-3"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="row h-100">
          {/* Left Side - Dish List */}
          <div className="col-md-6 overflow-auto" style={{ maxHeight: "100%" }}>
             <RecommendedDishList />
            <DishList />
          </div>

          {/* Right Side - Map View */}
          <div className="col-md-6 p-0">
            <MapView />
          </div>
        </div>
      </div>
      </RecommendedContext.Provider>
    </>
  );
};

export default SearchPage;
