import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage"; // Create this page
import SearchPage from "./pages/SearchPage"; // Create this page
import NotificationsPage from "./pages/NotificationsPage"; // Create this page
import CartPage from "./pages/CartPage"; // Create this page
import OrdersPage from "./pages/OrdersPage"; // Create this page
import AuthProviderComponent from "./components/AuthProvider";
import Layout from "./Layout";
import DishList from "./pages/DishList";
import DishDetails from "./pages/DishDetails";
import ListDish from "./pages/ListDish";
import MapView from "./pages/MapView";
import { DishSearchProvider } from "./context/DishSearchContext";
import { CartProvider } from "./context/CartContext"; 
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
    <AuthProviderComponent>
      <AuthProvider>
        <DishSearchProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/search">
                  <Route index element={<SearchPage />} />
                </Route>
                <Route
                  path="/dish-list"
                  element={
                    <div className="container-fluid flex-grow-1">
                      <div className="row h-100">
                        <div className="col-md-6 overflow-auto">
                          <DishList />
                        </div>

                        <div className="col-md-6 p-0">
                          <MapView />
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route path="/dish/:id" element={<DishDetails />} />
                <Route path="/list-dish" element={<ListDish />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </div>
          </Router>
          </CartProvider>
        </DishSearchProvider>
      </AuthProvider>
    </AuthProviderComponent>
    </Provider>
  );
}

export default App;
