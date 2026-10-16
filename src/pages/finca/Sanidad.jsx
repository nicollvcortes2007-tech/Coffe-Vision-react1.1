import { Link } from "react-router-dom";
import { ScanSearch } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Estado from "@/components/ui/Estado";
import Barras from "@/components/ui/Barras";
import { useRegistro } from "@/components/registro/ContextoRegistro";
import { Broca, Roya } from "@/components/marca/Pictogramas";
import { useFinca } from "@/datos/useFinca";
import { evaluarBroca, evaluarRoya, FUENTES, esSusceptible } from "@/datos/agronomia";
import { fCorta, hace } from "@/utilidades/formato";

function historial(muestreos, loteId, tipo) {
  return muestreos
    .filter((m) => m.loteId === loteId && m.tipo === tipo)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((m) => ({ fecha: m.fecha, valor: tipo === "broca" ? evaluarBroca(m).infestacion : evaluarRoya(m).incidencia, evaluacion: tipo === "broca" ? evaluarBroca(m) : evaluarRoya(m) }));
}

function Tabla({ lotes, muestreos, tipo, alMuestrear }) {
  const umbral = tipo === "broca" ? 2 : 5;
  return (
    <ul className="grid gap-3">
      {lotes.map((lote) => {
        const serie = historial(muestreos, lote.id, tipo);
        const ultimo = serie.at(-1);
        const nivel = ultimo ? (ultimo.evaluacion.nivel === "ok" ? "ok" : ultimo.evaluacion.nivel) : "sinDatos";
        return (
          <li key={lote.id} className="rounded-2xl border border-linea bg-papel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link to={`/finca/lotes/${lote.id}`} className="titular text-xl hover:underline">
                  {lote.nombre}
                </Link>
                <p className="text-sm text-tierra-media">
                  {ultimo ? `Último muestreo ${hace(ultimo.fecha)} (${fCorta(ultimo.fecha)})` : "Sin muestreos"}
                  {tipo === "roya" && esSusceptible(lote) ? " · variedad susceptible" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {ultimo && <span className="cifra text-2xl font-bold">{ultimo.valor.toFixed(1)} %</span>}
                <Estado tipo={nivel} pequeno />
              </div>
            </div>
            {serie.length > 1 && (
              <div className="mt-3">
                <Barras
                  titulo={`Historial de ${tipo} en ${lote.nombre}`}
                  datos={serie.slice(-8).map((p) => ({ etiqueta: fCorta(p.fecha), valor: Number(p.valor.toFixed(1)) }))}
                  formato={(v) => `${v}`}
                  umbral={umbral}
                  etiquetaUmbral={`${umbral} %`}
                  alto={110}
                  color={tipo === "broca" ? "#7FA36B" : "#8C7A68"}
                />
              </div>
            )}
            {ultimo && ultimo.evaluacion.nivel !== "ok" && <p className="mt-2 text-[0.95rem]">{ultimo.evaluacion.recomendacion}</p>}
            <button type="button" className="boton-secundario mt-3 w-full sm:w-auto" onClick={() => alMuestrear(lote.id)}>
              Nuevo muestreo de {tipo}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sanidad() {
  const { lotes, muestreos } = useFinca({ conClima: false });
  const { abrir } = useRegistro();
  const productivos = lotes.filter((lote) => lote.etapa.id !== "levante");

  return (
    <>
      <EncabezadoPagina
        rotulo="Sanidad"
        titulo="Broca y roya"
        bajada="Muestreos con el método de Cenicafé y un semáforo por lote. La decisión de aplicar sale de aquí, no de la foto."
        acciones={
          <Link to="/finca/diagnostico" className="boton-secundario">
            <ScanSearch className="h-5 w-5" aria-hidden="true" /> Diagnóstico por foto
          </Link>
        }
      />
      {!productivos.length ? (
        <Vacio titulo="No hay lotes en producción" texto="Los muestreos se hacen en lotes con fruto." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Seccion
            titulo={
              <span className="flex items-center gap-2">
                <Broca className="h-7 w-7 text-cereza" /> Broca
              </span>
            }
            bajada="30 árboles por lote, la rama más cargada. Umbral de acción: 2 %; daño económico: 5 %. Se aplica solo si más de la mitad de las brocas está en A o B."
          >
            <Tabla lotes={productivos} muestreos={muestreos} tipo="broca" alMuestrear={(loteId) => abrir("muestreo-broca", { loteId })} />
            <a href={FUENTES.broca.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-tierra-media underline">
              Fuente: {FUENTES.broca.texto}
            </a>
          </Seccion>
          <Seccion
            titulo={
              <span className="flex items-center gap-2">
                <Roya className="h-7 w-7 text-cereza" /> Roya
              </span>
            }
            bajada="10 árboles × 10 ramas. Sobre el 5 % de hojas con roya se recomienda aplicación preventiva, sin importar la variedad. En variedades susceptibles, primera aplicación a los 60 días de la floración."
          >
            <Tabla lotes={productivos} muestreos={muestreos} tipo="roya" alMuestrear={(loteId) => abrir("muestreo-roya", { loteId })} />
            <a href={FUENTES.roya.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-tierra-media underline">
              Fuente: {FUENTES.roya.texto}
            </a>
          </Seccion>
        </div>
      )}
    </>
  );
}
