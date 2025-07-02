import { Link, useLocation } from "react-router-dom";

<aside className="sidebar"></aside>

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();

  const linkStyle = (path) => ({
    display: 'block',
    padding: '10px 15px',
    color: location.pathname === path ? '#fff' : '#333',
    backgroundColor: location.pathname === path ? '#007bff' : 'transparent',
    textDecoration: 'none',
    borderRadius: '4px',
    marginBottom: '5px',
    fontWeight: location.pathname === path ? 'bold' : 'normal'
  });

  return (
    <aside style={{
      width: '220px',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      height: '100vh',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '30px' }}>MetrApp</h2>
      <p><strong>{user.nombre}</strong></p>
      <p style={{ fontSize: '0.9em', color: '#777' }}>{user.rol}</p>

      <nav style={{ marginTop: '30px' }}>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>📊 Dashboard</Link>

        {user.puede_generar_reportes && (
          <Link to="/reportes" style={linkStyle("/reportes")}>📈 Reportes</Link>
        )}
      </nav>

      <button onClick={onLogout} style={{
        marginTop: '40px',
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        🔒 Cerrar sesión
      </button>
    </aside>
  );
}
