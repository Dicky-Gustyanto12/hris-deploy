import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "./api"; // axios instance
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl px-6 py-8 text-center">
    <p className="text-sm text-gray-400">{label}</p>
    <h2 className="text-3xl font-bold text-gray-800">
      {value.toLocaleString()}
    </h2>
  </div>
);

const EmployeeCard = ({ name, role, image, verified }) => (
  <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center text-center">
    <img
      src={image || "/default-avatar.png"}
      alt={name}
      className="w-16 h-16 rounded-full mb-4 object-cover"
    />
    <p className="font-semibold text-indigo-800">{name}</p>
    <p className="text-gray-500 text-sm">{role}</p>
    {verified ? (
      <span className="text-green-500 text-sm mt-2">✔ Verified</span>
    ) : (
      <a href="#" className="text-indigo-600 text-sm mt-2 font-medium">
        Verify Now
      </a>
    )}
  </div>
);

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");

    if (!companyId) {
      Swal.fire({
        icon: "warning",
        title: "Perusahaan Belum Dipilih",
        text: "Silakan pilih perusahaan terlebih dahulu.",
      }).then(() => navigate("/company"));
      return;
    }

    api
      .get(`/api/employee?company_id=${companyId}`)
      .then((res) => {
        console.log("Employees API Response:", res.data);

        const data =
          res.data?.data?.data || res.data?.data || res.data.employees || [];

        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Data Tidak Valid",
            text: "Format data karyawan tidak dikenali.",
          });
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data karyawan:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Karyawan",
          text: "Terjadi kesalahan saat mengambil data.",
        });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Statistik sederhana berdasarkan jenis kelamin
  const total = employees.length;
  const male = employees.filter(
    (e) => (e.gender || "").toLowerCase() === "male"
  ).length;
  const female = employees.filter(
    (e) => (e.gender || "").toLowerCase() === "female"
  ).length;

  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-gray-50 p-6">
        {/* Hamburger (mobile) */}
        <div className="lg:hidden mb-4">
          <label htmlFor="sidebar-drawer" className="btn btn-ghost p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium">
            Add Employee
          </button>
        </div>

        {/* Statistik */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
          <p className="text-sm text-gray-400 mb-4">Your team powers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Employees" value={total} />
            <StatCard label="MALE" value={male} />
            <StatCard label="FEMALE" value={female} />
          </div>
        </div>

        {/* Daftar Karyawan */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">People</h2>
          <p className="text-sm text-gray-400 mb-4">The rangers</p>
          {loading ? (
            <p className="text-gray-400">Memuat data karyawan...</p>
          ) : employees.length === 0 ? (
            <p className="text-gray-400">Belum ada karyawan terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {employees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  name={emp.name}
                  role={emp.role}
                  image={emp.image_url}
                  verified={emp.verified}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default EmployeesPage;
