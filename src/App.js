import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CarProgressLoading from "./components/all-components/CarProgressLoading";
import ProtectedRoute from "./components/ProtectedRoute";
import ShoppingCart from "./pages/user-pages/Cart/ShoppingCart";
import CarBooking from "./pages/Booking/CarBooking";
import ScrollToTop from "./components/ScrollToTop";

const HomePage = lazy(() => import("./pages/user-pages/Home/HomePage"));
const Login = lazy(() => import("./pages/user-pages/Auth/Login"));
const Signup = lazy(() => import("./pages/user-pages/Auth/Signup"));
const AboutDetail = lazy(() => import("./pages/user-pages/AboutUsDetail/AboutUsDetail"));
const ListCars = lazy(() => import("./pages/user-pages/ListCars/ListCars"));
const ProductDetail = lazy(() => import("./pages/user-pages/ProductDetail/productDetail"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageUser = lazy(() => import("./pages/admin/ManageUser"));
const ManageCar = lazy(() => import("./pages/admin/ManageCar"));
const Profile = lazy(() => import("./pages/admin/Profile"));
const ChangePassword = lazy(() => import("./pages/admin/ChanePassword"));
const ProcessOrder = lazy(() => import("./pages/admin/ProcessOrder"));
const ProfileUser = lazy(() => import("./pages/view/ProfileUser"));
const HistoryOrder = lazy(() => import("./pages/view/HistoryOrder"));
const UserChangePassword = lazy(() => import("./pages/view/UserChangePassword"));


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<CarProgressLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about-us" element={<AboutDetail />} />
          <Route path="/car-list" element={<ListCars />} />
          <Route path="/product/:name" element={<ProductDetail />} />

          {/* Protected user routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history-order"
            element={
              <ProtectedRoute>
                <HistoryOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-change-password"
            element={
              <ProtectedRoute>
                <UserChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <CarBooking />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <ManageUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cars"
            element={
              <ProtectedRoute adminOnly>
                <ManageCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <ProcessOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute adminOnly>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/change-password"
            element={
              <ProtectedRoute adminOnly>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;