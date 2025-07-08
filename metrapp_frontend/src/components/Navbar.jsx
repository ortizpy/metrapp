import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header style={{
      backgroundColor: "#f4f4f4",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #ddd"
    }}>
      <div>
        <h2 style={{ margin: 0 }}>MetrApp</h2>
      </div>
      <nav>
        <span style={{ marginRight: 20 }}>
          {user.nombre} ({user.rol})
        </span>
        <Link to="/dashboard" style={{ marginRight: 15 }}>Dashboard</Link>
        {user.puede_generar_reportes && (
          <Link to="/reportes" style={{ marginRight: 15 }}>Reportes</Link>
        )}
        <Link to="/registrar-instrumento" style={{ marginRight: 15 }}>Registrar Instrumento</Link>
        <Link to="/ver-instrumentos" style={{ marginRight: 15 }}>Ver Instrumentos</Link>
        <button onClick={onLogout}>Cerrar sesión</button>
      </nav>
    </header>
  );
}
