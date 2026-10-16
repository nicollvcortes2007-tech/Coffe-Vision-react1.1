import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  WifiOff,
  ShieldCheck,
  Map as MapaIcono,
  Wallet,
  CloudSun,
  ScanSearch,
  MessagesSquare,
  Share2,
  Sun,
  Menu,
  X,
  GraduationCap,
  Code2,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Logotipo } from "@/components/marca/Marca";
import { Floracion, Broca, Cereza, Pergamino, Canasto, Roya, Ladera } from "@/components/marca/Pictogramas";
import LaderaSVG from "@/components/ladera/LaderaSVG";
import LaderaViva from "@/components/ladera/LaderaViva";

const LOTES_ILUSTRACION = [
  { id: "a", nombre: "La Loma", estado: "ok" },
  { id: "b", nombre: "El Mirador", estado: "vigilar" },
  { id: "c", nombre: "Guaduales", estado: "ok" },
  { id: "d", nombre: "La Cañada", estado: "actuar" },
  { id: "e", nombre: "Alto Bonito", estado: "ok" },
  { id: "f", nombre: "Zoca 2024", estado: "sinDatos" },
];

const FUENTE_FNC = "https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf";

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
    enlace: FUENTE_FNC,
  },
  {
    valor: "43 %",
    texto: "de los hogares rurales todavía no tiene internet en casa.",
    fuente: "DANE, ECV 2025, vía MinTIC",
    enlace:
      "https://mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/437305:Gobierno-Petro-conecto-3-5-millones-de-hogares-en-tres-anos-y-por-primera-vez-mas-de-la-mitad-de-los-hogares-rurales-tienen-internet",
  },
];

const ANIO = [
  {
    Icono: Floracion,
    momento: "Día 0",
    titulo: "La floración",
    texto: "Registras la fecha de cada floración por lote. Desde ahí la app calcula todo el calendario.",
  },
  {
    Icono: CloudSun,
    momento: "Días 50 a 180",
    titulo: "El fruto pide agua y abono",
    texto: "El grano crece y se llena: es cuando más agua y nutrientes necesita. El pronóstico te avisa si viene seco.",
  },
  {
    Icono: Broca,
    momento: "Desde el día 120",
    titulo: "La broca ataca",
    texto: "Te guía el muestreo de 30 árboles de Cenicafé y calcula el porcentaje. Sobre el 2 %, y con la broca en posición A o B, a controlar.",
  },
  {
    Icono: Cereza,
    momento: "Semana 32 (día 224)",
    titulo: "La cosecha",
    texto: "Registras los kilos de cereza por recolector y por día, y lo que le pagas a cada uno.",
  },
  {
    Icono: Pergamino,
    momento: "Después",
    titulo: "El pergamino y la venta",
    texto: "Convierte a café pergamino seco, registra la venta y te dice cuánto te costó producir cada carga.",
  },
];

const MODULOS = [
  { Icono: Sun, titulo: "Hoy en la finca", texto: "Lo que pide atención, en orden, con la razón y la regla de Cenicafé detrás." },
  { Icono: MapaIcono, titulo: "Lotes con GPS", texto: "Los campos del SICA, el punto o el contorno caminando el borde, y exportación GeoJSON para compradores." },
  { Icono: Roya, titulo: "Broca y roya", texto: "Muestreo guiado con contador de botones grandes y semáforo por lote." },
  { Icono: Canasto, titulo: "Cosecha y ventas", texto: "Kilos por recolector, pago por kilo, conversión a pergamino y ventas con factor de rendimiento." },
  { Icono: Wallet, titulo: "Costo por carga", texto: "Labores, jornales e insumos se suman solos y se comparan con el precio del día." },
  { Icono: CloudSun, titulo: "Clima del lote", texto: "Pronóstico de 7 días y lluvia de los últimos 30, con alertas para el cultivo." },
  { Icono: ScanSearch, titulo: "Diagnóstico por foto", texto: "Orientación sobre manchas en la hoja, en tu celular y sin enviar la foto. Se abstiene si duda." },
  { Icono: MessagesSquare, titulo: "Asistente de tu finca", texto: "Pregúntale por tus propios datos: «¿cuánto gasté en abono en La Loma?»." },
  { Icono: Share2, titulo: "Tus datos son tuyos", texto: "Respaldo en un archivo, resumen por WhatsApp, CSV y GeoJSON." },
];

