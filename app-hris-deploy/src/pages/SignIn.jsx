import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "./api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Ambil CSRF token
      await api.get("/sanctum/csrf-cookie");

      // 2. Kirim data login
      await api.post("/login", { email, password });

      // 3. Ambil data user
      // const res = await api.get("/api/user");

      Swal.fire({
        icon: "success",
        title: "Berhasil Login",
        text: `Selamat datang, `,
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/company");
    } catch (error) {
      let message = "Terjadi kesalahan tidak dikenal.";

      if (error.response) {
        const status = error.response.status;

        if (status === 422) {
          message = "Data tidak valid. Pastikan email dan password terisi.";
        } else if (status === 401) {
          message = "Email atau password salah.";
        } else if (status === 500) {
          message = "Kesalahan server. Coba lagi nanti.";
        } else {
          message = error.response.data.message || message;
        }
      } else if (error.request) {
        message = "Tidak ada respons dari server.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        {/* Gambar */}
        <div className="flex items-center justify-center bg-sky-300 w-full md:w-1/2 p-6 md:order-2">
          <img
            src="/assets/icons/images/logohris.png"
            alt="HRIS Logo"
            className="w-3/4 md:w-2/3 max-w-xs rounded-2xl bg-white p-3"
            onError={(e) => (e.target.src = "/assets/icons/default.svg")}
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center md:order-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            LOGIN
          </h2>
          <p className="text-gray-500 mb-6 text-center text-sm">
            Silakan login dengan akun berikut yang sudah terdaftar. <br />
            Email : admin04@gmail.com <br />
            Password : admin123456
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-md transition cursor-pointer ${
                loading
                  ? "bg-sky-300 text-white cursor-not-allowed"
                  : "bg-sky-400 text-white hover:bg-sky-500"
              }`}
            >
              {loading ? "Memproses..." : "Sign In"}
            </button>
            {/* <div className="text-center text-sm text-gray-500">
              Belum punya akun?
            </div>
            <Link
              to="/signup"
              className="w-full inline-block border border-gray-300 py-3 rounded-md text-center text-gray-700 hover:bg-gray-100 transition"
            >
              Daftar
            </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
}
