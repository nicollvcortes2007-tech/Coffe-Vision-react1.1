import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { EncabezadoPagina, Vacio } from "@/components/ui/Pagina";
import { GUIAS, CATEGORIAS_GUIA } from "@/datos/guias";
import { buscarGuias } from "@/utilidades/buscar";

export default function Guias({ base = "/finca/guias" }) {
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const resultados = consulta.trim() ? buscarGuias(GUIAS, consulta).map((r) => r.guia) : GUIAS;
  const lista = resultados.filter((g) => categoria === "todas" || g.categoria === categoria);

  return (
    <>
      <EncabezadoPagina rotulo="Aprender" titulo="Guías de campo" bajada="Cortas, sin señal y con la fuente de Cenicafé o la FNC en cada una." />
      <div className="mb-6 grid gap-3">
        <label className="relative block">
          <span className="sr-only">Buscar en las guías</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-grafito" aria-hidden="true" />
          <input type="search" className="campo min-h-14 pl-12 text-lg" placeholder="Busca: roya, abonar, factor de rendimiento…" value={consulta} onChange={(e) => setConsulta(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
          {[{ id: "todas", nombre: "Todas" }, ...CATEGORIAS_GUIA].map((c) => (
            <button key={c.id} type="button" aria-pressed={categoria === c.id} onClick={() => setCategoria(c.id)} className={`min-h-11 rounded-full border px-4 font-bold ${categoria === c.id ? "border-tinta bg-tinta text-niebla" : "border-linea bg-lamina text-grafito hover:text-tinta"}`}>
              {c.nombre}
            </button>
          ))}
        </div>
      </div>
      {lista.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((g) => (
            <li key={g.id}>
              <Link to={`${base}/${g.id}`} className="placa group flex h-full flex-col p-5 transition-colors hover:border-tinta">
                <span className="rotulo">{CATEGORIAS_GUIA.find((c) => c.id === g.categoria)?.nombre}</span>
                <span className="titular mt-2 text-[1.45rem]">{g.titulo}</span>
                <span className="mt-2 flex-1 text-[0.95rem] text-grafito">{g.resumen}</span>
                <span className="mt-4 inline-flex items-center gap-1 font-bold text-cereza">
                  Leer <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Vacio
          Icono={Search}
          titulo="No encontramos esa guía"
          texto="Prueba con otra palabra o pregúntale al asistente. Para preguntas generales, AdrIAna de Cenicafé responde en línea."
          accion={
            <Link to={`/finca/asistente?p=${encodeURIComponent(consulta)}`} className="boton-secundario">
              Preguntar al asistente
            </Link>
          }
        />
      )}
    </>
  );
}
