import React from "react";
import { Routes, Route } from "react-router-dom";

// Import your page components
import Dashboard from "../pages/Dashboard"; // Adjust paths based on your folder structure!
import Billing from "../pages/Billing";

// Import the new Master pages
import MasterDashboard from "../pages/MasterDashboard";
import Customers from "../pages/Customers";
import Items from "../pages/Items";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      
      {/* Master Data Module */}
      <Route path="/master" element={<MasterDashboard />} />
      <Route path="/master/customers" element={<Customers />} />
      <Route path="/master/items" element={<Items />} />
    </Routes>
  );
};

export default AppRoutes;