import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ListOrdered, Sigma } from "lucide-react";
import { useAvisos } from "@/components/ui/Avisos";
import { Contador } from "@/components/ui/Numero";
import { SelectorLote, CampoFecha, Pie, Resultado } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { evaluarBroca, FUENTES } from "@/datos/agronomia";
import { hoyISO, num } from "@/utilidades/formato";

const ARBOLES = 30;
const vacios = () => Array.from({ length: ARBOLES }, () => ({ frutos: 0, brocados: 0 }));

export default function FormMuestreoBroca({ opciones, alTerminar }) {
  const { lotes } = useMiFinca();
  const avisos = useAvisos();
  const [loteId, setLoteId] = useState(opciones.loteId ?? "");
  const [fecha, setFecha] = useState(hoyISO());
  const [modo, setModo] = useState("arbol");
  const [arboles, setArboles] = useState(vacios);
  const [actual, setActual] = useState(0);
  const [totales, setTotales] = useState({ frutos: 0, brocados: 0 });
  const [conPosiciones, setConPosiciones] = useState(false);
  const [posiciones, setPosiciones] = useState({ A: 0, B: 0, C: 0, D: 0 });

  const muestreo = useMemo(() => {
    const lista = modo === "arbol" ? arboles.filter((a) => a.frutos > 0) : [{ frutos: totales.frutos, brocados: totales.brocados }];
    return { arboles: lista, posiciones: conPosiciones ? posiciones : null };
  }, [modo, arboles, totales, conPosiciones, posiciones]);
  const resultado = evaluarBroca(muestreo);
  const contados = modo === "arbol" ? arboles.filter((a) => a.frutos > 0).length : ARBOLES;
  const listo = loteId && resultado.frutos > 0;

  const cambiarArbol = (campo) => (valor) =>
    setArboles((lista) =>
      lista.map((arbol, i) => {
        if (i !== actual) return arbol;
        const nuevo = { ...arbol, [campo]: valor };
        if (nuevo.brocados > nuevo.frutos) nuevo.brocados = nuevo.frutos;
        return nuevo;
      }),
    );

  const guardar = (evento) => {
    evento.preventDefault();
    if (!listo) return;
    crear("muestreos", { loteId, fecha, tipo: "broca", arboles: muestreo.arboles, posiciones: muestreo.posiciones }, "mue");
    const lote = lotes.find((l) => l.id === loteId);
    avisos.registrado("Muestreo de broca guardado", `${lote?.nombre}: ${num(resultado.infestacion)} % de frutos brocados`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <SelectorLote lotes={lotes} valor={loteId} alCambiar={setLoteId} />
      <CampoFecha valor={fecha} alCambiar={setFecha} />
      <p className="rounded-md bg-cal px-4 py-3 text-[0.95rem]">
        Recorre el lote en zigzag. En cada uno de los <strong>30 árboles</strong>, toma la rama más cargada (30 a 100 frutos) y cuenta los frutos y los brocados (con el huequito en la corona).
      </p>

      <div role="radiogroup" aria-label="Cómo contar" className="grid grid-cols-2 gap-2 rounded-lg bg-cal-honda/70 p-1">
        {[
          ["arbol", "Árbol por árbol", ListOrdered],
          ["totales", "Solo los totales", Sigma],
        ].map(([id, texto, Icono]) => (
          <button key={id} type="button" role="radio" aria-checked={modo === id} onClick={() => setModo(id)} className={`flex min-h-12 items-center justify-center gap-2 rounded-md font-bold ${modo === id ? "bg-lamina shadow-placa" : "text-grafito"}`}>
            <Icono className="h-5 w-5" aria-hidden="true" /> {texto}
          </button>
        ))}
      </div>

      {modo === "arbol" ? (
        <div className="grid gap-4 rounded-lg border border-linea p-4">
          <div className="flex items-center justify-between">
            <button type="button" className="boton-fantasma h-12 w-12 px-0" disabled={actual === 0} onClick={() => setActual((i) => i - 1)} aria-label="Árbol anterior">
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <p className="text-center">
              <span className="titular block text-3xl">Árbol {actual + 1}</span>
              <span className="text-sm text-grafito">{contados} de 30 contados</span>
            </p>
            <button type="button" className="boton-fantasma h-12 w-12 px-0" disabled={actual === ARBOLES - 1} onClick={() => setActual((i) => i + 1)} aria-label="Árbol siguiente">
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Contador etiqueta="Frutos en la rama" valor={arboles[actual].frutos} alCambiar={cambiarArbol("frutos")} maximo={300} />
          <Contador etiqueta="Frutos brocados" valor={arboles[actual].brocados} alCambiar={cambiarArbol("brocados")} maximo={300} tono="cereza" />
          <button type="button" className="boton-primario" disabled={actual === ARBOLES - 1} onClick={() => setActual((i) => Math.min(ARBOLES - 1, i + 1))}>
            Siguiente árbol <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex flex-wrap gap-1" aria-label="Avance del muestreo">
            {arboles.map((arbol, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActual(i)}
                aria-label={`Ir al árbol ${i + 1}`}
                className={`h-3.5 w-3.5 rounded-full ${i === actual ? "ring-2 ring-tinta ring-offset-1" : ""} ${arbol.frutos ? (arbol.brocados ? "bg-cereza" : "bg-tinta") : "bg-cal-honda"}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Contador etiqueta="Frutos contados (30 ramas)" valor={totales.frutos} alCambiar={(v) => setTotales((t) => ({ ...t, frutos: v, brocados: Math.min(t.brocados, v) }))} maximo={9000} paso={10} />
          <Contador etiqueta="Frutos brocados" valor={totales.brocados} alCambiar={(v) => setTotales((t) => ({ ...t, brocados: Math.min(v, t.frutos) }))} maximo={9000} tono="cereza" />
        </div>
      )}

      <details className="rounded-lg border border-linea p-4" open={conPosiciones} onToggle={(evento) => setConPosiciones(evento.currentTarget.open)}>
        <summary className="cursor-pointer font-bold">Posiciones de la broca (si superas el 2 %)</summary>
        <p className="mt-2 text-sm text-grafito">Abre 100 frutos brocados y cuenta dónde está la broca. Los productos solo sirven si está en A o B.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Contador etiqueta="A: iniciando a perforar" valor={posiciones.A} alCambiar={(v) => setPosiciones((p) => ({ ...p, A: v }))} maximo={100} />
          <Contador etiqueta="B: en el canal" valor={posiciones.B} alCambiar={(v) => setPosiciones((p) => ({ ...p, B: v }))} maximo={100} />
          <Contador etiqueta="C: dentro de la almendra" valor={posiciones.C} alCambiar={(v) => setPosiciones((p) => ({ ...p, C: v }))} maximo={100} />
          <Contador etiqueta="D: con descendencia" valor={posiciones.D} alCambiar={(v) => setPosiciones((p) => ({ ...p, D: v }))} maximo={100} />
        </div>
      </details>

      {resultado.frutos > 0 && (
        <Resultado
          nivel={resultado.nivel}
          titulo={resultado.nivel === "ok" ? "Por debajo del umbral" : resultado.aplicar ? "Momento de controlar" : resultado.infestacion >= 5 ? "Nivel de daño económico" : "Sobre el umbral del 2 %"}
          cifra={`${num(resultado.infestacion)} %`}
          texto={`${resultado.brocados} brocados de ${resultado.frutos} frutos${resultado.pctAB !== null ? ` · ${Math.round(resultado.pctAB)} % en A+B` : ""}. ${resultado.recomendacion}`}
          fuente={FUENTES.broca}
        />
      )}
      <Pie texto="Guardar muestreo" deshabilitado={!listo} />
    </form>
  );
}
