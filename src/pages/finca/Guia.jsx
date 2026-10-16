import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Vacio } from "@/components/ui/Pagina";
import { guia as buscarGuia, CATEGORIAS_GUIA } from "@/datos/guias";

export default function Guia({ base = "/finca/guias" }) {
  const { guiaId } = useParams();
  const g = buscarGuia(guiaId);
  useEffect(() => {
    if (g) document.title = `${g.titulo} · Coffee+Visión`;
  }, [g]);
  if (!g) return <Vacio titulo="No encontramos esa guía" accion={<Link to={base} className="boton-primario">Ver las guías</Link>} />;
  return (
    <article className="mx-auto max-w-3xl">
      <Link to={base} className="boton-fantasma -ml-3 mb-3">
        <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Guías
      </Link>
      <p className="rotulo">{CATEGORIAS_GUIA.find((c) => c.id === g.categoria)?.nombre}</p>
      <h1 className="titular mt-2 text-[2.4rem] sm:text-[3rem]">{g.titulo}</h1>
      <p className="mt-3 text-xl text-tierra-media">{g.resumen}</p>
      <div className="mt-8 grid gap-8">
        {g.secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="titular text-[1.6rem]">{s.titulo}</h2>
            <ul className="mt-3 grid gap-3">
              {s.puntos.map((p) => (
                <li key={p} className="flex gap-3 text-[1.0625rem] leading-relaxed">
                  <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cereza" aria-hidden="true" />
                  <span className="max-w-[68ch]">{p}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <aside className="mt-10 rounded-2xl border border-linea bg-papel p-5">
        <h2 className="font-bold">Fuentes</h2>
        <ul className="mt-2 grid gap-2">
          {g.fuentes.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1.5 text-[0.95rem] text-tierra-media underline underline-offset-2 hover:text-tierra">
                <ExternalLink className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> {f.texto}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-tierra-media">Esta guía resume con palabras propias lo publicado por Cenicafé y la FNC. No reemplaza la visita del extensionista: ante la duda, consulte al Comité de Cafeteros.</p>
      </aside>
    </article>
  );
}
