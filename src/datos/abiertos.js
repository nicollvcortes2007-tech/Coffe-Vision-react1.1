import { useEffect, useState } from "react";

/*
  Datos abiertos que responden desde el navegador, sin clave y con CORS
  (verificado el 2026-10-15). Cada respuesta se guarda para verla sin señal.
  - TRM: Superfinanciera en datos.gov.co (conjunto 32sa-8pi3, CC BY-SA 4.0).
  - Área y producción de café por municipio: EVA de la UPRA en datos.gov.co
    (conjunto uejq-wxrr, CC BY-SA 4.0).
  - Altitud: Open-Meteo Elevation (Copernicus DEM GLO-90, CC BY 4.0).
  El precio interno de la FNC no tiene API y sus términos prohíben extraerlo:
  lo escribe el administrador con la fecha y el enlace (colección «precios»).
*/

const SODA = "https://www.datos.gov.co/resource";

async function conCache(clave, vigenciaMs, traer) {
  let guardado;
  try {
    guardado = JSON.parse(localStorage.getItem(clave) || "null");
  } catch {
    guardado = null;
  }
  if (guardado && Date.now() - guardado.guardado < vigenciaMs) return { ...guardado, origen: "cache" };
  try {
    const valor = await traer();
    const datos = { guardado: Date.now(), valor };
    try {
      localStorage.setItem(clave, JSON.stringify(datos));
    } catch {
      // Sin espacio: se usa sin guardar.
    }
    return { ...datos, origen: "red" };
  } catch (error) {
    if (guardado) return { ...guardado, origen: "sin-conexion" };
    throw error;
  }
}

async function json(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`);
  return respuesta.json();
}

export function obtenerTRM() {
  return conCache("cv:abiertos:trm", 6 * 3_600_000, async () => {
    const filas = await json(`${SODA}/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=2`);
    return filas.map((fila) => ({ valor: Number(fila.valor), fecha: fila.vigenciadesde.slice(0, 10) }));
  });
}

export function obtenerCafeMunicipios(departamento = "Cauca") {
  return conCache(`cv:abiertos:eva:${departamento}`, 7 * 86_400_000, async () => {
    const anio = await json(
      `${SODA}/uejq-wxrr.json?$select=max(a_o)%20as%20anio&$where=upper(cultivo)%20like%20'CAF%25'%20AND%20departamento='${encodeURIComponent(departamento)}'`,
    );
    const ultimo = anio[0]?.anio;
    const filas = await json(
      `${SODA}/uejq-wxrr.json?$select=municipio,sum(rea_sembrada)%20as%20area,sum(rea_cosechada)%20as%20cosechada,sum(producci_n)%20as%20produccion&$where=upper(cultivo)%20like%20'CAF%25'%20AND%20departamento='${encodeURIComponent(
        departamento,
      )}'%20AND%20a_o='${ultimo}'&$group=municipio&$order=area%20DESC&$limit=60`,
    );
    return {
      anio: ultimo,
      municipios: filas.map((fila) => ({
        municipio: fila.municipio,
        area: Number(fila.area),
        cosechada: Number(fila.cosechada),
        produccion: Number(fila.produccion),
      })),
    };
  });
}

export async function obtenerAltitud(lat, lon) {
  const datos = await json(`https://api.open-meteo.com/v1/elevation?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}`);
  return datos.elevation?.[0] ?? null;
}

export function useAbierto(traer, dependencias = []) {
  const [estado, setEstado] = useState({ cargando: true, datos: null, error: null });
  useEffect(() => {
    let vigente = true;
    traer()
      .then((datos) => vigente && setEstado({ cargando: false, datos, error: null }))
      .catch((error) => vigente && setEstado({ cargando: false, datos: null, error: error.message }));
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);
  return estado;
}
