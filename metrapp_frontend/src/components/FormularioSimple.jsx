import React, { useState } from "react";

export default function FormularioSimple() {
  const [formData, setFormData] = useState({ nombre: "", apellido: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Formulario de Prueba</h2>
      <input
        id="nombre"
        name="nombre"
        className="input-field mb-4"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <input
        id="apellido"
        name="apellido"
        className="input-field"
        value={formData.apellido}
        onChange={handleChange}
        placeholder="Apellido"
      />
    </div>
  );
}