const ES = [
  "Un cuaderno de campo que funciona sin señal.",
  "Cálculos con las reglas publicadas por Cenicafé y la FNC, citadas en cada cifra.",
  "Gratis y de código abierto.",
];
const NO_ES = [
  "No reemplaza al extensionista del Comité de Cafeteros.",
  "El diagnóstico por foto es una orientación, no un diagnóstico.",
  "No es un sistema oficial: tus datos viven en tu celular, no en la FNC.",
];

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
      { rootMargin: "0px 0px -10% 0px" },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);
  return [ref, visible];
}

function AnioCafetero() {
  const [activo, setActivo] = useState(0);
  const pasos = useRef([]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setActivo(Number(entrada.target.dataset.indice));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pasos.current.forEach((paso) => paso && observador.observe(paso));
    return () => observador.disconnect();
  }, []);
  const PasoActivo = ANIO[activo];
  return (
    <section id="anio" className="border-y border-linea bg-papel">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-28">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="rotulo">El año cafetero</p>
          <h2 className="titular mt-3 text-[2.4rem] sm:text-[3.2rem]">
            Una floración, <em className="text-cereza">un calendario.</em>
          </h2>
          <p className="mt-4 max-w-md text-lg text-tierra-media">
            Las fechas salen de Cenicafé. Tú registras la floración; la app te avisa cuándo muestrear, cuándo vigilar el agua y cuándo llega la cosecha.
          </p>
          <div className="mt-8 hidden items-center gap-4 rounded-3xl border border-linea bg-pergamino p-6 lg:flex" aria-hidden="true">
            <span className="grid h-20 w-20 place-items-center rounded-2xl bg-tierra text-papel">
              <PasoActivo.Icono className="h-11 w-11" />
            </span>
            <div>
              <p className="rotulo">{PasoActivo.momento}</p>
              <p className="titular text-3xl">{PasoActivo.titulo}</p>
            </div>
          </div>
        </div>
        <ol className="relative grid gap-6 border-l-2 border-dashed border-borde-campo/50 pl-8">
          {ANIO.map((paso, indice) => (
            <li
              key={paso.titulo}
              ref={(nodo) => {
                pasos.current[indice] = nodo;
              }}
              data-indice={indice}
              className={`relative rounded-3xl border p-6 transition-colors duration-500 lg:min-h-[13rem] ${
                activo === indice ? "border-tierra bg-pergamino" : "border-linea bg-papel"
              }`}
            >
              <span
                className={`absolute top-7 -left-[2.65rem] grid h-9 w-9 place-items-center rounded-full border-2 transition-colors ${
                  activo === indice ? "border-cereza bg-cereza text-white" : "border-borde-campo bg-papel text-tierra-media"
                }`}
                aria-hidden="true"
              >
                {indice + 1}
              </span>
              <p className="rotulo">{paso.momento}</p>
              <h3 className="titular mt-2 flex items-center gap-3 text-[1.7rem]">
                <paso.Icono className="h-7 w-7 text-cereza lg:hidden" />
                {paso.titulo}
              </h3>
              <p className="mt-2 text-tierra-media">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [refCifras, cifrasVisibles] = useAparecer();

  useEffect(() => {
    document.title = "Coffee+Visión · El cuaderno de campo del caficultor";
  }, []);

  return (
    <div className="min-h-dvh overflow-x-clip">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-xl focus:bg-tierra focus:px-4 focus:py-3 focus:text-papel">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-40 border-b border-linea/70 bg-pergamino/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" aria-label="Coffee+Visión, inicio">
            <Logotipo />
          </Link>
          <nav aria-label="Secciones" className="hidden items-center gap-7 font-bold text-tierra-media md:flex">
            <a href="#que-hace" className="hover:text-tierra">
              Qué hace
            </a>
            <a href="#anio" className="hover:text-tierra">
              El año cafetero
            </a>
            <a href="#proyecto" className="hover:text-tierra">
              El proyecto
            </a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/acceso" className="boton-fantasma">
              Entrar
            </Link>
            <Link to="/registro" className="boton-primario">
              Crear mi cuaderno
            </Link>
          </div>
          <button type="button" className="boton-fantasma h-12 w-12 px-0 md:hidden" aria-expanded={menu} aria-label={menu ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenu((abierto) => !abierto)}>
            {menu ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
        {menu && (
          <nav className="grid gap-1 border-t border-linea px-5 pt-2 pb-4 md:hidden" aria-label="Secciones">
            {[
              ["#que-hace", "Qué hace"],
              ["#anio", "El año cafetero"],
              ["#proyecto", "El proyecto"],
            ].map(([href, texto]) => (
              <a key={href} href={href} onClick={() => setMenu(false)} className="flex min-h-12 items-center rounded-xl px-3 font-bold hover:bg-crema">
                {texto}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/acceso" className="boton-secundario">
                Entrar
              </Link>
              <Link to="/registro" className="boton-primario">
                Crear cuaderno
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="contenido">
        {/* Portada */}
        <section className="grano-papel curvas-nivel">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pt-20 lg:pb-24">
            <div className="animate-aparecer">
              <p className="inline-flex items-center gap-2 rounded-full border border-linea bg-papel/80 px-3 py-1.5 text-sm font-bold text-tierra-media">
                <Ladera className="h-4 w-4 text-hoja" /> Para caficultores del Cauca y de toda Colombia
              </p>
              <h1 className="titular mt-5 text-[clamp(2.7rem,7.4vw,5.4rem)]">
                Tu finca,
                <br />
                <em className="font-[460] text-cereza">a la vista.</em>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-tierra-media sm:text-xl">
                El cuaderno de campo del caficultor: lotes, broca y roya, cosecha y costo por carga, con las reglas de Cenicafé. Funciona sin señal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/registro" className="boton-primario px-6 text-lg">
                  Crear mi cuaderno <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link to="/acceso?demo=1" className="boton-secundario px-6 text-lg">
                  Ver una finca de ejemplo
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-bold text-tierra-media">
                <li className="flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-hoja" aria-hidden="true" /> Sin señal
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-hoja" aria-hidden="true" /> Datos en tu celular
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-hoja" aria-hidden="true" /> Hecho en el SENA
                </li>
              </ul>
            </div>
            <figure className="relative animate-aparecer [animation-delay:120ms]">
              <div className="papel overflow-hidden p-2 shadow-levantado">
                <LaderaViva lotes={LOTES_ILUSTRACION} respaldo={<LaderaSVG lotes={LOTES_ILUSTRACION} titulo="Ladera de ejemplo con seis lotes coloreados por estado" />} />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tierra-media">
                <span className="font-bold text-tierra">Ilustración con datos de ejemplo:</span>
                {[
                  ["bg-hoja-clara", "Al día"],
                  ["bg-pinton", "Vigilar"],
                  ["bg-cereza-viva", "Actuar hoy"],
                  ["bg-niebla", "Sin datos"],
                ].map(([color, texto]) => (
                  <span key={texto} className="inline-flex items-center gap-1.5">
                    <span className={`h-3 w-3 rounded-sm ${color}`} aria-hidden="true" /> {texto}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* El problema, con cifras */}
        <section className="bg-tostado text-papel">
          <div ref={refCifras} className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <h2 className="titular max-w-3xl text-[2.2rem] text-papel sm:text-[2.8rem]">
              Se cultiva en pequeño, se vende a precio de bolsa y <em className="text-pinton">se anota en la memoria.</em>
            </h2>
            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              {CIFRAS.map((cifra, indice) => (
                <div
                  key={cifra.valor}
                  className={`border-t border-papel/20 pt-5 transition-all duration-700 ${cifrasVisibles ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                  style={{ transitionDelay: `${indice * 120}ms` }}
                >
                  <dt className="cifra titular text-[3.4rem] text-pinton">{cifra.valor}</dt>
                  <dd className="mt-2 text-lg text-papel/90">{cifra.texto}</dd>
                  <dd className="mt-3 text-sm text-papel/60">
                    Fuente:{" "}
                    <a href={cifra.enlace} className="underline decoration-papel/40 underline-offset-2 hover:text-papel" target="_blank" rel="noreferrer">
                      {cifra.fuente}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-3xl text-lg text-papel/80">
              La FNC y Cenicafé ofrecen extensión, apps de consulta y chatbots gratuitos. Lo que no encontramos fue un cuaderno del propio caficultor que lleve sus labores, sus kilos, sus gastos y sus ventas, y que funcione sin señal. Eso es Coffee+Visión.
            </p>
          </div>
        </section>

        {/* Qué hace */}
        <section id="que-hace" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="rotulo">Qué hace</p>
          <h2 className="titular mt-3 max-w-3xl text-[2.4rem] sm:text-[3.2rem]">
            Todo lo de la finca, <em className="text-cereza">en un solo cuaderno.</em>
          </h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-linea bg-linea sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map(({ Icono, titulo, texto }) => (
              <li key={titulo} className="bg-papel p-6 sm:p-7">
                <Icono className="h-8 w-8 text-cereza" aria-hidden="true" strokeWidth={1.6} />
                <h3 className="mt-4 text-xl font-bold">{titulo}</h3>
                <p className="mt-2 text-tierra-media">{texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <AnioCafetero />

        {/* Honestidad */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-hoja/30 bg-hoja-tenue p-7">
              <h2 className="titular text-[1.9rem] text-hoja-oscura">Lo que es</h2>
              <ul className="mt-5 grid gap-3">
                {ES.map((texto) => (
                  <li key={texto} className="flex gap-3 text-lg">
                    <CircleCheck className="mt-1 h-5 w-5 shrink-0 text-hoja" aria-hidden="true" /> {texto}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-linea bg-papel p-7">
              <h2 className="titular text-[1.9rem]">Lo que no es</h2>
              <ul className="mt-5 grid gap-3">
                {NO_ES.map((texto) => (
                  <li key={texto} className="flex gap-3 text-lg">
                    <CircleX className="mt-1 h-5 w-5 shrink-0 text-tierra-media" aria-hidden="true" /> {texto}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Proyecto */}
        <section id="proyecto" className="border-t border-linea bg-papel">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-24">
            <div>
              <p className="rotulo">El proyecto</p>
              <h2 className="titular mt-3 text-[2.4rem] sm:text-[3rem]">
                Hecho por aprendices del <em className="text-cereza">SENA.</em>
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-tierra-media">
                Coffee+Visión es el proyecto formativo de un equipo del Tecnólogo en Análisis y Desarrollo de Software del SENA en Popayán, Cauca. Está pensado para el pequeño caficultor: letra grande, botones para el pulgar, uso a pleno sol y sin depender de la señal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/registro" className="boton-primario">
                  Crear mi cuaderno <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <a href="https://github.com/nicollvcortes2007-tech/Coffe-Vision-react1.1" className="boton-secundario" target="_blank" rel="noreferrer">
                  <Code2 className="h-5 w-5" aria-hidden="true" /> Ver el código
                </a>
              </div>
            </div>
            <aside className="rounded-3xl bg-pergamino p-7">
              <h3 className="text-lg font-bold">Fuentes que usa la app</h3>
              <ul className="mt-4 grid gap-3 text-tierra-media">
                <li>Métodos y umbrales de Cenicafé (broca, roya, floración, cosecha).</li>
                <li>Precio interno de referencia de la FNC, escrito con su fecha y su enlace.</li>
                <li>Clima de Open-Meteo y TRM y estadísticas agrícolas de datos.gov.co.</li>
                <li>Modelo de hojas de café EfficientNet-B1 (Apache-2.0).</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-tostado text-papel/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logotipo claro />
            <p className="mt-4 max-w-sm text-[0.95rem]">El cuaderno de campo del caficultor. Proyecto formativo del SENA, Popayán.</p>
          </div>
          <nav aria-label="Enlaces" className="grid content-start gap-2">
            <Link to="/acceso" className="hover:text-papel">
              Entrar
            </Link>
            <Link to="/registro" className="hover:text-papel">
              Crear cuenta
            </Link>
            <Link to="/privacidad" className="hover:text-papel">
              Privacidad y datos
            </Link>
          </nav>
          <p className="text-sm">
            Datos del clima por{" "}
            <a href="https://open-meteo.com" className="underline" target="_blank" rel="noreferrer">
              Open-Meteo.com
            </a>{" "}
            (CC BY 4.0). Estadísticas de{" "}
            <a href="https://www.datos.gov.co" className="underline" target="_blank" rel="noreferrer">
              datos.gov.co
            </a>{" "}
            (CC BY-SA 4.0).
          </p>
        </div>
      </footer>
    </div>
  );
}
