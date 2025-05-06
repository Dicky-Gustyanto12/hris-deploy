import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "./api"; // use your configured Axios instance
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const StatCard = ({ title, count, loading }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [animatedDone, setAnimatedDone] = useState(false);

  useEffect(() => {
    if (!loading && count > 0 && !animatedDone) {
      let start = 0;
      const duration = 800;
      const increment = count / (duration / 10);
      const interval = setInterval(() => {
        start += increment;
        if (start >= count) {
          start = count;
          clearInterval(interval);
          setAnimatedDone(true);
        }
        setDisplayCount(Math.floor(start));
      }, 10);

      return () => clearInterval(interval);
    }
  }, [count, loading, animatedDone]);

  return (
    <div
      className={`bg-white shadow rounded-xl p-6 flex justify-between items-center ${
        loading && !animatedDone ? "animate-pulse" : ""
      }`}
    >
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">
          {loading && !animatedDone ? (
            <span className="bg-gray-200 rounded w-16 h-8 inline-block"></span>
          ) : (
            displayCount
          )}
        </p>
      </div>
      <button className="text-indigo-500 text-2xl font-bold">+</button>
    </div>
  );
};

const Dashboard = () => {
  const [employees, setEmployees] = useState(0);
  const [teams, setTeams] = useState(0);
  const [roles, setRoles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");

    if (!companyId) {
      Swal.fire({
        icon: "warning",
        title: "Perusahaan Belum Dipilih",
        text: "Silakan pilih perusahaan terlebih dahulu.",
      });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [empRes, teamRes, roleRes] = await Promise.all([
          api.get(`/api/employee?company_id=${companyId}`),
          api.get(`/api/team?company_id=${companyId}`),
          api.get(`/api/role?company_id=${companyId}`),
        ]);

        const empList = empRes.data?.data?.data || empRes.data?.data || [];
        const teamList = teamRes.data?.data?.data || teamRes.data?.data || [];
        const roleList = roleRes.data?.data?.data || roleRes.data?.data || [];

        setEmployees(empList.length || 0);
        setTeams(teamList.length || 0);
        setRoles(roleList.length || 0);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Employees", value: employees },
    { name: "Teams", value: teams },
    { name: "Roles", value: roles },
  ];

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-gray-50 p-6">
        <div className="lg:hidden mb-4">
          <label htmlFor="my-drawer" className="btn btn-ghost p-2">
            <svg
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

        <h1 className="text-3xl font-semibold text-gray-800 mb-10">Overview</h1>

        <section className="mb-12">
          <h2 className="text-lg font-medium text-gray-800 mb-1">Statistics</h2>
          <p className="text-sm text-gray-400 mb-6">
            Overview data pada perusahaan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatCard title="Employees" count={employees} loading={loading} />
            <StatCard title="Teams" count={teams} loading={loading} />
            <StatCard title="Roles" count={roles} loading={loading} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-1">
              Statistics Graphic
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Grafik Jumlah Employee, Team, dam Employee
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
