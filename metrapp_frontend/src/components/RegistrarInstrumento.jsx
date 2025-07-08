import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CLASIFICACIONES = ["PN", "PR", "PT", "EA"];
const LABORATORIOS = ["LPR", "LFU", "LLO", "LMA", "LCB", "LVD", "LTE", "LEL", "LTF", "LMQ"];
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002776]">Registrar Instrumento</h1>
        <button onClick={() => navigate("/dashboard")} className="text-sm px-4 py-2 bg-[#d52b1e] text-white rounded hover:bg-red-700 transition">
          ← Volver al Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        <Seccion titulo="1) Identificación del Equipo">
          {["codigo_unico", "nombre_tecnico", "marca_modelo", "numero_serie", "peso_neto", "peso_bruto", "dimensiones"].map(campo => (
            <input key={campo} name={campo} value={formData[campo]} onChange={handleChange}
              placeholder={campo.replaceAll("_", " ")} className="input-field" />
          ))}
          <select name="clasificacion_metrologica" value={formData.clasificacion_metrologica} onChange={handleChange} className="input-field">
            {CLASIFICACIONES.map(op => <option key={op}>{op}</option>)}
          </select>
          <select name="laboratorio_responsable" value={formData.laboratorio_responsable} onChange={handleChange} className="input-field">
            {LABORATORIOS.map(op => <option key={op}>{op}</option>)}
          </select>
        </Seccion>

        <Seccion titulo="2) Adquisición y Patrimonio">
          <input type="date" name="fecha_adquisicion" value={formData.fecha_adquisicion} onChange={handleChange} className="input-field" />
          {["costo_adquisicion", "llamado_contrato", "proveedor"].map(c => (
            <input key={c} name={c} value={formData[c]} onChange={handleChange} placeholder={c.replaceAll("_", " ")} className="input-field" />
          ))}
          <select name="fuente_financiacion" value={formData.fuente_financiacion} onChange={handleChange} className="input-field">
            {FUENTES.map(op => <option key={op}>{op}</option>)}
          </select>
          {formData.fuente_financiacion === "OTRO" && (
            <input name="fuente_otro" value={formData.fuente_otro} onChange={handleChange} placeholder="Especificar fuente" className="input-field" />
          )}
          <div className="flex items-center gap-4">
            <label className="font-medium">¿Garantía vigente?</label>
            {GARANTIA.map(val => (
              <label key={val} className="inline-flex items-center gap-1">
                <input type="radio" name="garantia_vigente" value={val} checked={formData.garantia_vigente === val} onChange={handleChange} />
                {val}
              </label>
            ))}
          </div>
          {formData.garantia_vigente === "SI" && (
            <input type="date" name="fecha_vencimiento_garantia" value={formData.fecha_vencimiento_garantia} onChange={handleChange} className="input-field" />
          )}
        </Seccion>

        <Seccion titulo="3) Calibración Inicial">
          {["fecha_calibracion_inicial", "ultima_fecha_calibracion"].map(f => (
            <input key={f} type="date" name={f} value={formData[f]} onChange={handleChange} className="input-field" />
          ))}
          {["calibrado_por", "numero_certificado_calibracion", "patron_asociado", "intervalo_calibracion"].map(c => (
            <input key={c} name={c} value={formData[c]} onChange={handleChange} placeholder={c.replaceAll("_", " ")} className="input-field" />
          ))}
        </Seccion>

        <Seccion titulo="4) Verificación y Criterios de Aceptación">
          {["intervalo_verificacion", "parametro_verificado", "tolerancia_permitida", "criterio_aceptacion", "observaciones_verificacion"].map(c => (
            <input key={c} name={c} value={formData[c]} onChange={handleChange} placeholder={c.replaceAll("_", " ")} className="input-field" />
          ))}
        </Seccion>

        <Seccion titulo="Archivos PDF">
          <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="input-field" />
        </Seccion>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-[#002776] text-white rounded-lg hover:bg-blue-900 transition font-semibold">
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
}
