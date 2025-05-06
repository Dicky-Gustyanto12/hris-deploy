import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "" });
  const [editRole, setEditRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
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
      .get(`/api/role?company_id=${companyId}`)
      .then((res) => {
        const data =
          res.data?.data?.data || res.data?.data || res.data?.roles || res.data;

        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Format Data Tidak Valid",
            text: "Struktur data roles tidak dikenali.",
          });
          setRoles([]);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data roles:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Roles",
          text: "Terjadi kesalahan saat memuat roles.",
        });
        setRoles([]);
      })
      .finally(() => setLoading(false));
  };

  const handleCreateOrUpdateRole = () => {
    const companyId = localStorage.getItem("company_id");
    const { name } = newRole;

    if (!companyId || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Nama role wajib diisi.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("company_id", companyId);

    const request = editRole
      ? api.post(`/api/role/update/${editRole.id}`, formData)
      : api.post("/api/role", formData);

    request
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: editRole ? "Role Diperbarui" : "Role Dibuat",
          text: `${res.data.data.name} berhasil ${
            editRole ? "diperbarui" : "dibuat"
          }.`,
          timer: 1200,
          showConfirmButton: false,
        });
        setShowModal(false);
        setNewRole({ name: "" });
        setEditRole(null);
        fetchRoles();
      })
      .catch((error) => {
        console.error("Create/Update Role error:", error);
        Swal.fire({
          icon: "error",
          title: editRole ? "Gagal Memperbarui Role" : "Gagal Menambahkan Role",
          text: "Silakan coba lagi.",
        });
      });
  };

  const handleEdit = (role) => {
    setEditRole(role);
    setNewRole({ name: role.name });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus role ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/api/role/${id}`)
          .then(() => {
            Swal.fire("Terhapus!", "Role berhasil dihapus.", "success");
            fetchRoles();
          })
          .catch(() => {
            Swal.fire("Gagal!", "Tidak dapat menghapus role.", "error");
          });
      }
    });
  };

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-gray-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-6">
        <div className="lg:hidden mb-4">
          <label htmlFor="my-drawer" className="btn btn-ghost p-2">
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Company Roles
            </h1>
            <p className="text-sm text-gray-400">
              Daftar roles di perusahaan ini
            </p>
          </div>
          <button
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm hover:bg-indigo-700 transition"
            onClick={() => setShowModal(true)}
          >
            New Role
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Memuat roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-gray-400">Belum ada roles tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col gap-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">{role.name}</p>
                  <p className="text-sm text-gray-400">
                    {role.assigned_count || 0} people assigned
                  </p>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    className="btn btn-sm btn-outline text-black"
                    onClick={() => handleEdit(role)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm text-white"
                    onClick={() => handleDelete(role.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <Sidebar />
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-slate-500 opacity-80 z-20"></div>
          <div className="fixed inset-0 flex items-center justify-center z-30 px-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editRole ? "Edit Role" : "Buat Role Baru"}
              </h2>

              <input
                type="text"
                placeholder="Nama role"
                className="input input-bordered w-full mb-4"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setNewRole({ name: "" });
                    setEditRole(null);
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn btn-success text-white"
                  onClick={handleCreateOrUpdateRole}
                >
                  {editRole ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Roles;
