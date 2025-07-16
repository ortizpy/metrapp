import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

// 🔻 Mover fuera del componente principal
const Seccion = ({ titulo, children }) => (
  <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm mb-6">
    <legend className="text-lg font-semibold text-[#002776] px-2">{titulo}</legend>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </fieldset>
);

const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="font-medium">
    {children} {required && <span className="text-[#002776] font-bold">*</span>}
  </label>
);

// 🔻 Datos y estado inicial
const CLASIFICACIONES = [
  { value: "PN", label: "Patrón Nacional" },
  { value: "PR", label: "Patrón de Referencia" },
  { value: "PT", label: "Patrón de Trabajo" },
  { value: "EA", label: "Equipo Auxiliar" },
];

const LABORATORIOS = [
  "LPR", "LFU", "LLO", "LMA", "LCB",
  "LVD", "LTE", "LEL", "LTF", "LMQ"
];

const FUENTES = ["TESORO", "PROYECTO", "COOPERACION", "OTRO"];
const GARANTIA = ["SI", "NO"];

const initialState = {
  codigo_unico: "",
  nombre_tecnico: "",
  marca_modelo: "",
  numero_serie: "",
  clasificacion_metrologica: "PN",
  laboratorio_responsable: "LPR",
  peso_neto: "",
  peso_bruto: "",
  dimensiones: "",
  fecha_adquisicion: "",
  costo_adquisicion: "",
  llamado_contrato: "",
  proveedor: "",
  fuente_financiacion: "TESORO",
  fuente_otro: "",
  garantia_vigente: "",
  fecha_vencimiento_garantia: "",
  fecha_calibracion_inicial: "",
  ultima_fecha_calibracion: "",
  calibrado_por: "",
  numero_certificado_calibracion: "",
  patron_asociado: "",
  intervalo_calibracion: "",
  intervalo_verificacion: "",
  parametro_verificado: "",
  tolerancia_permitida: "",
  criterio_aceptacion: "",
  observaciones_verificacion: "",
  certificado_calibracion: null,
  ficha_tecnica: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "CAMBIAR_CAMPO":
      return { ...state, [action.name]: action.value };
    case "CAMBIAR_ARCHIVO":
      return { ...state, [action.name]: action.file };
    case "RESETEAR":
      return initialState;
    default:
      return state;
  }
}

export default function RegistrarInstrumento() {
  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [archivos, setArchivos] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      dispatch({ type: "CAMBIAR_ARCHIVO", name, file: files[0] });
    } else {
      dispatch({ type: "CAMBIAR_CAMPO", name, value });
    }
  };

  const handleFileChange = e => setArchivos([...e.target.files]);

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    archivos.forEach(file => data.append("archivo", file));

    try {
      await axios.post("/api/instrumentos/", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("✅ Instrumento registrado correctamente");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al registrar el instrumento");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002776]">Registrar Instrumento</h1>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">
          ← Volver al Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Registrar Instrumento</h2>

        <Seccion titulo="1) Identificación del Equipo">
          <div>
            <Label htmlFor="codigo_unico" required>Código Único</Label>
            <input
              type="text"
              id="codigo_unico"
              name="codigo_unico"
              value={formData.codigo_unico}
              onChange={handleChange}
              placeholder="Ej.: EQ-MAS-001"
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="nombre_tecnico" required>Nombre Técnico</Label>
            <input
              type="text"
              id="nombre_tecnico"
              name="nombre_tecnico"
              value={formData.nombre_tecnico}
              onChange={handleChange}
              placeholder="Ej.: Comparador de masas"
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="marca_modelo" required>Marca / Modelo</Label>
            <input
              type="text"
              id="marca_modelo"
              name="marca_modelo"
              value={formData.marca_modelo}
              onChange={handleChange}
              placeholder="Ej.: Mettler Toledo XP56"
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="numero_serie" required>Número de Serie</Label>
            <input
              type="text"
              id="numero_serie"
              name="numero_serie"
              value={formData.numero_serie}
              onChange={handleChange}
              placeholder="Ej.: SN12345678"
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="clasificacion_metrologica" required>Clasificación Metrológica</Label>
            <select
              id="clasificacion_metrologica"
              name="clasificacion_metrologica"
              value={formData.clasificacion_metrologica}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Seleccione una opción</option>
              {CLASIFICACIONES.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="laboratorio_responsable" required>Laboratorio Responsable</Label>
            <select
              id="laboratorio_responsable"
              name="laboratorio_responsable"
              value={formData.laboratorio_responsable}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Seleccione una opción</option>
              {LABORATORIOS.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="peso_neto">Peso Neto (kg)</Label>
            <input
              type="number"
              step="any"
              id="peso_neto"
              name="peso_neto"
              value={formData.peso_neto}
              onChange={handleChange}
              placeholder="Ej.: 1.25"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
            <input
              type="number"
              step="any"
              id="peso_bruto"
              name="peso_bruto"
              value={formData.peso_bruto}
              onChange={handleChange}
              placeholder="Ej.: 2.10"
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="dimensiones">Dimensiones (Largo × Ancho × Alto)</Label>
            <input
              type="text"
              id="dimensiones"
              name="dimensiones"
              value={formData.dimensiones}
              onChange={handleChange}
              placeholder="Ej.: 0.50 × 0.40 × 0.30"
              className="input-field"
            />
          </div>
        </Seccion>
      </form>
    </div>
  );
}
