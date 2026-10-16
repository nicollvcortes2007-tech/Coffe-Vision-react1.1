import { useState } from "react";
import { History } from "lucide-react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, Contador, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { SelectorLote, CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { LABORES, labor } from "@/datos/agronomia";
import { ultimo } from "@/datos/calculos";
import { cop, hoyISO } from "@/utilidades/formato";

export default function FormLabor({ opciones, alTerminar }) {
  const { lotes, labores } = useMiFinca();
  const avisos = useAvisos();
  const previa = ultimo(labores);
  const [form, setForm] = useState({
    loteId: opciones.loteId ?? "",
    tipo: opciones.tipoLabor ?? "fertilizacion",
    fecha: hoyISO(),
    jornales: 1,
    valorJornal: String(previa?.valorJornal ?? 60000),
    costoInsumos: "",
    notas: "",
  });
  const cambiar = (campo) => (valor) => setForm((actual) => ({ ...actual, [campo]: valor }));
  const valorJornal = aNumero(form.valorJornal) || 0;
  const insumos = aNumero(form.costoInsumos) || 0;
  const total = form.jornales * valorJornal + insumos;

  const repetir = () => previa && setForm((actual) => ({ ...actual, loteId: previa.loteId, tipo: previa.tipo, jornales: previa.jornales, valorJornal: String(previa.valorJornal), notas: "" }));

  const guardar = (evento) => {
    evento.preventDefault();
    if (!form.loteId) return;
    crear("labores", { loteId: form.loteId, fecha: form.fecha, tipo: form.tipo, jornales: form.jornales, valorJornal, costoInsumos: insumos, notas: form.notas.trim() }, "lab");
    const lote = lotes.find((l) => l.id === form.loteId);
    avisos.registrado(`${labor(form.tipo).nombre} registrada`, `${lote?.nombre} · ${cop(total)}`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      {previa && (
        <button type="button" onClick={repetir} className="boton-secundario justify-start">
          <History className="h-5 w-5" aria-hidden="true" /> Repetir la última: {labor(previa.tipo).nombre}
        </button>
      )}
      <SelectorLote lotes={lotes} valor={form.loteId} alCambiar={cambiar("loteId")} />
      <Campo etiqueta="Labor">
        {(props) => (
          <select {...props} className="campo" value={form.tipo} onChange={(evento) => cambiar("tipo")(evento.target.value)}>
            {LABORES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        )}
      </Campo>
      <CampoFecha valor={form.fecha} alCambiar={cambiar("fecha")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Contador etiqueta="Jornales" valor={form.jornales} alCambiar={cambiar("jornales")} minimo={0} maximo={500} />
        <Campo etiqueta="Valor del jornal">{(props) => <CampoNumero {...props} prefijo="$" valor={form.valorJornal} alCambiar={cambiar("valorJornal")} />}</Campo>
      </div>
      <Campo etiqueta="Costo de insumos" opcional ayuda="Si usaste abono o producto, mejor regístralo como «Aplicación».">
        {(props) => <CampoNumero {...props} prefijo="$" valor={form.costoInsumos} alCambiar={cambiar("costoInsumos")} />}
      </Campo>
      <Campo etiqueta="Notas" opcional>
        {(props) => <textarea {...props} rows={2} className="campo py-3" value={form.notas} onChange={(evento) => cambiar("notas")(evento.target.value)} />}
      </Campo>
      <p className="rounded-xl bg-pergamino px-4 py-3 font-bold">
        Costo de la labor: <span className="cifra">{cop(total)}</span>
      </p>
      <Pie texto="Guardar labor" deshabilitado={!form.loteId} />
    </form>
  );
}

