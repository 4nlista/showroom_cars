import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CarProgressLoading from "./components/all-components/CarProgressLoading";
import ShoppingCart from "./pages/user-pages/Cart/ShoppingCart";
import CarBooking from "./pages/Booking/CarBooking";


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
      <Suspense fallback={<CarProgressLoading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/ve-chung-toi" element={<AboutDetail />} />
          <Route path="/danh-sach-san-pham" element={<ListCars />} />
          <Route path="/san-pham/:name" element={<ProductDetail />} />
          <Route path="/gio-hang" element={<ShoppingCart />} />
          <Route path="/profile" element={<ProfileUser />} />
          <Route path="/history-order" element={<HistoryOrder />} />
          <Route path="/user-change-password" element={<UserChangePassword />} />
          <Route path="/booking" element={<CarBooking />} />

          <Route path="/admin/quan-tri" element={<Dashboard />} />
          <Route path="/admin/quan-ly-nguoi-dung" element={<ManageUser />} />
          <Route path="/admin/quan-ly-xe" element={<ManageCar />} />
          <Route path="/admin/process-orders" element={<ProcessOrder />} />
          <Route path="/admin/ho-so-ca-nhan" element={<Profile />} />
          <Route path="/admin/doi-mat-khau" element={<ChangePassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;