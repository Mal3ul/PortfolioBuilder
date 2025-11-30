import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Dashboard.css";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-main">
        {/* <Header /> */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
