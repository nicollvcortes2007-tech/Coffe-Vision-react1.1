import { useEffect, useState } from "react";

/*
  Clima de Open-Meteo (https://open-meteo.com, datos CC BY 4.0: la atribución se
  muestra junto al pronóstico). Responde desde el navegador, sin clave y con CORS.
  La última respuesta se guarda en localStorage: sin señal se muestra con su hora.
*/

const BASE = "https://api.open-meteo.com/v1/forecast";
const VIGENCIA_MS = 60 * 60 * 1000;
const PREFIJO = "cv:clima:";

const DIARIAS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "relative_humidity_2m_mean",
  "et0_fao_evapotranspiration",
];

export function urlPronostico(lat, lon) {
  const parametros = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    daily: DIARIAS.join(","),
    current: "temperature_2m,relative_humidity_2m,precipitation,weather_code",
    timezone: "America/Bogota",
    past_days: "30",
    forecast_days: "7",
  });
  return `${BASE}?${parametros}`;
}

/* Códigos WMO → texto corto en español y tipo de ícono. */
export function describirTiempo(codigo) {
  if (codigo === 0) return { texto: "Despejado", icono: "sol" };
  if (codigo <= 2) return { texto: "Parcialmente nublado", icono: "solNube" };
  if (codigo === 3) return { texto: "Nublado", icono: "nube" };
  if (codigo === 45 || codigo === 48) return { texto: "Niebla", icono: "niebla" };
  if (codigo >= 51 && codigo <= 57) return { texto: "Llovizna", icono: "llovizna" };
  if (codigo >= 61 && codigo <= 67) return { texto: codigo >= 65 ? "Lluvia fuerte" : "Lluvia", icono: "lluvia" };
  if (codigo >= 80 && codigo <= 82) return { texto: codigo === 82 ? "Aguacero fuerte" : "Aguaceros", icono: "lluvia" };
  if (codigo >= 95) return { texto: "Tormenta", icono: "tormenta" };
  return { texto: "Variable", icono: "nube" };
}

function normalizar(respuesta) {
  const d = respuesta.daily;
  const dias = d.time.map((fecha, i) => ({
    fecha,
    codigo: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
    lluvia: d.precipitation_sum[i] ?? 0,
    probLluvia: d.precipitation_probability_max[i],
    humedad: d.relative_humidity_2m_mean[i],
    et0: d.et0_fao_evapotranspiration[i],
  }));
  return {
    elevacion: respuesta.elevation,
    actual: {
      temperatura: respuesta.current?.temperature_2m,
      humedad: respuesta.current?.relative_humidity_2m,
      lluvia: respuesta.current?.precipitation,
      codigo: respuesta.current?.weather_code,
      hora: respuesta.current?.time,
    },
    dias,
  };
}

function leerCache(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || "null");
  } catch {
    return null;
  }
}

export async function obtenerClima(lat, lon, { forzar = false } = {}) {
  const clave = `${PREFIJO}${lat.toFixed(2)},${lon.toFixed(2)}`;
  const guardado = leerCache(clave);
  if (!forzar && guardado && Date.now() - guardado.guardado < VIGENCIA_MS) return { ...guardado, origen: "cache" };
  try {
    const respuesta = await fetch(urlPronostico(lat, lon));
    if (!respuesta.ok) throw new Error(`Open-Meteo respondió ${respuesta.status}`);
    const datos = { guardado: Date.now(), clima: normalizar(await respuesta.json()) };
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
    } catch {
      // Sin espacio: se usa sin guardar.
    }
    return { ...datos, origen: "red" };
  } catch (error) {
    if (guardado) return { ...guardado, origen: "sin-conexion", error: error.message };
    throw error;
  }
}

export function useClima(lat, lon) {
  const [estado, setEstado] = useState({ cargando: true, datos: null, error: null });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setEstado({ cargando: false, datos: null, error: "La finca no tiene coordenadas." });
      return undefined;
    }
    let vigente = true;
    setEstado((anterior) => ({ ...anterior, cargando: true }));
    obtenerClima(lat, lon, { forzar: version > 0 })
      .then((datos) => vigente && setEstado({ cargando: false, datos, error: null }))
      .catch((error) => vigente && setEstado({ cargando: false, datos: null, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [lat, lon, version]);
  return { ...estado, actualizar: () => setVersion((v) => v + 1) };
}
