import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, WifiOff } from "lucide-react";
import { Logotipo } from "@/components/marca/Marca";
import { CLASES } from "@/ia/modelo";
import { ATRIBUCION_RELIEVE } from "@/components/finca3d/terreno";
import { ATRIBUCION_SATELITE } from "@/components/finca3d/satelite";
import { FUENTES } from "@/datos/agronomia";

/* Aparece una vez cuando entra en pantalla (sin movimiento si se pidió reducirlo). */
function useAparecer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);
  return [ref, visible];
}

const aparece = (visible) => `transition-[opacity,transform] duration-700 ease-[var(--ease-salida)] ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;

function Rotulo({ children, className = "text-ceniza" }) {
  return <p className={`font-mono text-[0.75rem] tracking-[0.06em] uppercase ${className}`}>{children}</p>;
}

/* ── El suelo: la capa de ceniza bajo el lote ── */
const ESTRATOS = [
  { nombre: "Horizonte A", detalle: "Materia orgánica, raíces", y: 0, alto: 70, color: "#1B1916" },
  { nombre: "Ceniza volcánica", detalle: "Suelta, guarda agua, fija fósforo", y: 70, alto: 90, color: "#8F9088" },
  { nombre: "Horizonte B", detalle: "Arcilla rojiza", y: 160, alto: 150, color: "#6E3B24" },
  { nombre: "Roca", detalle: "Material de origen", y: 310, alto: 90, color: "#2A2B27" },
];

export function Ceniza() {
  const [ref, visible] = useAparecer();
  return (
    <section id="ceniza" className="relative bg-basalto text-niebla">
      <div ref={ref} className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20 lg:py-32">
        <div className={aparece(visible)}>
          <Rotulo>Bajo la finca</Rotulo>
          <h2 className="titular-mayor mt-4 text-[clamp(2.6rem,7vw,5.8rem)]">
            Debajo,
            <br />
            <span className="text-ceniza">ceniza.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-niebla/85">
            Cerca de la mitad del área cafetera de Colombia crece sobre suelos de ceniza volcánica. Son sueltos y guardan agua, pero fijan el fósforo: por eso el análisis de suelo va antes del abono.
          </p>
          <p className="mt-4 max-w-lg text-lg text-niebla/85">El borde de la finca en 3D muestra esas capas. Es la misma tierra que pisas al hacer el plateo.</p>
          <a
            href="https://revistas.unal.edu.co/index.php/acta_agronomica/article/download/48484/49690/237081"
            target="_blank"
            rel="noreferrer"
            className="mt-6 block max-w-lg font-mono text-[0.625rem] leading-relaxed text-ceniza underline decoration-ceniza/40 underline-offset-2 hover:text-niebla"
          >
            Fuente: Ortiz y Zapata, Acta Agronómica (UNAL): 52 % del área en cafetales sobre suelos derivados de ceniza volcánica.
          </a>
        </div>
        <figure className={`${aparece(visible)} delay-150`}>
          <svg viewBox="0 0 520 420" className="h-auto w-full" role="img" aria-label="Corte del suelo: horizonte A, capa de ceniza volcánica, horizonte B y roca">
            {ESTRATOS.map((e) => {
              const y0 = e.y;
              return (
                <g key={e.nombre}>
                  <rect x="0" y={y0} width="250" height={e.alto} fill={e.color} />
                  <line x1="250" y1={y0 + 0.5} x2="270" y2={y0 + 0.5} stroke="#9A9C94" strokeWidth="1" />
                  <text x="284" y={y0 + 22} fill="#E9EAE4" fontFamily="Martian Mono, monospace" fontSize="13" letterSpacing=".5">
                    {e.nombre.toUpperCase()}
                  </text>
                  <text x="284" y={y0 + 42} fill="#9A9C94" fontFamily="Ancizar Sans, sans-serif" fontSize="14">
                    {e.detalle}
                  </text>
                </g>
              );
            })}
            {/* Vetas de la ceniza y una raíz de café */}
            <g stroke="#E9EAE4" strokeOpacity=".18" strokeWidth="1">
              <path d="M0 96c40-6 80 4 120-2s90 6 130 0" fill="none" />
              <path d="M0 124c50 4 90-6 130 0s80-4 120 2" fill="none" />
            </g>
            <path d="M118 0c2 30-8 52 4 82s-6 64 6 100" stroke="#E9EAE4" strokeOpacity=".55" strokeWidth="2" fill="none" />
            <path d="M120 40c14 8 22 20 40 24M116 110c-16 6-24 18-42 20" stroke="#E9EAE4" strokeOpacity=".4" strokeWidth="1.4" fill="none" />
            <rect x="0" y="0" width="250" height="400" fill="none" stroke="#E9EAE4" strokeOpacity=".2" />
          </svg>
          <figcaption className="mt-3 font-mono text-[0.625rem] text-ceniza uppercase">Esquema, no a escala</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ── Diagnóstico por foto ── */
export function Diagnostico() {
  const [ref, visible] = useAparecer();
  const clases = CLASES.filter((c) => !c.rechazo && !c.desactivada);
  return (
    <section id="diagnostico" className="bg-cal text-tinta">
      <div ref={ref} className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-20 lg:py-32">
        <figure className={`relative order-2 lg:order-1 ${aparece(visible)}`}>
          <div className="relative overflow-hidden rounded-[var(--radius-placa)] bg-escoria">
            <svg viewBox="0 0 560 420" className="block h-auto w-full" role="img" aria-label="Ejemplo ilustrado: el envés de una hoja de café con pústulas de roya marcadas por el diagnóstico">
              <defs>
                <radialGradient id="cv-polvo" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#FFC21A" />
                  <stop offset=".6" stopColor="#FF7A1A" />
                  <stop offset="1" stopColor="#FF7A1A" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M60 230C120 120 300 70 470 110c30 8 50 20 60 34-40 4-62 20-78 48-40 72-150 120-260 120-90 0-150-30-132-82Z" fill="#5C6B4E" />
              <path d="M70 232C190 214 330 170 520 142" stroke="#C9CDB8" strokeWidth="3" fill="none" />
              <g stroke="#C9CDB8" strokeOpacity=".6" strokeWidth="1.6" fill="none">
                <path d="M150 220c10-40 30-70 60-96M220 206c12-44 34-74 64-96M290 190c14-40 36-64 70-82M360 176c12-30 30-48 58-62M150 222c20 30 50 52 90 66M230 208c20 34 54 58 96 70M310 192c22 30 52 48 92 56" />
              </g>
              {[
                [300, 236, 13],
                [322, 252, 9],
                [284, 258, 8],
                [340, 228, 7],
                [306, 274, 6],
                [262, 240, 6],
              ].map(([cx, cy, r]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="url(#cv-polvo)" />
              ))}
              <g stroke="#FFC21A" strokeWidth="3" fill="none">
                <path d="M236 206v-16h16M368 206v-16h-16M236 290v16h16M368 290v16h-16" />
              </g>
              <rect x="236" y="312" width="214" height="28" fill="#FFC21A" />
              <text x="246" y="331" fill="#0E0F0C" fontFamily="Martian Mono, monospace" fontSize="12" fontWeight="600">
                ROYA DEL CAFETO · 91 %
              </text>
            </svg>
            <div className="pointer-events-none absolute inset-0 animate-barrido" aria-hidden="true">
              <div className="h-[2px] bg-amarillo shadow-[0_0_18px_4px_rgb(255_194_26/0.45)]" />
            </div>
            <span className="absolute top-3 left-3 rounded-[3px] bg-basalto/85 px-2 py-1 font-mono text-[0.625rem] tracking-[0.05em] text-niebla uppercase">Ejemplo ilustrado · envés</span>
          </div>
        </figure>
        <div className={`order-1 lg:order-2 ${aparece(visible)}`}>
          <Rotulo className="text-grafito">06 · Diagnóstico por foto</Rotulo>
          <h2 className="titular-mayor mt-4 text-[clamp(2.4rem,6vw,5rem)]">Voltea la hoja.</h2>
          <p className="mt-5 max-w-lg text-lg text-grafito">
            La roya se ve por debajo, en el envés: un polvillo amarillo anaranjado. Le tomas la foto y el modelo responde en el mismo celular, sin enviar la imagen y sin señal. Si duda, no adivina: te lo dice.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {clases.map((c) => (
              <li key={c.id} className="rounded-[3px] border border-tinta/15 bg-lamina px-2.5 py-1.5 text-[0.9375rem]">
                {c.nombre}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-grafito">EfficientNet-B1 · 7,3 MB · corre en el teléfono con LiteRT · orientación, no diagnóstico</p>
        </div>
      </div>
    </section>
  );
}

/* ── Del 3D al bolsillo ── */
export function Celular() {
  const [ref, visible] = useAparecer();
  return (
    <section className="overflow-hidden bg-cal text-tinta">
      <div ref={ref} className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pb-32">
        <div className={aparece(visible)}>
          <Rotulo className="text-grafito">07 · Hoy en la finca</Rotulo>
          <h2 className="titular-mayor mt-4 text-[clamp(2.4rem,6vw,5rem)]">Lo de hoy, primero.</h2>
          <p className="mt-5 max-w-lg text-lg text-grafito">
            Al abrir la app ves lo que pide atención, en orden y con la razón: «La Cañada supera el 5 % de broca: controla esta semana». Cada aviso dice de qué regla de Cenicafé sale.
          </p>
          <p className="mt-4 flex max-w-lg items-center gap-2 text-lg font-bold">
            <WifiOff className="h-5 w-5 shrink-0" aria-hidden="true" /> Todo queda guardado en el celular. Sin señal también.
          </p>
          <Link to="/acceso?demo=1" className="boton-primario mt-7 px-6 text-lg">
            Entrar a la finca de ejemplo <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <div className={`flex justify-center ${aparece(visible)}`}>
          <div className={`relative w-[min(78vw,330px)] rounded-[2.6rem] bg-basalto p-3 shadow-[0_40px_80px_-30px_rgb(14_15_12/0.6)] transition-transform duration-1000 ease-[var(--ease-salida)] ${visible ? "rotate-0" : "rotate-3"}`}>
            <img src="/finca-demo/app-hoy.webp" alt="La pantalla «Hoy en la finca» de la app, con los avisos de la finca de ejemplo" width="390" height="844" loading="lazy" decoding="async" className="block h-auto w-full rounded-[2rem] bg-cal" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Lo que hace: índice de módulos ── */
const MODULOS = [
  ["Hoy en la finca", "Lo que pide atención, en orden, con la regla de Cenicafé detrás."],
  ["Lotes en 3D", "El relieve real, el contorno caminado con GPS, pendiente y orientación. Exporta GeoJSON."],
  ["Broca y roya", "Muestreo guiado árbol por árbol, con contadores grandes y la decisión calculada."],
  ["Cosecha y ventas", "Kilos por recolector, pago por kilo, pergamino seco y ventas con factor de rendimiento."],
  ["Costo por carga", "Labores, jornales e insumos se suman solos y se comparan con el precio del día."],
  ["Clima del lote", "Pronóstico de 7 días y lluvia de 30, con avisos para la floración y la roya."],
  ["Diagnóstico por foto", "Orientación sobre la hoja, en el teléfono y sin enviar la foto."],
  ["Guías y asistente", "Catorce guías con fuente y un asistente que responde con tus propios datos."],
  ["Panel del comité", "Para el administrador: fincas, alertas por vereda y el precio de referencia."],
  ["Tus datos son tuyos", "Respaldo en un archivo, CSV, GeoJSON y resumen por WhatsApp."],
];

export function Modulos() {
  const [ref, visible] = useAparecer();
  return (
    <section id="modulos" className="border-t border-tinta bg-cal text-tinta">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className={`titular-mayor text-[clamp(2.4rem,6vw,5rem)] ${aparece(visible)}`}>Qué hace</h2>
          <p className="max-w-sm text-grafito">Diez módulos que funcionan sin señal y se entienden a pleno sol.</p>
        </div>
        <ol className="mt-12 border-t border-tinta">
          {MODULOS.map(([titulo, texto], indice) => (
            <li key={titulo} className="grid gap-1 border-b border-tinta/20 py-5 sm:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)] sm:items-baseline sm:gap-6">
              <span className="font-mono text-[0.75rem] text-grafito">{String(indice + 1).padStart(2, "0")}</span>
              <h3 className="titular text-[1.35rem]">{titulo}</h3>
              <p className="text-grafito">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Por qué sin señal: cifras con fuente ── */
const CIFRAS = [
  {
    valor: "96 %",
    texto: "de los productores de café tiene menos de 5 hectáreas.",
    fuente: "UPRA, citada por Agronegocios (2024)",
    enlace: "https://www.agronegocios.co/agricultura/pequenos-productores-de-cafe-representan-96-del-total-segun-datos-de-la-upra-3832230",
  },
  {
    valor: "−27 %",
    texto: "bajó el precio interno de la carga entre el promedio de 2025 ($ 2.861.890) y el 15 de octubre de 2026 ($ 2.095.000).",
    fuente: "FNC, Informe de gestión 2025 y precio del día",
    enlace: "https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf",
  },
  {
    valor: "43 %",
    texto: "de los hogares rurales todavía no tiene internet en casa.",
    fuente: "DANE, ECV 2025, vía MinTIC",
    enlace:
      "https://mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/437305:Gobierno-Petro-conecto-3-5-millones-de-hogares-en-tres-anos-y-por-primera-vez-mas-de-la-mitad-de-los-hogares-rurales-tienen-internet",
  },
];

export function Cifras() {
  const [ref, visible] = useAparecer();
  return (
    <section className="bg-basalto text-niebla">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
        <Rotulo>Por qué así</Rotulo>
        <h2 className={`titular-mayor mt-4 max-w-4xl text-[clamp(2.2rem,5.4vw,4.6rem)] ${aparece(visible)}`}>Hecha para la finca pequeña, sin señal y con el precio apretado.</h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-placa)] bg-niebla/12 md:grid-cols-3">
          {CIFRAS.map((c) => (
            <div key={c.valor} className="flex flex-col bg-basalto p-6 sm:p-8">
              <p className="numeral text-[clamp(3.4rem,8vw,6rem)] text-amarillo">{c.valor}</p>
              <p className="mt-4 text-lg text-niebla/90">{c.texto}</p>
              <a href={c.enlace} target="_blank" rel="noreferrer" className="mt-auto pt-6 font-mono text-[0.625rem] text-ceniza underline decoration-ceniza/40 underline-offset-2 hover:text-niebla">
                {c.fuente}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Lo que es y lo que no ── */
const ES = ["Un cuaderno de campo que funciona sin señal.", "Cálculos con las reglas publicadas por Cenicafé y la FNC, citadas en cada cifra.", "Gratis y de código abierto."];
const NO_ES = ["No reemplaza al extensionista del Comité de Cafeteros.", "El diagnóstico por foto es una orientación, no un diagnóstico.", "No es un sistema oficial: tus datos viven en tu celular, no en la FNC."];

export function Honestidad() {
  return (
    <section id="proyecto" className="bg-cal text-tinta">
      <div className="mx-auto grid max-w-7xl gap-px px-4 py-24 sm:px-8 md:grid-cols-2 lg:py-32">
        <div className="border-t-[3px] border-tinta pt-6 md:pr-10">
          <h2 className="titular text-[1.9rem]">Qué es</h2>
          <ul className="mt-5 grid gap-4">
            {ES.map((t) => (
              <li key={t} className="flex gap-3 text-lg">
                <Check className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 border-t-[3px] border-cereza pt-6 md:mt-0 md:pl-10">
          <h2 className="titular text-[1.9rem]">Qué no es</h2>
          <ul className="mt-5 grid gap-4">
            {NO_ES.map((t) => (
              <li key={t} className="flex gap-3 text-lg">
                <X className="mt-1 h-5 w-5 shrink-0 text-cereza" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 max-w-2xl text-grafito md:col-span-2">
          Coffee+Visión es un proyecto formativo del programa Análisis y Desarrollo de Software (ADSO) del SENA. La finca «La Esperanza» y sus datos son de ejemplo; el relieve y el lugar son reales.
        </p>
      </div>
    </section>
  );
}

/* ── Pie: fuentes y marca ── */
export function Pie() {
  const fuentes = [FUENTES.broca, FUENTES.roya, FUENTES.fenologia, FUENTES.fr, FUENTES.costos, ATRIBUCION_RELIEVE, { ...ATRIBUCION_SATELITE, texto: `${ATRIBUCION_SATELITE.texto} (CC BY-NC-SA 4.0)` }, { texto: "Pronóstico: Open-Meteo (CC BY 4.0)", url: "https://open-meteo.com/" }];
  return (
    <footer className="tema-basalto overflow-hidden bg-basalto text-niebla">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <Logotipo claro />
            <p className="mt-5 max-w-sm text-niebla/80">El cuaderno de campo del caficultor. Hecho en el SENA, con datos abiertos y las reglas de Cenicafé.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/registro" className="boton bg-cereza-viva px-5 text-basalto hover:bg-[#ff5a4f]">
                Crear mi finca
              </Link>
              <Link to="/acceso" className="boton border-[1.5px] border-niebla/40 px-5 text-niebla hover:border-niebla">
                Entrar
              </Link>
            </div>
            <nav aria-label="Enlaces" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] text-ceniza uppercase">
              <Link to="/privacidad" className="hover:text-niebla">
                Privacidad
              </Link>
              <a href="#modulos" className="hover:text-niebla">
                Qué hace
              </a>
              <a href="#calculadora" className="hover:text-niebla">
                Calculadora
              </a>
            </nav>
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.06em] text-ceniza uppercase">Fuentes</p>
            <ul className="mt-4 grid gap-2.5">
              {fuentes.map((f) => (
                <li key={f.texto}>
                  <a href={f.url} target="_blank" rel="noreferrer" className="text-[0.875rem] text-niebla/75 underline decoration-niebla/20 underline-offset-2 hover:text-niebla">
                    {f.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="titular-mayor mt-16 -mb-[0.1em] px-2 text-center text-[7.6vw] leading-[0.8] whitespace-nowrap text-escoria-clara select-none" aria-hidden="true">
        Coffee<span className="text-cereza-viva">+</span>Visión
      </p>
    </footer>
  );
}
