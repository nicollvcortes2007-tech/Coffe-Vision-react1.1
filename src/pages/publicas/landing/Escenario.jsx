import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { CAPAS, RELIEVE_DEMO, EXTENSION_DEMO } from "./fincaDemo";
import { gms } from "@/components/finca3d/coordenadas";
import { FUENTES } from "@/datos/agronomia";
import { num, ent, fCorta } from "@/utilidades/formato";

const Finca3D = lazy(() => import("@/components/finca3d/Finca3D"));

const SENAL = { actuar: "bg-cereza-viva", vigilar: "bg-amarillo rayado", ok: "bg-niebla", sinDatos: "bg-ceniza" };

const esEscritorio = () => typeof window === "undefined" || window.innerWidth >= 1024;

/* Encuadre de la escena según la pantalla: en escritorio los capítulos van a la izquierda. */
function encuadre(portada) {
  if (esEscritorio()) return portada ? [0.17, -0.1] : [0.2, -0.02];
  return portada ? [0, 0.06] : [0, 0.19];
}

function capitulosDe(demo) {
  const peorBroca = demo.lotes.filter((l) => l.broca).sort((a, b) => b.broca.infestacion - a.broca.infestacion)[0];
  const peorRoya = demo.lotes.filter((l) => l.roya).sort((a, b) => b.roya.incidencia - a.roya.incidencia)[0];
  const conFlor = demo.lotes.filter((l) => l.floracion).sort((a, b) => b.floracion.dias - a.floracion.dias)[0];
  const area = demo.lotes.reduce((s, l) => s + (l.areaHa || 0), 0);
  const arboles = demo.lotes.reduce((s, l) => s + (l.arboles || 0), 0);
  return [
    {
      id: "lotes",
      capa: "estado",
      lote: "finca",
      rotulo: "01 · Lotes",
      titulo: "Cada lote, en su loma.",
      texto: "Caminas el borde del lote con el celular y queda dibujado sobre el relieve real: área, altitud, pendiente y hacia dónde mira. Si no hay tiempo, basta un punto.",
      datos: [
        ["Lotes", ent(demo.lotes.length)],
        ["Área", `${num(area)} ha`],
        ["Árboles", ent(arboles)],
      ],
    },
    peorBroca && {
      id: "broca",
      capa: "broca",
      lote: peorBroca.id,
      rotulo: "02 · Broca",
      titulo: "La broca, árbol por árbol.",
      texto: "Treinta árboles, frutos y brocados de cada uno. Sobre el 2 % abres cien frutos y miras dónde va la broca: si la mayoría sigue en A o B, todavía se alcanza a controlar.",
      datos: [
        [peorBroca.nombre, `${num(peorBroca.broca.infestacion)} %`],
        ["En A o B", peorBroca.broca.pctAB === null ? "—" : `${ent(peorBroca.broca.pctAB)} %`],
        ["Decisión", peorBroca.broca.aplicar ? "Controlar" : peorBroca.broca.infestacion >= 2 ? "Vigilar" : "No aplicar"],
      ],
      nota: peorBroca.broca.recomendacion,
      fuente: FUENTES.brocaUmbrales,
    },
    peorRoya && {
      id: "roya",
      capa: "roya",
      lote: peorRoya.id,
      rotulo: "03 · Roya",
      titulo: "La roya, hoja por hoja.",
      texto: "Diez árboles, diez ramas: cuentas las hojas con roya. Y volteas la hoja, porque el polvillo amarillo está por debajo, en el envés.",
      datos: [
        [peorRoya.nombre, `${num(peorRoya.roya.incidencia)} %`],
        ["Variedad", peorRoya.variedadNombre],
        ["Umbral", "5 %"],
      ],
      nota: peorRoya.roya.recomendacion,
      fuente: FUENTES.roya,
    },
    conFlor && {
      id: "cosecha",
      capa: "estado",
      lote: conFlor.id,
      rotulo: "04 · Cosecha",
      titulo: "La cosecha, contada desde la flor.",
      texto: "Anotas la floración y el calendario sale solo: a los 120 días empieza el período crítico de la broca y unas 32 semanas después llega la cosecha.",
      datos: [
        ["Floración", fCorta(conFlor.floracion.fecha)],
        ["Van", `${ent(conFlor.floracion.dias)} días`],
        ["Cosecha", fCorta(conFlor.floracion.cosecha)],
      ],
      fuente: FUENTES.fenologia,
    },
  ].filter(Boolean);
}

