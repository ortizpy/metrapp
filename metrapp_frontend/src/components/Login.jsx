import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div>
      <h2>Iniciar sesión</h2>
      {/* Formulario vendrá después */}
      <p>¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
    </div>
  );
}
