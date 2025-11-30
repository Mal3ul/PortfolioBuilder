import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Public.css";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      {/* <Header /> */}
      <main className="public-content"><Outlet /></main>
      <Footer />
    </div>
  );
}
