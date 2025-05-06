import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const UserLogin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch (err) {
        console.error("User belum login:", err);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <p className="p-4">Memuat data pengguna...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Selamat datang, {user.name}</h2>
    </div>
  );
};

export default UserLogin;
