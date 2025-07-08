import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLASIFICACIONES = ["PN", "PR", "PT", "EA"];
const LABORATORIOS = ["LPR", "LFU", "LLO", "LMA", "LCB", "LVD", "LTE", "LEL", "LTF", "LMQ"];
const FUENTES = ["TESORO", "PROYECTO", "COOPERACION", "OTRO"];
const GARANTIA = ["SI", "NO"];

export default function RegistrarInstrumento() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Sección 1
    codigo_unico: "", nombre_tecnico: "", marca_modelo: "", numero_serie: "",
    clasificacion_metrologica: "PN", laboratorio_responsable: "LPR",
    peso_neto: "", peso_bruto: "", dimensiones: "",

    // Sección 2
    fecha_adquisicion: "", costo_adquisicion: "", llamado_contrato: "", proveedor: "",
    fuente_financiacion: "TESORO", fuente_otro: "", garantia_vigente: "NO", fecha_vencimiento_garantia: "",

    // Sección 3
    fecha_calibracion_inicial: "", ultima_fecha_calibracion: "", calibrado_por: "",
    numero_certificado_calibracion: "", patron_asociado: "", intervalo_calibracion: "",

    // Sección 4
    intervalo_verificacion: "", parametro_verificado: "", tolerancia_permitida: "",
    criterio_aceptacion: "", observaciones_verificacion: "",
  });

  const [archivos, setArchivos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setArchivos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    archivos.forEach((file) => data.append("archivo", file));

    try {
      await axios.post("/api/instrumentos/", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Instrumento registrado correctamente.");
      navigate("/ver-instrumentos");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el instrumento.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Registrar Instrumento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">1) Identificación</h2>
        {["codigo_unico", "nombre_tecnico", "marca_modelo", "numero_serie"].map((campo) => (
          <input key={campo} name={campo} value={formData[campo]} onChange={handleChange}
            placeholder={campo.replace("_", " ")} required className="w-full p-2 border rounded" />
        ))}

        <select name="clasificacion_metrologica" value={formData.clasificacion_metrologica} onChange={handleChange} className="w-full p-2 border rounded">
          {CLASIFICACIONES.map(op => <option key={op}>{op}</option>)}
        </select>
        <select name="laboratorio_responsable" value={formData.laboratorio_responsable} onChange={handleChange} className="w-full p-2 border rounded">
          {LABORATORIOS.map(op => <option key={op}>{op}</option>)}
        </select>

        {["peso_neto", "peso_bruto", "dimensiones"].map(campo => (
          <input key={campo} name={campo} value={formData[campo]} onChange={handleChange}
            placeholder={campo.replace("_", " ")} className="w-full p-2 border rounded" />
        ))}

        <h2 className="text-lg font-semibold">2) Adquisición</h2>
        <input type="date" name="fecha_adquisicion" value={formData.fecha_adquisicion} onChange={handleChange} className="w-full p-2 border rounded" />
        {["costo_adquisicion", "llamado_contrato", "proveedor"].map(campo => (
          <input key={campo} name={campo} value={formData[campo]} onChange={handleChange}
            placeholder={campo.replace("_", " ")} className="w-full p-2 border rounded" />
        ))}

        <select name="fuente_financiacion" value={formData.fuente_financiacion} onChange={handleChange} className="w-full p-2 border rounded">
          {FUENTES.map(op => <option key={op}>{op}</option>)}
        </select>

        {formData.fuente_financiacion === "OTRO" && (
          <input name="fuente_otro" value={formData.fuente_otro} onChange={handleChange} placeholder="Especificar otra fuente"
            className="w-full p-2 border rounded" />
        )}

        <label className="block mt-2">¿Garantía vigente?</label>
        {GARANTIA.map((val) => (
          <label key={val} className="inline-flex items-center mr-4">
            <input type="radio" name="garantia_vigente" value={val} checked={formData.garantia_vigente === val} onChange={handleChange} />
            <span className="ml-1">{val}</span>
          </label>
        ))}

        {formData.garantia_vigente === "SI" && (
          <input type="date" name="fecha_vencimiento_garantia" value={formData.fecha_vencimiento_garantia} onChange={handleChange}
            className="w-full p-2 border rounded" />
        )}

        <h2 className="text-lg font-semibold">3) Calibración Inicial</h2>
        {["fecha_calibracion_inicial", "ultima_fecha_calibracion"].map(f =>
          <input key={f} type="date" name={f} value={formData[f]} onChange={handleChange} className="w-full p-2 border rounded" />
        )}
        {["calibrado_por", "numero_certificado_calibracion", "patron_asociado", "intervalo_calibracion"].map(c =>
          <input key={c} name={c} value={formData[c]} onChange={handleChange} placeholder={c.replace("_", " ")} className="w-full p-2 border rounded" />
        )}

        <h2 className="text-lg font-semibold">4) Verificación</h2>
        {["intervalo_verificacion", "parametro_verificado", "tolerancia_permitida", "criterio_aceptacion", "observaciones_verificacion"].map(c =>
          <input key={c} name={c} value={formData[c]} onChange={handleChange} placeholder={c.replace("_", " ")} className="w-full p-2 border rounded" />
        )}

        <h2 className="text-lg font-semibold">Archivos PDF</h2>
        <input type="file" multiple accept="application/pdf" onChange={handleFileChange} className="w-full p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Registrar</button>
      </form>
    </div>
  );
}
