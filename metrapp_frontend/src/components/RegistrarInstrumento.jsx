import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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

const FUENTES = ["INSTITUCIONAL", "PROYECTO", "COOPERACION", "OTRO"];
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
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

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
    
    if (!window.confirm("¿Estás seguro de registrar este instrumento?")) return;

    const nuevosErrores = {};
    if (formData.garantia_vigente === "SI" && !formData.fecha_vencimiento_garantia) {
      nuevosErrores.fecha_vencimiento_garantia = "Debes completar la fecha de vencimiento de la garantía si está vigente.";
    }
    if (formData.fuente_financiacion === "OTRO" && !formData.fuente_otro) {
      nuevosErrores.fuente_otro = "Debes especificar otra fuente de financiación.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error("⚠️ Por favor, corrige los errores antes de continuar.");
      return;
    }

    setErrores({});
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    archivos.forEach(file => data.append("archivo", file));

    try {
      await axios.post("https://metrapp.onrender.com/api/instrumentos/", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("✅ Instrumento registrado correctamente");
      dispatch({ type: "RESETEAR" });
      setArchivos([]);
      setTimeout(() => navigate("/dashboard"), 2500);
    
    } catch (error) {
      console.error("Detalles del error:", error.response?.data);
      toast.error("❌ Error al registrar el instrumento");
    } finally {
      setLoading(false);
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

        <Seccion titulo="2) Información de Adquisición">
          <div>
            <Label htmlFor="fecha_adquisicion" required>Fecha de Adquisición</Label>
            <input
              type="date"
              id="fecha_adquisicion"
              name="fecha_adquisicion"
              value={formData.fecha_adquisicion}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="costo_adquisicion">Costo de Adquisición (USD)</Label>
            <input
              type="number"
              step="any"
              id="costo_adquisicion"
              name="costo_adquisicion"
              value={formData.costo_adquisicion}
              onChange={handleChange}
              placeholder="Ej.: 1500.00"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="llamado_contrato">Llamado o Contrato</Label>
            <input
              type="text"
              id="llamado_contrato"
              name="llamado_contrato"
              value={formData.llamado_contrato}
              onChange={handleChange}
              placeholder="Ej.: ID 1234/2023"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <input
              type="text"
              id="proveedor"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              placeholder="Ej.: Instrumental S.A."
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="fuente_financiacion">Fuente de Financiación</Label>
            <select
              id="fuente_financiacion"
              name="fuente_financiacion"
              value={formData.fuente_financiacion}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccione una opción</option>
              {FUENTES.map(fuente => (
                <option key={fuente} value={fuente}>{fuente}</option>
              ))}
            </select>
          </div>

          {formData.fuente_financiacion === "OTRO" && (
            <div>
              <Label htmlFor="fuente_otro">Especifique otra fuente</Label>
              <input
                type="text"
                id="fuente_otro"
                name="fuente_otro"
                value={formData.fuente_otro}
                onChange={handleChange}
                placeholder="Ej.: Donación de XYZ"
                className="input-field"
              />
            </div>
          )}
        </Seccion>

        <Seccion titulo="3) Garantía y Calibración Inicial">
          <div>
            <Label htmlFor="garantia_vigente">¿Garantía vigente?</Label>
            <select
              id="garantia_vigente"
              name="garantia_vigente"
              value={formData.garantia_vigente}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccione una opción</option>
              {GARANTIA.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>

          {formData.garantia_vigente === "SI" && (
            <div>
              <Label htmlFor="fecha_vencimiento_garantia">Fecha de vencimiento de la garantía</Label>
              <input
                type="date"
                id="fecha_vencimiento_garantia"
                name="fecha_vencimiento_garantia"
                value={formData.fecha_vencimiento_garantia}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          )}

          <div>
            <Label htmlFor="fecha_calibracion_inicial">Fecha de Calibración Inicial</Label>
            <input
              type="date"
              id="fecha_calibracion_inicial"
              name="fecha_calibracion_inicial"
              value={formData.fecha_calibracion_inicial}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="ultima_fecha_calibracion">Última Fecha de Calibración</Label>
            <input
              type="date"
              id="ultima_fecha_calibracion"
              name="ultima_fecha_calibracion"
              value={formData.ultima_fecha_calibracion}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="calibrado_por">Calibrado por</Label>
            <input
              type="text"
              id="calibrado_por"
              name="calibrado_por"
              value={formData.calibrado_por}
              onChange={handleChange}
              placeholder="Ej.: INTN"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="numero_certificado_calibracion">N° de Certificado de Calibración</Label>
            <input
              type="text"
              id="numero_certificado_calibracion"
              name="numero_certificado_calibracion"
              value={formData.numero_certificado_calibracion}
              onChange={handleChange}
              placeholder="Ej.: 00123/2024"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="patron_asociado">Patrón Asociado</Label>
            <input
              type="text"
              id="patron_asociado"
              name="patron_asociado"
              value={formData.patron_asociado}
              onChange={handleChange}
              placeholder="Ej.: PN-MAS-001"
              className="input-field"
            />
          </div>
        </Seccion>

        <Seccion titulo="4) Verificación y Criterios de Aceptación">
          <div>
            <Label htmlFor="intervalo_verificacion">Intervalo de Verificación Intermedia (en meses)</Label>
            <input
              type="number"
              id="intervalo_verificacion"
              name="intervalo_verificacion"
              value={formData.intervalo_verificacion}
              onChange={handleChange}
              placeholder="Ej.: 6"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="parametro_verificado">Parámetro Verificado</Label>
            <input
              type="text"
              id="parametro_verificado"
              name="parametro_verificado"
              value={formData.parametro_verificado}
              onChange={handleChange}
              placeholder="Ej.: Masa, temperatura, presión..."
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="tolerancia_permitida">Tolerancia Permitida</Label>
            <input
              type="text"
              id="tolerancia_permitida"
              name="tolerancia_permitida"
              value={formData.tolerancia_permitida}
              onChange={handleChange}
              placeholder="Ej.: ± 0.1 g"
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="criterio_aceptacion">Criterio de Aceptación</Label>
            <input
              type="text"
              id="criterio_aceptacion"
              name="criterio_aceptacion"
              value={formData.criterio_aceptacion}
              onChange={handleChange}
              placeholder="Ej.: La desviación no debe superar el 5% del valor nominal"
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="observaciones_verificacion">Observaciones</Label>
            <textarea
              id="observaciones_verificacion"
              name="observaciones_verificacion"
              value={formData.observaciones_verificacion}
              onChange={handleChange}
              rows={3}
              placeholder="Escriba observaciones adicionales si las hubiera..."
              className="input-field"
            />
          </div>
        </Seccion>

        <Seccion titulo="5) Archivos Adjuntos">
            <div>
              <Label htmlFor="certificado_calibracion">Certificado de Calibración</Label>
              <input
                type="file"
                id="certificado_calibracion"
                name="certificado_calibracion"
                accept=".pdf"
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <Label htmlFor="ficha_tecnica">Ficha Técnica</Label>
              <input
                type="file"
                id="ficha_tecnica"
                name="ficha_tecnica"
                accept=".pdf"
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="archivos">Archivos Adicionales (opcional)</Label>
              <input
                type="file"
                id="archivos"
                multiple
                onChange={handleFileChange}
                className="input-field"
              />
            </div>
        </Seccion>

        <div className="mt-6 text-right">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "💾 Guardar Instrumento"}
          </button>
        </div>

      </form>
    </div>
  );
}
