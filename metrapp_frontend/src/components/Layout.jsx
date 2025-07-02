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
<Route path="/" element={<Layout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="reportes" element={<Reportes />} />
</Route>
