import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", icon: null });
  const [editTeam, setEditTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
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
      .get(`/api/team?company_id=${companyId}`)
      .then((res) => {
        const nestedTeams = res.data?.data?.data;
        if (Array.isArray(nestedTeams)) {
          setTeams(nestedTeams);
        } else {
          Swal.fire({
            icon: "error",
            title: "Format Data Tidak Valid",
            text: "Data tim tidak dikenali dari server.",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Tim",
          text: "Terjadi kesalahan saat mengambil data tim.",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleCreateOrUpdateTeam = () => {
    const companyId = localStorage.getItem("company_id");
    const { name, icon } = newTeam;

    if (!companyId || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Nama tim wajib diisi.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("company_id", companyId);
    if (icon) formData.append("icon", icon);

    const request = editTeam
      ? api.post(`/api/team/update/${editTeam.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : api.post("/api/team", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: editTeam ? "Tim Diperbarui" : "Tim Dibuat",
          text: `${res.data.data.name} berhasil ${
            editTeam ? "diperbarui" : "dibuat"
          }.`,
          timer: 1200,
          showConfirmButton: false,
        });
        setShowModal(false);
        setNewTeam({ name: "", icon: null });
        setEditTeam(null);
        fetchTeams();
      })
      .catch((error) => {
        console.error("Update/Create error:", error);
        Swal.fire({
          icon: "error",
          title: editTeam ? "Gagal Memperbarui Tim" : "Gagal Menambahkan Tim",
          text: "Silakan coba lagi.",
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus tim ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/api/team/${id}`)
          .then(() => {
            Swal.fire("Terhapus!", "Tim berhasil dihapus.", "success");
            fetchTeams();
          })
          .catch(() => {
            Swal.fire("Gagal!", "Tidak dapat menghapus tim.", "error");
          });
      }
    });
  };

  const handleEdit = (team) => {
    const companyId = localStorage.getItem("company_id");
    setEditTeam(team);
    setNewTeam({ name: team.name, icon: null });
    setShowModal(true);
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
            <h1 className="text-2xl font-semibold text-gray-800">My Teams</h1>
            <p className="text-sm text-gray-400 pt-2">
              Tim yang tersedia dalam perusahaan ini
            </p>
          </div>
          <button
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm hover:bg-indigo-700 transition"
            onClick={() => setShowModal(true)}
          >
            Build New Team
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Memuat data tim...</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-400">Tidak ada tim tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl p-6 bg-white shadow flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 rounded-full mb-4 bg-gray-100">
                    <img
                      src={team.icon || "/default-icon.svg"}
                      alt="icon"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {team.employees_count || 0} People
                  </p>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(team)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm text-white"
                    onClick={() => handleDelete(team.id)}
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
                {editTeam ? "Edit Tim" : "Buat Tim Baru"}
              </h2>

              <input
                type="text"
                placeholder="Nama tim"
                className="input input-bordered w-full mb-3"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <div className="flex flex-col items-start gap-2 mb-4 w-full">
                <label className="text-sm font-medium text-gray-600">
                  Upload Icon
                </label>
                <label className="cursor-pointer bg-gray-100 text-sm px-4 py-2 rounded border border-gray-300 shadow-sm hover:bg-gray-200 transition">
                  Pilih Icon
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setNewTeam((prev) => ({
                        ...prev,
                        icon: e.target.files[0],
                      }))
                    }
                  />
                </label>
                <span className="text-sm text-gray-500 mt-1">
                  {newTeam.icon ? newTeam.icon.name : "Belum ada file dipilih"}
                </span>

                {newTeam.icon && (
                  <img
                    src={URL.createObjectURL(newTeam.icon)}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover mt-2"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setNewTeam({ name: "", icon: null });
                    setEditTeam(null);
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn btn-success text-white"
                  onClick={handleCreateOrUpdateTeam}
                >
                  {editTeam ? "Perbarui" : "Daftar Tim"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Teams;
