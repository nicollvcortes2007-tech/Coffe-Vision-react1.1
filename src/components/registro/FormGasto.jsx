import { useState } from "react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { SelectorLote, CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { ACTIVIDADES } from "@/datos/agronomia";
import { cop, hoyISO } from "@/utilidades/formato";

export default function FormGasto({ opciones, alTerminar }) {
  const { finca, lotes } = useMiFinca();
  const avisos = useAvisos();
  const [fecha, setFecha] = useState(hoyISO());
  const [actividad, setActividad] = useState(opciones.actividad ?? "otras");
  const [descripcion, setDescripcion] = useState("");
  const [valor, setValor] = useState("");
  const [loteId, setLoteId] = useState(opciones.loteId ?? "");
  const monto = aNumero(valor) || 0;

  const guardar = (evento) => {
    evento.preventDefault();
    crear("gastos", { fincaId: finca.id, loteId: loteId || null, fecha, actividad, descripcion: descripcion.trim(), valor: monto }, "gas");
    avisos.registrado("Gasto registrado", `${descripcion.trim()} · ${cop(monto)}`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <CampoFecha valor={fecha} alCambiar={setFecha} />
      <Campo etiqueta="¿En qué se fue?">
        {(props) => <input {...props} className="campo" required value={descripcion} onChange={(evento) => setDescripcion(evento.target.value)} placeholder="Ej. Transporte del café a la cooperativa" />}
      </Campo>
      <Campo etiqueta="Valor">{(props) => <CampoNumero {...props} prefijo="$" valor={valor} alCambiar={setValor} className="[&_input]:text-2xl [&_input]:font-bold" />}</Campo>
      <Campo etiqueta="Tipo de gasto" ayuda="Son las mismas categorías del costo de producción de la FNC.">
        {(props) => (
          <select {...props} className="campo" value={actividad} onChange={(evento) => setActividad(evento.target.value)}>
            {ACTIVIDADES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        )}
      </Campo>
      <SelectorLote lotes={lotes} valor={loteId} alCambiar={setLoteId} permitirFinca etiqueta="Lote" />
      <Pie texto="Guardar gasto" deshabilitado={!(monto > 0) || !descripcion.trim()} />
    </form>
  );
}
