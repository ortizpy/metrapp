import React, { useState } from "react";
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

export default function RegistrarInstrumento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo_unico: "", nombre_tecnico: "", marca_modelo: "", numero_serie: "",
    clasificacion_metrologica: "PN", laboratorio_responsable: "LPR",
    peso_neto: "", peso_bruto: "", dimensiones: "",
    fecha_adquisicion: "", costo_adquisicion: "", llamado_contrato: "", proveedor: "",
    fuente_financiacion: "TESORO", fuente_otro: "", garantia_vigente: "NO", fecha_vencimiento_garantia: "",
    fecha_calibracion_inicial: "", ultima_fecha_calibracion: "", calibrado_por: "",
    numero_certificado_calibracion: "", patron_asociado: "", intervalo_calibracion: "",
    intervalo_verificacion: "", parametro_verificado: "", tolerancia_permitida: "",
    criterio_aceptacion: "", observaciones_verificacion: "",
  });

  const [archivos, setArchivos] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

        <Seccion titulo="1) Identificación del Equipo">
          <div>
            <Label htmlFor="codigo_unico" required>Código Único</Label>
            <input name="codigo_unico" value={formData.codigo_unico} onChange={handleChange} className="input-field" placeholder="Ej.: EQ-MAS-001" required />
          </div>
          <div>
            <Label htmlFor="nombre_tecnico" required>Nombre Técnico</Label>
            <input name="nombre_tecnico" value={formData.nombre_tecnico} onChange={handleChange} className="input-field" placeholder="Ej.: Comparador de masas" required />
          </div>
          <div>
            <Label htmlFor="marca_modelo" required>Marca / Modelo</Label>
            <input name="marca_modelo" value={formData.marca_modelo} onChange={handleChange} className="input-field" placeholder="Ej.: Mettler Toledo XP56" required />
          </div>
          <div>
            <Label htmlFor="numero_serie" required>Número de Serie</Label>
            <input name="numero_serie" value={formData.numero_serie} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <Label htmlFor="clasificacion_metrologica" required>Clasificación Metrológica</Label>
            <select name="clasificacion_metrologica" value={formData.clasificacion_metrologica} onChange={handleChange} className="input-field">
              {CLASIFICACIONES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="laboratorio_responsable" required>Laboratorio Responsable</Label>
            <select name="laboratorio_responsable" value={formData.laboratorio_responsable} onChange={handleChange} className="input-field">
              {LABORATORIOS.map(op => <option key={op}>{op}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="peso_neto">Peso Neto (kg)</Label>
            <input name="peso_neto" value={formData.peso_neto} onChange={handleChange} className="input-field" placeholder="Ej.: 1.25" />
          </div>
          <div>
            <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
            <input name="peso_bruto" value={formData.peso_bruto} onChange={handleChange} className="input-field" placeholder="Ej.: 2.10" />
          </div>
          <div>
            <Label htmlFor="dimensiones">Dimensiones (Largo × Ancho × Alto)</Label>
            <input name="dimensiones" value={formData.dimensiones} onChange={handleChange} className="input-field" placeholder="Ej.: 0.50 x 0.40 x 0.30" />
          </div>
        </Seccion>

        {/* Las demás secciones siguen el mismo patrón, con labels descriptivos y placeholders bien redactados... */}

        <Seccion titulo="5) Archivos PDF">
          <div>
            <Label htmlFor="archivos">Subir certificados en PDF</Label>
            <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="input-field" />
          </div>
        </Seccion>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Registrar</button>
        </div>
      </form>
    </div>
  );
}
