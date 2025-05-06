import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Sesi login Anda akan diakhiri.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    });
  };

  const isActive = (path) => location.pathname === path;

  // Navigation Items
  const dailyUseItems = [
    {
      id: "overview",
      to: "/dashboard",
      icon: "ic-grid.svg",
      label: "Overview",
    },
    {
      id: "employee",
      to: "/employee",
      icon: "ic-users.svg",
      label: "Employees",
    },
    { id: "teams", to: "/team", icon: "ic-briefcase.svg", label: "My Teams" },
    { id: "roles", to: "/role", icon: "ic-flag.svg", label: "Roles" },
  ];

  const otherItems = [
    {
      id: "insurances",
      to: "",
      icon: "ic-box.svg",
      label: "Insurances",
    },
    { id: "company", to: "", icon: "ic-home.svg", label: "Company" },
    { id: "rewards", to: "", icon: "ic-gift.svg", label: "Rewards" },
    {
      id: "settings",
      to: "",
      icon: "ic-settings.svg",
      label: "Settings",
    },
  ];

  return (
    <ul className="menu p-4 w-64 min-h-full bg-white text-base-content">
      {/* Logo + Branding */}
      <div className="text-xl font-medium mb-10 mt-4 text-black items-center text-center">
        <img
          src="/assets/icons/logohris.png"
          alt="Logo"
          className="w-2/3 mx-auto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/icons/default.svg";
          }}
        />
        <p className="pt-3 text-sm text-gray-700">
          Human Resource Information System
        </p>
      </div>

      {/* Daily Use */}
      <p className="text-gray-400 uppercase mb-2 text-sm">Daily Use</p>
      {dailyUseItems.map(({ id, to, icon, label }) => (
        <li key={id}>
          <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded transition ${
              isActive(to)
                ? "bg-indigo-100 text-indigo-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <img
              src={`/assets/icons/${icon}`}
              className="w-5 h-5"
              alt={label}
            />
            {label}
          </Link>
        </li>
      ))}

      {/* Others */}
      <p className="text-gray-400 uppercase mt-6 mb-2 text-sm">Others</p>
      {otherItems.map(({ id, to, icon, label }) => (
        <li key={id}>
          <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded transition ${
              isActive(to)
                ? "bg-indigo-100 text-indigo-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <img
              src={`/assets/icons/${icon}`}
              className="w-5 h-5"
              alt={label}
            />
            {label}
          </Link>
        </li>
      ))}

      {/* Logout */}
      <li>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:bg-gray-100 w-full text-left transition"
        >
          <img
            src="/assets/icons/ic-signout.svg"
            className="w-5 h-5"
            alt="Logout"
          />
          Logout
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
