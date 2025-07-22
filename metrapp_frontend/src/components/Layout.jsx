import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('https://metrapp.onrender.com/usuarios/logout/', {
      method: 'GET',
      credentials: 'include'
    });
    navigate('/');
  };

  useEffect(() => {
    // 1. Inicializar cookie CSRF
    fetch('https://metrapp.onrender.com/api/init-csrf/', {
    credentials: 'include',
    });
    
    // 2. Obtener datos del usuarios autenticado
    fetch('https://metrapp.onrender.com/usuarios/dashboard/', {
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => navigate('/'));
  }, [navigate]);

  if (!user) return <p>Cargando sesión...</p>;

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}
