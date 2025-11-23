import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Payments from "./pages/Payment";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-700 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">LegacyBridge Finance</h1>
            <div className="space-x-6">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/customers" className="hover:underline">
                Customers
              </Link>
              <Link to="/payments" className="hover:underline">
                Payments
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
