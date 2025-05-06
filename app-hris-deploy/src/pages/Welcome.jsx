import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-sky-200 px-6">
      <div className="text-center max-w-xl w-full p-6 md:p-8 bg-white rounded-xl shadow-md">
        {/* Card logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 md:p-6 rounded-full shadow w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            <img
              src="/assets/icons/logohris.png"
              alt="HRIS Logo"
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/icons/default.svg";
              }}
            />
          </div>
        </div>

        {/* Konten utama */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          HRIS Website
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-6">
          Akses sistem informasi HR Anda dengan mudah dan aman.
          <br />
          Silakan login untuk melanjutkan.
        </p>
        <button
          onClick={handleStart}
          className="bg-sky-600 text-white text-base md:text-lg font-semibold px-6 py-3 rounded-lg hover:bg-sky-700 transition"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}
