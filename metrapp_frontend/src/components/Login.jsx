import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función auxiliar para obtener la cookie CSRF
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Inicializar CSRF cookie al cargar el componente
  useEffect(() => {
    fetch('https://metrapp.onrender.com/api/init-csrf/', {
      credentials: 'include'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = getCookie('csrftoken');

    const response = await fetch('https://metrapp.onrender.com/usuarios/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      navigate('/dashboard');
    } else {
      setError('Correo o contraseña inválidos');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿No tenés cuenta? <a href="/registro">Registrate</a></p>
    </div>
  );
}
