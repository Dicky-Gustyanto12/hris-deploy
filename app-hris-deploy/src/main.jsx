import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "./components/PrivateRoute";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/Employee";
import Teams from "./pages/Teams";
import Roles from "./pages/Roles";
import Company from "./pages/Company";
import UserLogin from "./pages/UserLogin";

import Rumah from "./pages/Rumah";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<EmployeesPage />} />
          <Route path="/team" element={<Teams />} />
          <Route path="/role" element={<Roles />} />
          <Route path="/company" element={<Company />} />
          <Route path="/userlogin" element={<UserLogin />} />

          <Route path="/rumah" element={<Rumah />} />
        </Routes>
      </Router>
    </>
  </StrictMode>
);
