// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Rumah = () => (
  <ul className="menu p-4 w-64 min-h-full bg-white text-base-content">
    <div className="text-xl font-medium mb-10 mt-4 text-black items-center">
      <img
        src="/assets/icons/logohris.png"
        alt="Logo"
        className="w-1/2"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/icons/default.svg";
        }}
      />
      <p className="pt-3">Human Resource Information System</p>
    </div>

    <p className="text-gray-400 uppercase mb-2">Daily Use</p>
    <li>
      <Link
        to="/"
        className="flex items-center gap-3 bg-indigo-100 text-indigo-600 font-medium rounded px-2 py-1"
      >
        <img
          src="/assets/icons/ic-grid.svg"
          className="w-5 h-5"
          alt="Overview"
        />
        Overview
      </Link>
    </li>
    <li>
      <Link
        to="/employee"
        className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded px-2 py-1"
      >
        <img
          src="/assets/icons/ic-users.svg"
          className="w-5 h-5"
          alt="Employees"
        />
        Employees
      </Link>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-briefcase.svg"
          className="w-5 h-5"
          alt="My Teams"
        />
        My Teams
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img src="/assets/icons/ic-flag.svg" className="w-5 h-5" alt="Roles" />
        Roles
      </a>
    </li>

    <p className="text-gray-400 uppercase mt-6 mb-2">Others</p>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-box.svg"
          className="w-5 h-5"
          alt="Insurances"
        />
        Insurances
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-home.svg"
          className="w-5 h-5"
          alt="Company"
        />
        Company
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-gift.svg"
          className="w-5 h-5"
          alt="Rewards"
        />
        Rewards
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-settings.svg"
          className="w-5 h-5"
          alt="Settings"
        />
        Settings
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded">
        <img
          src="/assets/icons/ic-signout.svg"
          className="w-5 h-5"
          alt="Logout"
        />
        Logout
      </a>
    </li>
  </ul>
);

export default Rumah;
