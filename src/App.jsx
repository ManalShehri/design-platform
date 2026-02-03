import { useState } from "react";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Login from "./pages/Login";
import Profile from "./pages/Profile.jsx";

import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/create"
            element={
              <RequireAuth>
                <Create />
              </RequireAuth>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}