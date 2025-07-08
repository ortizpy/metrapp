import React, { useEffect, useState } from "react";

export default function VerInstrumentos() {
  const [instrumentos, setInstrumentos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://metrapp.onrender.com/instrumentos/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los instrumentos");
        return res.json();
      })
      .then((data) => setInstrumentos(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Instrumentos Registrados</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {instrumentos.length === 0 ? (
        <p>No hay instrumentos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Serie</th>
              <th>Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {instrumentos.map((inst) => (
              <tr key={inst.id}>
                <td>{inst.nombre}</td>
                <td>{inst.tipo}</td>
                <td>{inst.serie}</td>
                <td>{inst.fecha_registro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
