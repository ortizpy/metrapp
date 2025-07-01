import { useState } from "react";

export default function RegistroUsuario() {
    const [formData, setFormData] = useState({
        email: '',
        nombre: '',
        rol: 'TECNICO',
        password: '',
        password2: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://metrapp.onrender.com/usuarios/registro/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include' // Para enviar cookies de sesión
        });

        if (response.ok) {
            alert('Usuario registrado correctamente');
            setFormData({ email: '', nombre: '', rol: 'TECNICO', password: '', password2: '' });
        } else {
            const data = await response.json();
            alert('Error: ' + JSON.stringify(data));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro de Usuario</h2>
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
            <select name="rol" value={formData.rol} onChange={handleChange}>
                <option value="ADMIN">Admin</option>
                <option value="JEFE">Jefe</option>
                <option value="TECNICO">Técnico</option>
            </select>
            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
            <input type="password" name="password2" placeholder="Confirmar contraseña" value={formData.password2} onChange={handleChange} required />
            <button type="submit">Registrar</button>
        </form>
    );
}
