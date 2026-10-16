import { useEffect, useRef, useState } from "react";
import { Crosshair, RotateCcw, Mountain, Satellite, ScanLine, Navigation2, X, Hand, Check } from "lucide-react";
import { cargarRelieve, cargarRelieveHorneado, ATRIBUCION_RELIEVE } from "./terreno.js";
import { crearEscena, hayWebGL2 } from "./escena.js";
import { dibujarRelieve2D } from "./relieve2d.js";
import { cargarSatelite, ATRIBUCION_SATELITE } from "./satelite.js";
import { gms } from "./coordenadas.js";
import { ent, num } from "@/utilidades/formato";

const ESTADOS = { ok: "Al día", vigilar: "Vigilar", actuar: "Actuar hoy", sinDatos: "Sin datos" };
const PALETA_2D = { bajo: "#1C1D19", alto: "#A9ABA2", linea: "#E9EAE4", estados: { ok: "#E9EAE4", vigilar: "#FFC21A", actuar: "#FF3B2F", sinDatos: "#9A9C94" } };

/*
  La finca en 3D: relieve real alrededor de la casa (2 km por lado, recortado en un
  círculo como una muestra de suelo), los lotes como placas según su estado y un pin
  en la casa. Se descarga solo cuando entra en pantalla. Sin WebGL2 dibuja el mismo
  relieve en 2D; sin ubicación o sin señal muestra `respaldo`.
*/
export default function Finca3D({
  finca,
  lotes,
  colores,
  alSeleccionar,
  alListo,
  respaldo,
  entrada = true,
  mostrarEtiquetas = true,
  etiquetasDe,
  controlesVisibles = true,
  lecturaEnVivo = false,
  ficha = true,
  className = "",
  extension = 1400,
  exageracion,
  relieveHorneado,
  nieblaValle,
  angulo,
  zoomRueda = true,
  distancia,
  bloqueoTactil = false,
  lecturaClase = "top-3 left-3",
  controlesClase = "right-3 bottom-10",
  fichaClase = "inset-x-3 bottom-10 sm:right-auto sm:w-72",
  clase2d = "absolute inset-0 m-auto aspect-square h-[86%] w-auto max-w-[86%] rounded-full",
  children,
}) {
  const contenedor = useRef(null);
  const lienzo = useRef(null);
  const escena = useRef(null);
  const etiquetas = useRef(new Map());
  const casa = useRef(null);
  const brujula = useRef(null);
  const lotesRef = useRef(lotes);
  const relieve2d = useRef(null);
  const [estado, setEstado] = useState("esperando");
  const [punto, setPunto] = useState(null);
  const [apuntado, setApuntado] = useState(null);
  const [info, setInfo] = useState(null);
  const [satelite, setSatelite] = useState({ activo: false, cargando: false, limites: null, listo: false });
  // En pantallas táctiles, el lienzo no atrapa el dedo hasta que la persona lo pide:
  // así la página sigue bajando aunque el 3D ocupe toda la pantalla.
  const [tactil] = useState(() => typeof window !== "undefined" && (window.matchMedia?.("(pointer: coarse)").matches ?? false));
  const [moviendo, setMoviendo] = useState(false);
  const lienzoLibre = bloqueoTactil && tactil && !moviendo;
  const lat = finca?.lat;
  const lon = finca?.lon;
  const clave = lotes.map((l) => `${l.id}:${l.estado}:${l.color ?? ""}:${l.rayado ?? ""}:${l.geometria ? JSON.stringify(l.geometria).length : 0}`).join("|");

  useEffect(() => {
    lotesRef.current = lotes;
  });

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setEstado("sin-ubicacion");
      return undefined;
    }
    const sinWebGL = !hayWebGL2();
    const nodo = contenedor.current;
    let cancelado = false;
    const control = new AbortController();
    const iniciar = async () => {
      setEstado("cargando");
      try {
        const relieve = relieveHorneado
          ? await cargarRelieveHorneado({ url: relieveHorneado, lat, lon, extension, senal: control.signal })
          : await cargarRelieve({ lat, lon, extension, senal: control.signal });
        if (cancelado) return;
        setSatelite((s) => ({ ...s, limites: relieve.limites, listo: false, activo: false }));
        if (sinWebGL) {
          lienzo.current.width = 720;
          lienzo.current.height = 720;
          relieve2d.current = relieve;
          dibujarRelieve2D(lienzo.current, relieve, lotesRef.current, PALETA_2D);
          setInfo({ minimo: relieve.minimo, maximo: relieve.maximo, exageracion: 1 });
          setEstado("listo-2d");
          return;
        }
        const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        escena.current = crearEscena({
          lienzo: lienzo.current,
          relieve,
          lotes: lotesRef.current,
          colores,
          exageracion,
          entrada,
          nieblaValle,
          angulo,
          zoomRueda,
          distancia,
          reducirMovimiento: reducir,
          alSeleccionar: (dato) => {
            setPunto(dato);
            if (dato.loteId) alSeleccionar?.(dato.loteId);
          },
          alApuntar: lecturaEnVivo ? setApuntado : undefined,
          alPerderContexto: () => setEstado("error"),
          alMover: ({ lotes: posiciones, casa: posCasa, acimut }) => {
            // Evita que las etiquetas se monten: de arriba hacia abajo, cada una baja
            // si choca con una ya ubicada. La casa entra primero.
            const ubicadas = [];
            const elCasa = casa.current;
            if (elCasa) {
              ubicadas.push({ x: posCasa.x, y: posCasa.y, ancho: elCasa.offsetWidth || 80 });
              elCasa.style.transform = `translate(-50%, -100%) translate(${posCasa.x}px, ${posCasa.y}px)`;
            }
            for (const p of [...posiciones].sort((a, b) => a.y - b.y)) {
              const el = etiquetas.current.get(p.id);
              if (!el) continue;
              const ancho = el.offsetWidth || 80;
              const altoEtiqueta = (el.offsetHeight || 24) + 4;
              let y = p.y;
              for (const otra of ubicadas) {
                if (Math.abs(otra.x - p.x) < (otra.ancho + ancho) / 2 + 4 && Math.abs(otra.y - y) < altoEtiqueta) y = otra.y + altoEtiqueta;
              }
              ubicadas.push({ x: p.x, y, ancho });
              el.style.transform = `translate(-50%, -100%) translate(${p.x}px, ${y}px)`;
              el.style.opacity = p.visible ? "1" : "0";
            }
            if (brujula.current) brujula.current.style.transform = `rotate(${(acimut * 180) / Math.PI}deg)`;
          },
        });
        setInfo({ minimo: relieve.minimo, maximo: relieve.maximo, exageracion: escena.current.exageracion });
        setEstado("listo");
        alListo?.(escena.current);
      } catch (error) {
        if (!cancelado && error.name !== "AbortError") {
          console.warn("No se pudo mostrar la finca en 3D", error);
          setEstado("error");
        }
      }
    };
    // Solo se descarga cuando entra en pantalla.
    const observador = new IntersectionObserver(
      ([entradaObs]) => {
        if (entradaObs.isIntersecting) {
          observador.disconnect();
          iniciar();
        }
      },
      { rootMargin: "200px" },
    );
    observador.observe(nodo);
    return () => {
      cancelado = true;
      control.abort();
      observador.disconnect();
      escena.current?.destruir();
      escena.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, extension, exageracion, relieveHorneado]);

  // Cambios de estado o de capa: se repintan las placas sin rehacer la escena.
  useEffect(() => {
    escena.current?.actualizarLotes(lotesRef.current);
    if (relieve2d.current && lienzo.current) dibujarRelieve2D(lienzo.current, relieve2d.current, lotesRef.current, PALETA_2D);
  }, [clave]);

  const alternarSatelite = async () => {
    const activo = !satelite.activo;
    if (activo && !satelite.listo && satelite.limites) {
      setSatelite((s) => ({ ...s, cargando: true }));
      try {
        escena.current?.ponerSatelite(await cargarSatelite({ limites: satelite.limites }));
        setSatelite((s) => ({ ...s, cargando: false, listo: true, activo: true }));
        escena.current?.mezclarSatelite(true);
      } catch (error) {
        console.warn("No se pudo cargar la imagen satelital", error);
        setSatelite((s) => ({ ...s, cargando: false }));
      }
      return;
    }
    setSatelite((s) => ({ ...s, activo }));
    escena.current?.mezclarSatelite(activo);
  };

  const cerrarFicha = () => {
    setPunto(null);
    escena.current?.seleccionar(null);
  };

  if (estado === "sin-ubicacion" || estado === "error") {
    return (
      <div className={className}>
        {respaldo}
        {estado === "error" && <p className="mt-2 text-sm text-grafito">Sin señal para cargar el relieve; se ve el mapa en 2D.</p>}
      </div>
    );
  }

  const loteTocado = punto?.loteId ? lotes.find((l) => l.id === punto.loteId) : null;
  const listo = estado === "listo";
  const lectura = apuntado ?? punto;

  return (
    <div ref={contenedor} className={`tema-basalto relative isolate overflow-hidden ${className}`}>
      <canvas ref={lienzo} className={`select-none ${estado === "listo-2d" ? clase2d : `block h-full w-full ${lienzoLibre ? "pointer-events-none" : "touch-none"}`}`} aria-hidden="true" />

      {(estado === "esperando" || estado === "cargando") && (
        <div className="absolute inset-0 grid place-items-center" role="status">
          <span className="lectura-3d">
            <ScanLine className="h-4 w-4 animate-pulse" aria-hidden="true" /> Leyendo el relieve…
          </span>
        </div>
      )}

      {listo && mostrarEtiquetas && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {lotes
            .filter((l) => l.geometria && (!etiquetasDe || etiquetasDe.includes(l.id)))
            .map((l) => (
              <span
                key={l.id}
                ref={(el) => {
                  if (el) etiquetas.current.set(l.id, el);
                  else etiquetas.current.delete(l.id);
                }}
                className="etiqueta-lote absolute top-0 left-0 whitespace-nowrap transition-opacity"
                data-estado={l.estado}
                data-activo={punto?.loteId === l.id}
              >
                {l.nombre}
              </span>
            ))}
          <span ref={casa} className="etiqueta-casa absolute top-0 left-0 whitespace-nowrap">
            {finca?.nombre}
            {Number.isFinite(finca?.altitud) && <span className="opacity-70">{ent(finca.altitud)} m</span>}
          </span>
        </div>
      )}

      {(listo || estado === "listo-2d") && info && (
        <div className={`lectura-3d pointer-events-none absolute max-w-[calc(100%-1.5rem)] ${lecturaClase}`} aria-live="polite">
          {lectura ? <Crosshair className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Mountain className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          <span className="truncate">{lectura ? `${gms(lectura.lat, lectura.lon)} · ${ent(lectura.altura)} m` : `${ent(info.minimo)}–${ent(info.maximo)} m${info.exageracion > 1 ? ` · relieve ×${num(info.exageracion)}` : ""}`}</span>
        </div>
      )}

      {listo && ficha && punto && (
        <div className={`absolute ${fichaClase}`}>
          <div className="rounded-[var(--radius-placa)] bg-basalto/95 p-3 text-niebla shadow-[0_0_0_1px_rgb(233_234_228/0.14)]" role="group" aria-label={loteTocado ? `Lote ${loteTocado.nombre}` : "Punto del terreno"}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[0.6875rem] tracking-[0.04em] text-ceniza uppercase">{loteTocado ? (ESTADOS[loteTocado.estado] ?? "Lote") : "Punto del terreno"}</p>
                <p className="titular truncate text-lg text-niebla">{loteTocado ? loteTocado.nombre : `${ent(punto.altura)} m s. n. m.`}</p>
              </div>
              <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded text-ceniza hover:bg-escoria-clara hover:text-niebla" onClick={cerrarFicha} aria-label="Cerrar la ficha">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-2 font-mono text-[0.6875rem]">
              <div>
                <dt className="text-ceniza uppercase">Altitud</dt>
                <dd className="text-niebla">{ent(punto.altura)} m</dd>
              </div>
              <div>
                <dt className="text-ceniza uppercase">Pendiente</dt>
                <dd className="text-niebla">{punto.pendiente}°</dd>
              </div>
              <div>
                <dt className="text-ceniza uppercase">Mira al</dt>
                <dd className="text-niebla">{punto.orientacion}</dd>
              </div>
              {loteTocado?.areaHa > 0 && (
                <div>
                  <dt className="text-ceniza uppercase">Área</dt>
                  <dd className="text-niebla">{num(loteTocado.areaHa)} ha</dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-ceniza uppercase">GPS</dt>
                <dd className="text-niebla">
                  {punto.lat.toFixed(5)}, {punto.lon.toFixed(5)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {listo && controlesVisibles && (
        <div className={`absolute flex flex-col gap-2 ${controlesClase}`}>
          {bloqueoTactil && tactil && (
            <button type="button" className={`control-3d ${moviendo ? "control-3d-activo" : ""}`} onClick={() => setMoviendo((m) => !m)} aria-pressed={moviendo} aria-label={moviendo ? "Dejar de mover la finca" : "Mover la finca con el dedo"}>
              {moviendo ? <Check className="h-5 w-5" aria-hidden="true" /> : <Hand className="h-5 w-5" aria-hidden="true" />}
            </button>
          )}
          <button type="button" className={`control-3d ${satelite.activo ? "control-3d-activo" : ""}`} onClick={alternarSatelite} aria-pressed={satelite.activo} aria-label={satelite.cargando ? "Cargando la imagen satelital" : "Ver la imagen satelital"} disabled={satelite.cargando}>
            <Satellite className={`h-5 w-5 ${satelite.cargando ? "animate-pulse" : ""}`} aria-hidden="true" />
          </button>
          <button type="button" className="control-3d" onClick={() => escena.current?.alNorte()} aria-label="Orientar al norte">
            <span ref={brujula} className="grid place-items-center">
              <Navigation2 className="h-5 w-5 fill-cereza-viva text-cereza-viva" aria-hidden="true" />
            </span>
          </button>
          <button type="button" className="control-3d" onClick={() => escena.current?.verDesdeArriba()} aria-label="Ver desde arriba">
            <ScanLine className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className="control-3d" onClick={() => escena.current?.reiniciarVista()} aria-label="Volver a la vista inicial">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {(listo || estado === "listo-2d") && (
        <ul className="sr-only">
          {lotes.map((l) => (
            <li key={l.id}>
              Lote {l.nombre}: {ESTADOS[l.estado] ?? "sin estado"}
              {l.areaHa ? `, ${num(l.areaHa)} hectáreas` : ""}
            </li>
          ))}
        </ul>
      )}

      {children}

      <p className="atribucion-3d absolute bottom-2 left-3 max-w-[70%]">
        <a href={ATRIBUCION_RELIEVE.url} target="_blank" rel="noreferrer">
          {ATRIBUCION_RELIEVE.texto}
        </a>
        {satelite.activo && (
          <>
            {" · "}
            <a href={ATRIBUCION_SATELITE.url} target="_blank" rel="noreferrer">
              {ATRIBUCION_SATELITE.texto} (CC BY-NC-SA 4.0)
            </a>
          </>
        )}
      </p>
    </div>
  );
}
