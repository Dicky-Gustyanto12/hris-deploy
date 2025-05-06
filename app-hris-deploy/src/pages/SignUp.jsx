import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://api.hris.portfoliodigato.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Akun Berhasil Dibuat",
          text: "Silakan login menggunakan akun Anda.",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: data.message || "Silakan coba lagi.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan Jaringan",
        text: "Gagal terhubung ke server. Coba lagi nanti.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg flex flex-col-reverse md:flex-row overflow-hidden w-full max-w-4xl">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create an account
          </h2>
          <p className="text-gray-500 mb-6 text-center">
            Buat akun Admin untuk mengelola data pegawai.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-sky-400 text-white font-medium py-3 rounded-md hover:bg-sky-500 transition cursor-pointer"
            >
              Create Account
            </button>

            <p className="text-sm text-center text-gray-500 mt-2">
              Sudah punya akun?{" "}
              <Link to="/signin" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-sky-300 p-6">
          <img
            src="/assets/icons/images/logohris.png"
            alt="HRIS Logo"
            className="w-3/4 md:w-2/3 max-w-xs rounded-2xl bg-white p-3 "
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/icons/default.svg";
            }}
          />
        </div>
      </div>
    </div>
  );
}
