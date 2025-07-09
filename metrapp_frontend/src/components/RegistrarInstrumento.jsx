import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002776]">Registrar Instrumento</h1>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">
          ← Volver al Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ... todas las secciones del formulario como ya tenías ... */}
      </form>
    </div>
  );
}
