import { useState } from "react";
import { UserPlus } from "lucide-react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { SelectorLote, CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { aCps, aArrobas, PAGO_RECOLECCION_REFERENCIA, FUENTES, FACTOR_CEREZA_CPS } from "@/datos/agronomia";
import { ultimo } from "@/datos/calculos";
import { cop, num, hoyISO } from "@/utilidades/formato";

export default function FormRecoleccion({ opciones, alTerminar }) {
  const { finca, lotes, recolecciones, trabajadores } = useMiFinca();
  const avisos = useAvisos();
  const previa = ultimo(recolecciones);
  const [loteId, setLoteId] = useState(opciones.loteId ?? previa?.loteId ?? "");
  const [fecha, setFecha] = useState(hoyISO());
  const [recolector, setRecolector] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const [kg, setKg] = useState("");
  const [pagoKg, setPagoKg] = useState(String(previa?.pagoKg ?? PAGO_RECOLECCION_REFERENCIA[1]));
  const [verdes, setVerdes] = useState("");
  const [guardados, setGuardados] = useState([]);

  const lote = lotes.find((l) => l.id === loteId);
  const kgCereza = aNumero(kg) || 0;
  const pago = aNumero(pagoKg) || 0;
  const factor = lote?.factorCps || FACTOR_CEREZA_CPS;
  const listo = loteId && kgCereza > 0 && recolector.trim();

  const guardarUno = () => {
    const nombre = recolector.trim();
    if (nuevo && !trabajadores.some((t) => t.nombre.toLowerCase() === nombre.toLowerCase())) {
      crear("trabajadores", { fincaId: finca.id, nombre }, "tra");
    }
    crear("recolecciones", { loteId, fecha, recolector: nombre, kgCereza, pagoKg: pago, verdesPct: aNumero(verdes) || null }, "rec");
    setGuardados((lista) => [...lista, { nombre, kg: kgCereza }]);
  };

  const guardar = (evento) => {
    evento.preventDefault();
    if (!listo) return;
    guardarUno();
    const total = guardados.reduce((s, g) => s + g.kg, 0) + kgCereza;
    avisos.registrado("Recolección guardada", `${lote?.nombre}: ${num(total)} kg de cereza`);
    alTerminar();
  };

  const guardarYOtro = () => {
    if (!listo) return;
    guardarUno();
    setRecolector("");
    setNuevo(false);
    setKg("");
    setVerdes("");
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <SelectorLote lotes={lotes} valor={loteId} alCambiar={setLoteId} />
      <CampoFecha valor={fecha} alCambiar={setFecha} />
      {nuevo || !trabajadores.length ? (
        <Campo etiqueta="Nombre del recolector">
          {(props) => <input {...props} className="campo" value={recolector} onChange={(evento) => setRecolector(evento.target.value)} placeholder="Ej. Don Ernesto" autoComplete="off" />}
        </Campo>
      ) : (
        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-[0.95rem] font-bold">Recolector</legend>
          <div className="flex flex-wrap gap-2">
            {trabajadores.map((t) => (
              <button key={t.id} type="button" aria-pressed={recolector === t.nombre} onClick={() => setRecolector(t.nombre)} className={`min-h-12 rounded-xl border px-3.5 font-bold ${recolector === t.nombre ? "border-tierra bg-tierra text-papel" : "border-borde-campo bg-papel"}`}>
                {t.nombre}
              </button>
            ))}
            <button type="button" onClick={() => { setNuevo(true); setRecolector(""); }} className="flex min-h-12 items-center gap-2 rounded-xl border border-dashed border-borde-campo px-3.5 font-bold text-tierra-media">
              <UserPlus className="h-5 w-5" aria-hidden="true" /> Otro
            </button>
          </div>
        </fieldset>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Kilos de cereza">{(props) => <CampoNumero {...props} sufijo="kg" valor={kg} alCambiar={setKg} className="[&_input]:text-2xl [&_input]:font-bold" />}</Campo>
        <Campo etiqueta="Pago por kilo" ayuda={`En 2025 se pagaba entre ${cop(PAGO_RECOLECCION_REFERENCIA[0])} y ${cop(PAGO_RECOLECCION_REFERENCIA[1])}.`}>
          {(props) => <CampoNumero {...props} prefijo="$" valor={pagoKg} alCambiar={setPagoKg} />}
        </Campo>
      </div>
      <Campo etiqueta="Verdes en la muestra" opcional ayuda="Con el Mediverdes: una buena recolección tiene menos de 2,5 % de verdes.">
        {(props) => <CampoNumero {...props} sufijo="%" valor={verdes} alCambiar={setVerdes} />}
      </Campo>
      {kgCereza > 0 && (
        <p className="rounded-xl bg-pergamino px-4 py-3 text-[0.95rem]">
          ≈ <strong className="cifra">{num(aCps(kgCereza, factor))} kg</strong> de pergamino seco ({num(aArrobas(aCps(kgCereza, factor)))} @) · pago{" "}
          <strong className="cifra">{cop(kgCereza * pago)}</strong>
          <a href={FUENTES.conversion.url} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-tierra-media underline">
            Factor {num(factor)} kg de c.p.s. por kg de cereza (Cenicafé)
          </a>
        </p>
      )}
      {guardados.length > 0 && (
        <p className="text-sm text-hoja" role="status">
          Ya guardados hoy: {guardados.map((g) => `${g.nombre} (${num(g.kg)} kg)`).join(", ")}
        </p>
      )}
      <Pie
        texto="Guardar y terminar"
        deshabilitado={!listo}
        secundario={
          <button type="button" className="boton-secundario w-full" disabled={!listo} onClick={guardarYOtro}>
            Guardar y anotar otro recolector
          </button>
        }
      />
    </form>
  );
}
