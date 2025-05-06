import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import Swal from "sweetalert2";

export default function Company() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoading(true);
    api
      .get("/api/company")
      .then((res) => {
        setCompanies(res.data.data || []);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Tidak dapat mengambil daftar perusahaan. Coba lagi nanti.",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSelect = (company) => {
    setSelectedCompany(company);
  };

  const handleContinue = () => {
    if (!selectedCompany) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Perusahaan",
        text: "Silakan pilih perusahaan terlebih dahulu.",
      });
      return;
    }

    localStorage.setItem("company_id", selectedCompany.id);

    Swal.fire({
      icon: "success",
      title: "Perusahaan Dipilih",
      text: `${selectedCompany.name} berhasil dipilih.`,
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {
      navigate("/dashboard");
    });
  };

  const handleRegisterCompany = () => {
    if (!newCompanyName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama Kosong",
        text: "Nama perusahaan tidak boleh kosong.",
      });
      return;
    }

    api
      .post("/api/company", { name: newCompanyName })
      .then((res) => {
        const newCompany = res.data.data;
        Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan",
          text: `${newCompany.name} berhasil ditambahkan.`,
          timer: 1500,
          showConfirmButton: false,
        });
        setNewCompanyName("");
        setShowModal(false);
        fetchCompanies();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Gagal Daftar",
          text: "Terjadi kesalahan saat mendaftar perusahaan.",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="bg-white rounded-3xl shadow-lg text-center w-full max-w-xl z-10 px-6 sm:px-10 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pilih Perusahaan
        </h2>
        <p className="text-gray-500 mb-6">
          Berikut list perusahaan yang telah terdaftar.
        </p>

        {loading ? (
          <p className="text-gray-400">Memuat daftar perusahaan...</p>
        ) : (
          <div className="mb-6">
            <div className="dropdown w-full">
              <div
                tabIndex={0}
                role="button"
                className="btn w-full font-normal btn-outline rounded"
              >
                {selectedCompany ? selectedCompany.name : "Pilih Perusahaan"}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-box outline-none z-[1] w-full p-2 shadow-xl text-black"
              >
                {companies.map((company) => (
                  <li key={company.id}>
                    <a onClick={() => handleSelect(company)}>{company.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          className="btn bg-sky-400 text-white w-full font-bold mb-5"
        >
          Continue
        </button>

        <div className="text-center text-sm text-gray-500 mb-3">
          <p>Perusahaan belum tersedia?</p>
        </div>

        <button
          className="btn text-black btn-outline w-full font-normal"
          onClick={() => setShowModal(true)}
        >
          Daftar
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-slate-500 opacity-80 z-20"></div>

          <div className="fixed inset-0 flex items-center justify-center px-4 z-30 mx-10">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Daftar Perusahaan Baru
              </h3>
              <input
                type="text"
                placeholder="Nama perusahaan baru"
                className="input input-bordered w-full mb-5"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
              <div className="flex justify-end gap-2 flex-wrap">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setNewCompanyName("");
                    setShowModal(false);
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn btn-success text-white"
                  onClick={handleRegisterCompany}
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
