import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
} from "react-router-dom";
import { RequireAuth } from "./components/ui/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useStore } from "./hooks/useStore";
import AddOffering from "./pages/AddOffering";
import { Toaster } from "./components/ui/toaster";
import Checkout from "./pages/Checkout";

export const ROUTE_PATHS = {
  DASHBOARD: "dashboard",
  LOGIN: "/login",
  ADD_OFFERING: "/add-offering",
  CHECKOUT: "checkout",
};

const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to={ROUTE_PATHS.LOGIN} />} />
      <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTE_PATHS.ADD_OFFERING} element={<AddOffering />} />
        <Route path={ROUTE_PATHS.CHECKOUT} element={<Checkout />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={Router} />
      {/* <Dashboard /> */}
      {/* <AddOffering /> */}
      <Toaster />
    </>
  );
}

export default App;