/*
  Portada y recorrido: la finca de ejemplo en 3D queda fija detrás mientras bajan los
  capítulos. El titular va detrás del relieve (la loma lo tapa); la luz rasante se
  mueve con el scroll como un amanecer; la leyenda es también el menú de capas.
*/
export default function Escenario({ demo }) {
  const seccion = useRef(null);
  const escena = useRef(null);
  const pasos = useRef([]);
  const portada = useRef(null);
  const [capa, setCapa] = useState("estado");
  const [activo, setActivo] = useState(-1);
  const capitulos = useMemo(() => capitulosDe(demo), [demo]);
  const capaActual = CAPAS.find((c) => c.id === capa) ?? CAPAS[0];
  const lotes = useMemo(() => demo.lotes.map((l) => ({ ...l, estado: capaActual.pintar(l) })), [demo, capaActual]);
  const coordenadas = gms(demo.finca.lat, demo.finca.lon);
  const [escritorio] = useState(esEscritorio);

  // Capítulo visible → capa, lote enfocado y encuadre.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) if (entrada.isIntersecting) setActivo(Number(entrada.target.dataset.indice));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    [portada.current, ...pasos.current].forEach((paso) => paso && observador.observe(paso));
    return () => observador.disconnect();
  }, [capitulos]);

  useEffect(() => {
    const api = escena.current;
    const capitulo = capitulos[activo];
    if (capitulo) setCapa(capitulo.capa);
    if (!api) return;
    if (capitulo?.lote === "finca") api.enfocarFinca();
    else api.enfocarLote(capitulo?.lote ?? null);
    api.encuadrar(...encuadre(!capitulo));
  }, [activo, capitulos]);

  // Luz rasante que barre la finca mientras se baja (un amanecer).
  useEffect(() => {
    let cuadro = 0;
    const mover = () => {
      cuadro = 0;
      const nodo = seccion.current;
      if (!nodo || !escena.current) return;
      const caja = nodo.getBoundingClientRect();
      const avance = Math.min(1, Math.max(0, -caja.top / Math.max(1, caja.height - window.innerHeight)));
      escena.current.ponerLuz(0.35 + avance * 2.3);
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(mover);
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  const alListo = (api) => {
    escena.current = api;
    const capitulo = capitulos[activo];
    api.encuadrar(...encuadre(!capitulo), true);
    if (capitulo?.lote === "finca") api.enfocarFinca(0);
    else if (capitulo?.lote) api.enfocarLote(capitulo.lote, 0);
    api.ponerLuz(0.35);
  };

  return (
    <section ref={seccion} className="reticula relative bg-basalto" aria-label="La finca de ejemplo en 3D">
      {/* Escenario fijo: el relieve real con sus lotes */}
      <div className="sticky top-0 z-10 h-[100svh] overflow-hidden">
        <Suspense fallback={null}>
          <Finca3D
            finca={demo.finca}
            lotes={lotes}
            relieveHorneado={RELIEVE_DEMO}
            extension={EXTENSION_DEMO}
            className="h-full w-full"
            lecturaEnVivo
            bloqueoTactil
            zoomRueda={false}
            alListo={alListo}
            distancia={escritorio ? 1.22 : 1.8}
            mostrarEtiquetas={escritorio || activo >= 0}
            clase2d={escritorio ? "absolute right-[12%] bottom-[9%] aspect-square h-[60%] w-auto rounded-full" : "absolute inset-x-0 top-[30%] mx-auto aspect-square h-auto w-[84%] rounded-full"}
            controlesVisibles={escritorio}
            lecturaClase="hidden lg:inline-flex right-8 top-[4.75rem]"
            controlesClase="right-4 bottom-12 lg:right-8"
            fichaClase="inset-x-4 bottom-12 sm:left-auto sm:right-20 sm:w-72 lg:right-24"
          />
        </Suspense>

        {/* Leyenda = menú de capas */}
        <div className="absolute right-[5.5rem] bottom-12 hidden w-56 lg:right-[6.5rem] lg:block">
          <div className="rounded-[var(--radius-placa)] bg-basalto/90 p-3 shadow-[0_0_0_1px_rgb(233_234_228/0.12)]">
            <p className="font-mono text-[0.6875rem] tracking-[0.06em] text-ceniza uppercase">Capa</p>
            <div className="mt-2 grid grid-cols-3 gap-1" role="group" aria-label="Capa del mapa">
              {CAPAS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCapa(c.id)}
                  aria-pressed={capa === c.id}
                  className={`min-h-9 rounded-[3px] font-mono text-[0.6875rem] uppercase transition-colors ${capa === c.id ? "bg-niebla text-basalto" : "text-niebla hover:bg-escoria-clara"}`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
            <ul className="mt-3 grid gap-1.5">
              {capaActual.leyenda.map(([estado, texto]) => (
                <li key={estado} className="flex items-center gap-2 text-[0.8125rem] text-niebla">
                  <span className={`h-3 w-3 shrink-0 rounded-[2px] ${SENAL[estado]}`} aria-hidden="true" />
                  {texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative -mt-[100svh]">
        {/* Portada */}
        <div ref={portada} data-indice="-1" className="relative h-[100svh] min-h-[36rem]">
          <h1 className="titular-mayor absolute inset-x-4 top-[5.25rem] z-0 text-[12.6vw] text-niebla sm:top-[6.5rem] lg:inset-x-8 lg:text-[clamp(4rem,12.4vw,15rem)]">
            Sembrado
            <br />
            en ceniza.
          </h1>
          <div className="pointer-events-none absolute inset-3 z-20 border border-niebla/10 lg:inset-5" aria-hidden="true">
            <span className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2 bg-basalto px-2 font-mono text-[0.625rem] tracking-[0.06em] text-ceniza">N</span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[58%] bg-gradient-to-t from-basalto via-basalto/80 to-transparent lg:hidden" aria-hidden="true" />
          <div className="absolute inset-x-4 bottom-12 z-20 sm:bottom-14 lg:right-auto lg:bottom-16 lg:left-8 lg:max-w-[40rem]">
            <p className="font-mono text-[0.6875rem] tracking-[0.05em] text-ceniza uppercase">
              Finca de ejemplo · Timbío, Cauca · {coordenadas}
            </p>
            <p className="mt-3 max-w-[34rem] text-[1.0625rem] leading-relaxed text-niebla sm:text-lg">
              El cuaderno de campo del caficultor: tus lotes sobre el relieve real de la finca, la broca y la roya con las reglas de Cenicafé, la cosecha y el costo por carga. <strong className="font-bold text-amarillo">Funciona sin señal.</strong>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/registro" className="boton bg-cereza-viva px-6 text-basalto hover:bg-[#ff5a4f]">
                Crear mi finca <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link to="/acceso?demo=1" className="boton border-[1.5px] border-niebla/40 px-6 text-niebla hover:border-niebla hover:bg-escoria">
                Entrar a la finca de ejemplo
              </Link>
              <a href="#ceniza" className="boton px-2 font-mono text-[0.75rem] font-medium tracking-[0.04em] text-ceniza uppercase hover:text-niebla">
                Saltar el recorrido <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Capítulos */}
        <ol className="relative">
          {capitulos.map((capitulo, indice) => (
            <li
              key={capitulo.id}
              ref={(nodo) => {
                pasos.current[indice] = nodo;
              }}
              data-indice={indice}
              className="flex min-h-[100svh] items-end px-4 pb-16 lg:items-center lg:px-8 lg:pb-0"
            >
              <article className={`relative z-20 w-full max-w-[26rem] rounded-[var(--radius-placa)] bg-basalto/95 p-5 shadow-[0_0_0_1px_rgb(233_234_228/0.12)] transition-opacity duration-500 sm:p-6 ${activo === indice ? "opacity-100" : "opacity-40"}`}>
                <p className="font-mono text-[0.6875rem] tracking-[0.06em] text-amarillo uppercase">{capitulo.rotulo}</p>
                <h2 className="titular mt-2 text-[1.75rem] text-niebla sm:text-[2.3rem]">{capitulo.titulo}</h2>
                <p className="mt-3 text-niebla/85">{capitulo.texto}</p>
                <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[3px] bg-niebla/12">
                  {capitulo.datos.map(([nombre, valor]) => (
                    <div key={nombre} className="bg-basalto p-2.5">
                      <dt className="truncate font-mono text-[0.625rem] tracking-[0.05em] text-ceniza uppercase">{nombre}</dt>
                      <dd className="numeral mt-1 text-[1rem] break-words text-niebla sm:text-[1.15rem]">{valor}</dd>
                    </div>
                  ))}
                </dl>
                {capitulo.nota && <p className="mt-4 hidden border-l-2 border-amarillo pl-3 text-[0.9375rem] text-niebla/85 sm:block">{capitulo.nota}</p>}
                {capitulo.fuente && (
                  <a href={capitulo.fuente.url} target="_blank" rel="noreferrer" className="mt-4 block font-mono text-[0.625rem] leading-relaxed tracking-[0.02em] text-ceniza underline decoration-ceniza/40 underline-offset-2 hover:text-niebla">
                    Fuente: {capitulo.fuente.texto}
                  </a>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
