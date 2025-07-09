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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
       ...prev,
       [name]: value,
      }));
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
            <input id="codigo_unico" name="codigo_unico" value={formData.codigo_unico} onChange={handleChange} className="input-field" placeholder="Ej.: EQ-MAS-001" required />
          </div>
          <div>
            <Label htmlFor="nombre_tecnico" required>Nombre Técnico</Label>
            <input id="nombre_tecnico" name="nombre_tecnico" value={formData.nombre_tecnico} onChange={handleChange} className="input-field" placeholder="Ej.: Comparador de masas" required />
          </div>
          <div>
            <Label htmlFor="marca_modelo" required>Marca y Modelo</Label>
            <input id="marca_modelo" name="marca_modelo" value={formData.marca_modelo} onChange={handleChange} className="input-field" placeholder="Ej.: Mettler Toledo XP56" required />
          </div>
          <div>
            <Label htmlFor="numero_serie" required>Número de Serie</Label>
            <input id="numero_serie" name="numero_serie" value={formData.numero_serie} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <Label htmlFor="clasificacion_metrologica" required>Clasificación Metrológica</Label>
            <select id="clasificacion_metrologica" name="clasificacion_metrologica" value={formData.clasificacion_metrologica} onChange={handleChange} className="input-field">
              {CLASIFICACIONES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="laboratorio_responsable" required>Laboratorio Responsable</Label>
            <select id="laboratorio_responsable" name="laboratorio_responsable" value={formData.laboratorio_responsable} onChange={handleChange} className="input-field">
              {LABORATORIOS.map(op => <option key={op}>{op}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="peso_neto">Peso Neto (kg)</Label>
            <input id="peso_neto" name="peso_neto" value={formData.peso_neto} onChange={handleChange} className="input-field" placeholder="Ej.: 1.25" />
          </div>
          <div>
            <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
            <input id="peso_bruto" name="peso_bruto" value={formData.peso_bruto} onChange={handleChange} className="input-field" placeholder="Ej.: 2.10" />
          </div>
          <div>
            <Label htmlFor="dimensiones">Dimensiones (Largo × Ancho × Alto)</Label>
            <input id="dimensiones" name="dimensiones" value={formData.dimensiones} onChange={handleChange} className="input-field" placeholder="Ej.: 0.50 x 0.40 x 0.30" />
          </div>
        </Seccion>

        <Seccion titulo="2) Adquisición y Patrimonio">
          <div>
            <Label htmlFor="fecha_adquisicion" required>Fecha de Adquisición</Label>
            <input type="date" id="fecha_adquisicion" name="fecha_adquisicion" value={formData.fecha_adquisicion} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <Label htmlFor="costo_adquisicion">Costo de Adquisición (₲)</Label>
            <input id="costo_adquisicion" name="costo_adquisicion" value={formData.costo_adquisicion} onChange={handleChange} className="input-field" placeholder="Ej.: 3500000" />
          </div>
          <div>
            <Label htmlFor="llamado_contrato">Llamado ID</Label>
            <input id="llamado_contrato" name="llamado_contrato" value={formData.llamado_contrato} onChange={handleChange} className="input-field" placeholder="Ej.: ID 398/2023" />
          </div>
          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <input id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} className="input-field" placeholder="Ej.: Metrología S.A." />
          </div>
          <div>
            <Label htmlFor="fuente_financiacion">Fuente de Financiación</Label>
            <select id="fuente_financiacion" name="fuente_financiacion" value={formData.fuente_financiacion} onChange={handleChange} className="input-field">
              {FUENTES.map(op => <option key={op}>{op}</option>)}
            </select>
          </div>
          {formData.fuente_financiacion === "OTRO" && (
            <div>
              <Label htmlFor="fuente_otro">Especifique otra fuente</Label>
              <input id="fuente_otro" name="fuente_otro" value={formData.fuente_otro} onChange={handleChange} className="input-field" placeholder="Ej.: Donación de empresa privada" />
            </div>
          )}
          <div className="md:col-span-2">
            <Label htmlFor="garantia_vigente" required>¿Garantía vigente?</Label>
            <div className="flex gap-6 mt-1">
              {GARANTIA.map(val => (
                <label key={val} className="inline-flex items-center gap-2">
                  <input type="radio" id="garantia_vigente" name="garantia_vigente" value={val} checked={formData.garantia_vigente === val} onChange={handleChange} />
                  {val}
                </label>
              ))}
            </div>
          </div>
          {formData.garantia_vigente === "SI" && (
            <div>
              <Label htmlFor="fecha_vencimiento_garantia" required>Fecha de Vencimiento de Garantía</Label>
              <input type="date" id="fecha_vencimiento_garantia" name="fecha_vencimiento_garantia" value={formData.fecha_vencimiento_garantia} onChange={handleChange} className="input-field" required />
            </div>
          )}
        </Seccion>

        <Seccion titulo="3) Calibración y Trazabilidad (Inicial)">
          <div>
            <Label htmlFor="fecha_calibracion_inicial">Fecha de Calibración Inicial</Label>
            <input type="date" id="fecha_calibracion_inicial" name="fecha_calibracion_inicial" value={formData.fecha_calibracion_inicial} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <Label htmlFor="ultima_fecha_calibracion">Última Fecha de Calibración</Label>
            <input type="date" id="ultima_fecha_calibracion" name="ultima_fecha_calibracion" value={formData.ultima_fecha_calibracion} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <Label htmlFor="calibrado_por">Calibrado por</Label>
            <input id="calibrado_por" name="calibrado_por" value={formData.calibrado_por} onChange={handleChange} className="input-field" placeholder="Ej.: INTN – LPR" />
          </div>
          <div>
            <Label htmlFor="numero_certificado_calibracion">N° de Certificado</Label>
            <input id="numero_certificado_calibracion" name="numero_certificado_calibracion" value={formData.numero_certificado_calibracion} onChange={handleChange} className="input-field" placeholder="Ej.: CERT-245/23" />
          </div>
          <div>
            <Label htmlFor="patron_asociado">Patrón Asociado</Label>
            <input id="patron_asociado" name="patron_asociado" value={formData.patron_asociado} onChange={handleChange} className="input-field" placeholder="Ej.: MASA-PN-001" />
          </div>
          <div>
            <Label htmlFor="intervalo_calibracion">Intervalo de Calibración (meses)</Label>
            <input type="number" id="intervalo_calibracion" name="intervalo_calibracion" value={formData.intervalo_calibracion} onChange={handleChange} className="input-field" placeholder="Ej.: 12" />
          </div>
        </Seccion>

        <Seccion titulo="4) Verificación y Criterios de Aceptación">
          <div>
            <Label htmlFor="intervalo_verificacion">Intervalo de Verificación Intermedia (meses)</Label>
            <input type="number" id="intervalo_verificacion" name="intervalo_verificacion" value={formData.intervalo_verificacion} onChange={handleChange} className="input-field" placeholder="Ej.: 6" />
          </div>
          <div>
            <Label htmlFor="parametro_verificado">Parámetro Verificado</Label>
            <input id="parametro_verificado" name="parametro_verificado" value={formData.parametro_verificado} onChange={handleChange} className="input-field" placeholder="Ej.: Masa nominal de 5 kg" />
          </div>
          <div>
            <Label htmlFor="tolerancia_permitida">Tolerancia Permitida</Label>
            <input id="tolerancia_permitida" name="tolerancia_permitida" value={formData.tolerancia_permitida} onChange={handleChange} className="input-field" placeholder="Ej.: ± 0,01 g" />
          </div>
          <div>
            <Label htmlFor="criterio_aceptacion">Criterio de Aceptación <span title="Debe estar documentado en procedimientos internos.">🛈</span></Label>
            <input id="criterio_aceptacion" name="criterio_aceptacion" value={formData.criterio_aceptacion} onChange={handleChange} className="input-field" placeholder="Ej.: Resultado dentro del 100 % del valor nominal" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="observaciones_verificacion">Observaciones</Label>
            <textarea id="observaciones_verificacion" name="observaciones_verificacion" value={formData.observaciones_verificacion} onChange={handleChange} className="input-field" rows={3} placeholder="Observaciones adicionales..." />
          </div>
        </Seccion>

        <Seccion titulo="5) Archivos PDF">
          <div>
            <Label htmlFor="archivos">Subir archivos en PDF</Label>
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
