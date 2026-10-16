import { useState } from "react";
import { useAvisos } from "@/components/ui/Avisos";
import { Fichas } from "@/components/ui/Numero";
import { CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { DIAS, INTENSIDADES, esSusceptible, FUENTES } from "@/datos/agronomia";
import { fLarga, hoyISO, sumarDias } from "@/utilidades/formato";

export default function FormFloracion({ opciones, alTerminar }) {
  const { lotes } = useMiFinca();
  const avisos = useAvisos();
  const [loteIds, setLoteIds] = useState(opciones.loteId ? [opciones.loteId] : lotes.map((lote) => lote.id));
  const [fecha, setFecha] = useState(hoyISO());
  const [intensidad, setIntensidad] = useState("buena");
  const [principal, setPrincipal] = useState(true);
  const haySusceptibles = lotes.some((lote) => loteIds.includes(lote.id) && esSusceptible(lote));

  const guardar = (evento) => {
    evento.preventDefault();
    for (const loteId of loteIds) crear("floraciones", { loteId, fecha, intensidad, principal }, "flo");
    avisos.registrado("Floración registrada", `${loteIds.length} ${loteIds.length === 1 ? "lote" : "lotes"} · cosecha hacia el ${fLarga(sumarDias(fecha, DIAS.cosecha))}`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <Fichas etiqueta="¿En qué lotes floreció?" multiple opciones={lotes.map((lote) => ({ id: lote.id, nombre: lote.nombre }))} valor={loteIds} alCambiar={setLoteIds} />
      <CampoFecha valor={fecha} alCambiar={setFecha} etiqueta="Día en que abrió la flor" />
      <Fichas etiqueta="¿Cómo fue?" opciones={INTENSIDADES} valor={intensidad} alCambiar={setIntensidad} />
      <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-linea bg-cal px-4">
        <input type="checkbox" className="h-5 w-5 accent-cereza" checked={principal} onChange={(evento) => setPrincipal(evento.target.checked)} />
        <span>
          <span className="font-bold">Es la floración principal</span>
          <span className="block text-sm text-grafito">La que da la cosecha grande. Con ella se calcula el calendario.</span>
        </span>
      </label>

      <div className="rounded-lg border border-linea bg-lamina p-4">
        <p className="rotulo">Lo que viene</p>
        <ol className="mt-3 grid gap-2.5">
          {[
            haySusceptibles && [DIAS.royaPrimeraAplicacion, "Primera aplicación contra la roya (variedades susceptibles)"],
            [DIAS.muestreosRoya[0], "Primer muestreo de roya"],
            [DIAS.brocaCritico, "Empieza el período crítico de la broca: muestreo mensual"],
            [DIAS.cosecha, "Pico de la cosecha (unas 32 semanas)"],
          ]
            .filter(Boolean)
            .map(([dias, texto]) => (
              <li key={texto} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[0.95rem]">
                <span className="cifra font-bold">{fLarga(sumarDias(fecha, dias)).replace(/ de \d{4}$/, "")}</span>
                <span className="text-grafito">{texto}</span>
              </li>
            ))}
        </ol>
        <a href={FUENTES.fenologia.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-grafito underline">
          Fuente: Cenicafé
        </a>
      </div>
      <Pie texto="Guardar floración" deshabilitado={!loteIds.length} />
    </form>
  );
}
