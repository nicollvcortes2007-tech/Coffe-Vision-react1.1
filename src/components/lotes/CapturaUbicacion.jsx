import { useEffect, useRef, useState } from "react";
import { Crosshair, MapPin, Undo2, Footprints, CircleCheck } from "lucide-react";
import { areaHa, seAutointersecta, HA_POLIGONO } from "@/utilidades/geo";
import { num } from "@/utilidades/formato";

/*
  Ubicación del lote sin mapa ni señal: el GPS del celular funciona sin datos.
  - Punto: una lectura en el centro del lote.
  - Contorno: se camina el borde y se marca cada esquina con un toque.
  El dibujo de abajo es la forma real proyectada, para revisar que tenga sentido.
*/

function Forma({ puntos }) {
  if (puntos.length < 2) return null;
  const lons = puntos.map((p) => p[0]);
  const lats = puntos.map((p) => p[1]);
  const [minLon, maxLon, minLat, maxLat] = [Math.min(...lons), Math.max(...lons), Math.min(...lats), Math.max(...lats)];
  const escalaLon = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const ancho = Math.max((maxLon - minLon) * escalaLon, 1e-9);
  const alto = Math.max(maxLat - minLat, 1e-9);
  const escala = 180 / Math.max(ancho, alto);
  const xy = puntos.map(([lon, lat]) => [10 + (lon - minLon) * escalaLon * escala, 10 + (maxLat - lat) * escala]);
  const camino = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + (puntos.length > 2 ? " Z" : "");
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44" role="img" aria-label={`Contorno con ${puntos.length} esquinas`}>
      <rect width="200" height="200" rx="16" fill="#EBEBE6" />
      <path d={camino} fill="#FFC21A" fillOpacity=".55" stroke="#111210" strokeWidth="2.5" strokeLinejoin="round" />
      {xy.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={i === xy.length - 1 ? "#C3121B" : "#111210"} />
      ))}
    </svg>
  );
}

export default function CapturaUbicacion({ valor, areaDeclarada, alCambiar }) {
  const [modo, setModo] = useState(valor?.tipo ?? (areaDeclarada >= HA_POLIGONO ? "poligono" : "punto"));
  const [lectura, setLectura] = useState(null);
  const [error, setError] = useState(null);
  const vigilante = useRef(null);
  const puntos = valor?.tipo === "poligono" ? valor.puntos : [];

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Este navegador no da acceso al GPS.");
      return undefined;
    }
    vigilante.current = navigator.geolocation.watchPosition(
      (posicion) => {
        setError(null);
        setLectura({
          lon: posicion.coords.longitude,
          lat: posicion.coords.latitude,
          precision: posicion.coords.accuracy,
        });
      },
      (fallo) => setError(fallo.code === 1 ? "Permite el acceso a la ubicación para marcar el lote." : "Buscando señal de GPS… sal a campo abierto."),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(vigilante.current);
  }, []);

  const precisionBuena = lectura && lectura.precision <= 15;
  const marcarPunto = () => lectura && alCambiar({ tipo: "punto", punto: [lectura.lon, lectura.lat], precision: Math.round(lectura.precision) });
  const marcarEsquina = () => lectura && alCambiar({ tipo: "poligono", puntos: [...puntos, [lectura.lon, lectura.lat]] });
  const deshacerEsquina = () => alCambiar(puntos.length > 1 ? { tipo: "poligono", puntos: puntos.slice(0, -1) } : null);
  const area = areaHa(puntos);
  const cruzado = puntos.length >= 4 && seAutointersecta(puntos);

  return (
    <div className="grid gap-4">
      <div role="radiogroup" aria-label="Cómo ubicar el lote" className="grid grid-cols-2 gap-2 rounded-lg bg-cal-honda/70 p-1">
        {[
          ["punto", "Un punto", MapPin],
          ["poligono", "El contorno", Footprints],
        ].map(([id, texto, Icono]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={modo === id}
            onClick={() => {
              setModo(id);
              alCambiar(null);
            }}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-md font-bold ${modo === id ? "bg-lamina text-tinta shadow-placa" : "text-grafito"}`}
          >
            <Icono className="h-5 w-5" aria-hidden="true" /> {texto}
          </button>
        ))}
      </div>

      <p className="text-sm text-grafito">
        {modo === "punto"
          ? "Párate cerca del centro del lote y toca «Marcar aquí»."
          : "Camina el borde del lote. En cada esquina toca «Marcar esquina». Con 4 o más esquinas se calcula el área."}
        {areaDeclarada >= HA_POLIGONO && modo === "punto" && " Para lotes de 4 ha o más, los compradores piden el contorno."}
      </p>

      <p className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-[0.95rem] ${precisionBuena ? "bg-cal-honda text-tinta" : "bg-niebla text-ceniza-honda"}`} role="status">
        <Crosshair className="h-5 w-5 shrink-0" aria-hidden="true" />
        {error ?? (lectura ? `GPS: precisión de ${Math.round(lectura.precision)} m${precisionBuena ? "" : " (espera a que baje de 15 m)"}` : "Buscando señal de GPS…")}
      </p>

      {modo === "punto" ? (
        <>
          <button type="button" className="boton-primario" disabled={!lectura} onClick={marcarPunto}>
            <MapPin className="h-5 w-5" aria-hidden="true" /> Marcar aquí
          </button>
          {valor?.tipo === "punto" && (
            <p className="flex items-center gap-2 font-bold text-tinta">
              <CircleCheck className="h-5 w-5" aria-hidden="true" /> Punto guardado: {valor.punto[1].toFixed(6)}, {valor.punto[0].toFixed(6)}
            </p>
          )}
        </>
      ) : (
        <>
          <Forma puntos={puntos} />
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button type="button" className="boton-primario" disabled={!lectura} onClick={marcarEsquina}>
              <Footprints className="h-5 w-5" aria-hidden="true" /> Marcar esquina {puntos.length + 1}
            </button>
            <button type="button" className="boton-secundario px-4" disabled={!puntos.length} onClick={deshacerEsquina} aria-label="Quitar la última esquina">
              <Undo2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {puntos.length >= 3 && (
            <p className={`font-bold ${cruzado ? "text-cereza" : "text-tinta"}`}>
              {cruzado ? "El contorno se cruza: quita la última esquina y sigue el borde en orden." : `Área medida: ${num(area)} ha${areaDeclarada ? ` (declaraste ${num(areaDeclarada)} ha)` : ""}`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
