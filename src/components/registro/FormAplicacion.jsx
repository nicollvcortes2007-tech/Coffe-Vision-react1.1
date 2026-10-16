import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, Fichas, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { SelectorLote, CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { MOTIVOS_APLICACION } from "@/datos/agronomia";
import { ultimo } from "@/datos/calculos";
import { cop, fLarga, hoyISO, sumarDias } from "@/utilidades/formato";

/*
  Registro de aplicaciones con los campos de la BPA del ICA (Res. 30021 de 2017,
  num. 10.1.2): producto, ingrediente activo, registro ICA, dosis, carencia y
  quién recomendó y quién aplicó. La carencia genera el aviso «no cosechar hasta».
*/
export default function FormAplicacion({ opciones, alTerminar }) {
  const { lotes, aplicaciones } = useMiFinca();
  const avisos = useAvisos();
  const previa = ultimo(aplicaciones);
  const [form, setForm] = useState({
    loteId: opciones.loteId ?? "",
    fecha: hoyISO(),
    motivo: opciones.motivo ?? "nutricion",
    producto: "",
    ingredienteActivo: "",
    registroIca: "",
    dosis: "",
    unidad: "kg",
    costo: "",
    carenciaDias: "",
    reingresoHoras: "",
    recomendo: previa?.recomendo ?? "",
    aplico: previa?.aplico ?? "",
  });
  const cambiar = (campo) => (valor) => setForm((actual) => ({ ...actual, [campo]: valor }));
  const carencia = aNumero(form.carenciaDias) || 0;
  const esQuimico = form.motivo !== "nutricion";

  const guardar = (evento) => {
    evento.preventDefault();
    crear(
      "aplicaciones",
      {
        loteId: form.loteId,
        fecha: form.fecha,
        motivo: form.motivo,
        producto: form.producto.trim(),
        ingredienteActivo: form.ingredienteActivo.trim(),
        registroIca: form.registroIca.trim(),
        dosis: aNumero(form.dosis) || null,
        unidad: form.unidad,
        costo: aNumero(form.costo) || 0,
        carenciaDias: carencia,
        reingresoHoras: aNumero(form.reingresoHoras) || 0,
        recomendo: form.recomendo.trim(),
        aplico: form.aplico.trim(),
      },
      "apl",
    );
    const lote = lotes.find((l) => l.id === form.loteId);
    avisos.registrado("Aplicación registrada", carencia ? `${lote?.nombre}: no cosechar hasta el ${fLarga(sumarDias(form.fecha, carencia))}` : lote?.nombre);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <SelectorLote lotes={lotes} valor={form.loteId} alCambiar={cambiar("loteId")} />
      <Fichas etiqueta="¿Para qué?" opciones={MOTIVOS_APLICACION} valor={form.motivo} alCambiar={cambiar("motivo")} />
      <CampoFecha valor={form.fecha} alCambiar={cambiar("fecha")} />
      <Campo etiqueta="Producto (nombre comercial)">
        {(props) => <input {...props} className="campo" required value={form.producto} onChange={(evento) => cambiar("producto")(evento.target.value)} placeholder={esQuimico ? "Como aparece en la etiqueta" : "Ej. 17-6-18-2"} />}
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta={esQuimico ? "Ingrediente activo" : "Grado o composición"} opcional>
          {(props) => <input {...props} className="campo" value={form.ingredienteActivo} onChange={(evento) => cambiar("ingredienteActivo")(evento.target.value)} />}
        </Campo>
        <Campo etiqueta="Registro ICA" opcional={!esQuimico} ayuda="Está en la etiqueta.">
          {(props) => <input {...props} className="campo" value={form.registroIca} onChange={(evento) => cambiar("registroIca")(evento.target.value)} />}
        </Campo>
      </div>
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <Campo etiqueta="Dosis total aplicada">{(props) => <CampoNumero {...props} valor={form.dosis} alCambiar={cambiar("dosis")} />}</Campo>
        <Campo etiqueta="Unidad">
          {(props) => (
            <select {...props} className="campo" value={form.unidad} onChange={(evento) => cambiar("unidad")(evento.target.value)}>
              {["kg", "g", "L", "mL", "bultos"].map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          )}
        </Campo>
      </div>
      <Campo etiqueta="Costo del producto">{(props) => <CampoNumero {...props} prefijo="$" valor={form.costo} alCambiar={cambiar("costo")} />}</Campo>
      {esQuimico && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Período de carencia" ayuda="Días que hay que esperar para cosechar. En la etiqueta.">
            {(props) => <CampoNumero {...props} sufijo="días" valor={form.carenciaDias} alCambiar={cambiar("carenciaDias")} />}
          </Campo>
          <Campo etiqueta="Reingreso al lote" opcional ayuda="Horas antes de volver a entrar sin protección.">
            {(props) => <CampoNumero {...props} sufijo="horas" valor={form.reingresoHoras} alCambiar={cambiar("reingresoHoras")} />}
          </Campo>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="¿Quién lo recomendó?" opcional>
          {(props) => <input {...props} className="campo" value={form.recomendo} onChange={(evento) => cambiar("recomendo")(evento.target.value)} />}
        </Campo>
        <Campo etiqueta="¿Quién aplicó?" opcional>
          {(props) => <input {...props} className="campo" value={form.aplico} onChange={(evento) => cambiar("aplico")(evento.target.value)} />}
        </Campo>
      </div>
      {carencia > 0 && (
        <p className="flex gap-2 rounded-md bg-cereza-tenue px-4 py-3 font-bold text-cereza-honda">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          No cosechar este lote hasta el {fLarga(sumarDias(form.fecha, carencia))}.
        </p>
      )}
      <p className="text-sm text-grafito">
        Son los datos que pide la Res. ICA 30021 de 2017 para el registro de aplicaciones (Buenas Prácticas Agrícolas). Costo: {cop(aNumero(form.costo) || 0)}.
      </p>
      <Pie texto="Guardar aplicación" deshabilitado={!form.loteId || !form.producto.trim()} />
    </form>
  );
}
