import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SendHorizontal, Mic, ExternalLink } from "lucide-react";
import { EncabezadoPagina } from "@/components/ui/Pagina";
import { Isotipo } from "@/components/marca/Marca";
import { useFinca } from "@/datos/useFinca";
import { responder, SUGERENCIAS } from "@/datos/asistente";

const Reconocimiento = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

function Respuesta({ r }) {
  return (
    <div className="grid gap-2">
      <p className="leading-relaxed">{r.texto}</p>
      {r.lineas?.length > 0 && (
        <ul className="grid gap-1">
          {r.lineas.map((linea) => (
            <li key={linea} className="flex gap-2 text-[0.95rem]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cereza" aria-hidden="true" />
              {linea}
            </li>
          ))}
        </ul>
      )}
      {(r.enlaces?.length > 0 || r.fuente) && (
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {r.enlaces?.map((e) =>
            e.a.startsWith("http") ? (
              <a key={e.a} href={e.a} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-cereza underline">
                {e.texto} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <Link key={e.a} to={e.a} className="font-bold text-cereza underline">
                {e.texto}
              </Link>
            ),
          )}
          {r.fuente && (
            <a href={r.fuente.url} target="_blank" rel="noreferrer" className="text-grafito underline">
              Fuente: {r.fuente.texto}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Asistente() {
  const contexto = useFinca();
  const [parametros] = useSearchParams();
  const [mensajes, setMensajes] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const final = useRef(null);
  const inicial = useRef(parametros.get("p"));

  const preguntar = (texto) => {
    const limpia = texto.trim();
    if (!limpia) return;
    const r = responder(limpia, { ...contexto, clima: contexto.clima.datos?.clima });
    setMensajes((actuales) => [...actuales, { de: "yo", texto: limpia }, { de: "asistente", r }]);
    setPregunta("");
  };

  useEffect(() => {
    if (inicial.current) {
      preguntar(inicial.current);
      inicial.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    final.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes]);

  const dictar = () => {
    if (!Reconocimiento) return;
    const rec = new Reconocimiento();
    rec.lang = "es-CO";
    rec.interimResults = false;
    rec.onresult = (evento) => setPregunta(evento.results[0][0].transcript);
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => setEscuchando(false);
    setEscuchando(true);
    rec.start();
  };

  return (
    <>
      <EncabezadoPagina rotulo="Asistente" titulo="Pregúntale a tu finca" bajada="Responde con tus propios registros y las guías, sin internet. No es una inteligencia artificial que inventa: si no sabe, te lo dice." />
      <section className="placa flex min-h-[60dvh] flex-col overflow-hidden" aria-label="Conversación">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {!mensajes.length && (
            <div className="grid place-items-center gap-4 py-8 text-center">
              <Isotipo className="h-14 w-14" />
              <p className="max-w-md text-grafito">Prueba con alguna de estas preguntas:</p>
              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {SUGERENCIAS.map((s) => (
                  <button key={s} type="button" onClick={() => preguntar(s)} className="min-h-11 rounded-full border border-linea bg-cal px-4 text-[0.95rem] font-bold hover:border-tinta">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ol className="grid gap-4">
            {mensajes.map((m, i) => (
              <li key={i} className={m.de === "yo" ? "ml-auto max-w-[85%] rounded-lg rounded-br-md bg-tinta px-4 py-3 text-niebla" : "mr-auto flex max-w-[92%] gap-3"}>
                {m.de === "yo" ? (
                  m.texto
                ) : (
                  <>
                    <Isotipo className="mt-1 h-8 w-8 shrink-0" />
                    <div className="rounded-lg rounded-tl-md border border-linea bg-cal px-4 py-3">
                      <Respuesta r={m.r} />
                      {m.r.sugerencias && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.r.sugerencias.map((s) => (
                            <button key={s} type="button" onClick={() => preguntar(s)} className="min-h-10 rounded-full border border-linea bg-lamina px-3 text-sm font-bold">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
          <div ref={final} />
        </div>
        <form
          className="flex items-end gap-2 border-t border-linea bg-lamina p-3 sm:p-4"
          onSubmit={(evento) => {
            evento.preventDefault();
            preguntar(pregunta);
          }}
        >
          <label htmlFor="pregunta" className="sr-only">
            Tu pregunta
          </label>
          <input id="pregunta" className="campo min-h-13 flex-1" autoComplete="off" placeholder="Ej. ¿Cuánto gasté en abono en La Loma?" value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
          {Reconocimiento && (
            <button type="button" onClick={dictar} className={`boton-secundario h-12 w-12 px-0 ${escuchando ? "border-cereza text-cereza" : ""}`} aria-label="Dictar la pregunta (necesita señal)" aria-pressed={escuchando}>
              <Mic className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <button type="submit" className="boton-primario h-12 w-12 px-0" aria-label="Preguntar" disabled={!pregunta.trim()}>
            <SendHorizontal className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      </section>
    </>
  );
}
