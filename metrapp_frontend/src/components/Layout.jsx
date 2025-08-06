import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/usuarios/logout/`, {
      method: 'GET',
      credentials: 'include'
    });
    navigate('/');
  };

  useEffect(() => {
    // 1. Inicializar cookie CSRF
    fetch(`${process.env.REACT_APP_API_URL}/api/init-csrf/`, {
    credentials: 'include',
    });
    
    // 2. Obtener datos del usuarios autenticado
    fetch(`${process.env.REACT_APP_API_URL}/usuarios/dashboard/`, {
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
