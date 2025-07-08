import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarInstrumento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    serie: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://metrapp.onrender.com/instrumentos/nuevo/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Instrumento registrado correctamente.");
      navigate("/ver-instrumentos");
    } else {
      alert("Error al registrar el instrumento.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Instrumento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del instrumento"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tipo"
          placeholder="Tipo"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.tipo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="serie"
          placeholder="Número de serie"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.serie}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.descripcion}
          onChange={handleChange}
          rows="4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
