import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard"; 
import Billing from "../pages/Billing";
import MasterDashboard from "../pages/MasterDashboard";
import Customers from "../pages/Customers";
import Items from "../pages/Items";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/master" element={<MasterDashboard />} />
      <Route path="/master/customers" element={<Customers />} />
      <Route path="/master/items" element={<Items />} />
    </Routes>
  );
};

export default AppRoutes;
