import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAvisos } from "@/components/ui/Avisos";
import { Contador } from "@/components/ui/Numero";
import { SelectorLote, CampoFecha, Pie, Resultado } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { evaluarRoya, FUENTES } from "@/datos/agronomia";
import { hoyISO, num } from "@/utilidades/formato";

const ARBOLES = 10;

export default function FormMuestreoRoya({ opciones, alTerminar }) {
  const { lotes } = useMiFinca();
  const avisos = useAvisos();
  const [loteId, setLoteId] = useState(opciones.loteId ?? "");
  const [fecha, setFecha] = useState(hoyISO());
  const [arboles, setArboles] = useState(() => Array.from({ length: ARBOLES }, () => ({ hojas: 0, conRoya: 0 })));
  const [actual, setActual] = useState(0);

  const contados = arboles.filter((a) => a.hojas > 0);
  const resultado = useMemo(() => evaluarRoya({ arboles: contados }), [contados]);
  const listo = loteId && contados.length > 0;

  const cambiar = (campo) => (valor) =>
    setArboles((lista) =>
      lista.map((arbol, i) => {
        if (i !== actual) return arbol;
        const nuevo = { ...arbol, [campo]: valor };
        if (nuevo.conRoya > nuevo.hojas) nuevo.conRoya = nuevo.hojas;
        return nuevo;
      }),
    );

  const guardar = (evento) => {
    evento.preventDefault();
    if (!listo) return;
    crear("muestreos", { loteId, fecha, tipo: "roya", arboles: contados }, "mue");
    const lote = lotes.find((l) => l.id === loteId);
    avisos.registrado("Muestreo de roya guardado", `${lote?.nombre}: ${num(resultado.incidencia)} % de hojas con roya`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <SelectorLote lotes={lotes} valor={loteId} alCambiar={setLoteId} />
      <CampoFecha valor={fecha} alCambiar={setFecha} />
      <p className="rounded-md bg-cal px-4 py-3 text-[0.95rem]">
        Elige <strong>10 árboles al azar</strong> en todo el lote. En cada uno revisa <strong>10 ramas</strong> de la zona productiva y cuenta las hojas y las que tienen polvillo naranja por el envés.
      </p>
      <div className="grid gap-4 rounded-lg border border-linea p-4">
        <div className="flex items-center justify-between">
          <button type="button" className="boton-fantasma h-12 w-12 px-0" disabled={actual === 0} onClick={() => setActual((i) => i - 1)} aria-label="Árbol anterior">
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <p className="text-center">
            <span className="titular block text-3xl">Árbol {actual + 1}</span>
            <span className="text-sm text-grafito">{contados.length} de 10 contados</span>
          </p>
          <button type="button" className="boton-fantasma h-12 w-12 px-0" disabled={actual === ARBOLES - 1} onClick={() => setActual((i) => i + 1)} aria-label="Árbol siguiente">
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Contador etiqueta="Hojas revisadas (10 ramas)" valor={arboles[actual].hojas} alCambiar={cambiar("hojas")} maximo={800} paso={5} />
        <Contador etiqueta="Hojas con roya" valor={arboles[actual].conRoya} alCambiar={cambiar("conRoya")} maximo={800} tono="cereza" />
        <button type="button" className="boton-primario" disabled={actual === ARBOLES - 1} onClick={() => setActual((i) => Math.min(ARBOLES - 1, i + 1))}>
          Siguiente árbol <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {contados.length > 0 && (
        <Resultado
          nivel={resultado.nivel}
          titulo={resultado.aplicar ? "Supera el 5 %" : "Por debajo del 5 %"}
          cifra={`${num(resultado.incidencia)} %`}
          texto={resultado.recomendacion}
          fuente={FUENTES.roya}
        />
      )}
      <Pie texto="Guardar muestreo" deshabilitado={!listo} />
    </form>
  );
}
