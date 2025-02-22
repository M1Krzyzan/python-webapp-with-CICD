import { Route, Routes } from "react-router-dom";
import Home from "./pages/ProductsList";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import CartPage from "./pages/Cart";
import RegisterForm from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import { ProtectedRouteWrapper } from "./auth/ProtectedRouterWrapper.tsx";
import { UserRole } from "./auth/UserRole.ts";
import React from "react";
import CheckoutPage from "./pages/Checkout.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";

export let BACKEND_URL =  "http://localhost:8002" ; // Default value

export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json");
    const data = await response.json(); // Store the config globally
    BACKEND_URL = data.backendUrl;
    console.log(BACKEND_URL);
  } catch (error) {
    console.error("Failed to load config.json, using defaults", error);
  }
};

loadConfig();

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/checkout"
          element={
            <ProtectedRouteWrapper allowedRoles={[UserRole.CLIENT]}>
              <CheckoutPage />
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRouteWrapper allowedRoles={[UserRole.CLIENT]}>
              <SuccessPage />
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRouteWrapper allowedRoles={[UserRole.ADMIN]}>
              <Routes>
                <Route path="/" element={<Admin />} />
              </Routes>
            </ProtectedRouteWrapper>
          }
        ></Route>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;