import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import './Dashboard.css';
import { authFetch } from '../utils/authFetch';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar tokens y redirigir
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

  useEffect(() => {
        authFetch(`${process.env.REACT_APP_API_URL}/usuarios/dashboard/`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(setData)
    .catch(() => navigate('/'));
  }, [navigate]);

  if (!data) return <p>Cargando dashboard...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar user={data} onLogout={handleLogout} />
      <main style={{ padding: 20 }}>
        <h2>Bienvenido al Dashboard</h2>
        <p><strong>Usuario:</strong> {data.nombre} ({data.email})</p>
        <p><strong>Rol:</strong> {data.rol}</p>
        <p><strong>Total de instrumentos:</strong> {data.total_instrumentos}</p>
        <p><strong>Total de certificados:</strong> {data.total_certificados}</p>

        {data.puede_generar_reportes && (
          <div>
            <h3>🔍 Módulo de reportes (en construcción)</h3>
            <p>Próximamente podrás generar informes aquí.</p>
          </div>
        )}
      </main>
    </div>
  );
}