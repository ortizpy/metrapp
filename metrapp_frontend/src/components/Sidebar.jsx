import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  return (
    <aside style={{ padding: 20, borderRight: "1px solid #ccc", width: 250 }}>
      <h3>MetrApp</h3>
      <p><strong>{user.nombre}</strong> ({user.rol})</p>
      <nav>
        <ul>
          <li><Link to="/dashboard">Inicio</Link></li>
          {user.puede_generar_reportes && <li><Link to="/reportes">Reportes</Link></li>}
        </ul>
      </nav>
      <button onClick={onLogout}>Cerrar sesión</button>
    </aside>
  );
}
