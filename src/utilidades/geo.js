/*
  Geolocalización de lotes con el formato que pide la cadena para la EUDR
  (Reglamento UE 2023/1115): GeoJSON WGS-84, coordenadas [longitud, latitud] con
  6 decimales, punto para lotes pequeños y polígono cerrado para los grandes.
  La UE exige polígono por encima de 4 ha; Rainforest Alliance desde 4 ha: se pide
  desde 4 ha para cubrir ambos.
*/

export const HA_POLIGONO = 4;
const RADIO_TIERRA = 6_378_137;
const rad = (grados) => (grados * Math.PI) / 180;
const seis = (valor) => Math.round(valor * 1e6) / 1e6;

/* Área geodésica aproximada (método de Chamberlain y Duquette, el de Turf.js), en ha. */
export function areaHa(puntos) {
  if (!puntos || puntos.length < 3) return 0;
  let suma = 0;
  for (let i = 0; i < puntos.length; i += 1) {
    const [lon1, lat1] = puntos[i];
    const [lon2, lat2] = puntos[(i + 1) % puntos.length];
    suma += rad(lon2 - lon1) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
  }
  return Math.abs((suma * RADIO_TIERRA * RADIO_TIERRA) / 2) / 10_000;
}

export function centroide(puntos) {
  if (!puntos?.length) return null;
  const [sumLon, sumLat] = puntos.reduce(([a, b], [lon, lat]) => [a + lon, b + lat], [0, 0]);
  return [sumLon / puntos.length, sumLat / puntos.length];
}

function cruzan(a, b, c, d) {
  const orientacion = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return orientacion(a, b, c) !== orientacion(a, b, d) && orientacion(c, d, a) !== orientacion(c, d, b);
}

/* El polígono no debe cruzarse consigo mismo (TRACES lo rechaza). */
export function seAutointersecta(puntos) {
  const n = puntos.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      if (cruzan(puntos[i], puntos[(i + 1) % n], puntos[j], puntos[(j + 1) % n])) return true;
    }
  }
  return false;
}

export function validarGeometria(lote) {
  const problemas = [];
  const geo = lote.geometria;
  if (!geo) {
    problemas.push("El lote no tiene ubicación.");
    return problemas;
  }
  if (geo.tipo === "punto" && (lote.areaHa ?? 0) >= HA_POLIGONO) {
    problemas.push(`Con ${lote.areaHa} ha la cadena pide el contorno del lote (polígono), no solo un punto.`);
  }
  if (geo.tipo === "poligono") {
    if (geo.puntos.length < 4) problemas.push("El contorno necesita al menos 4 puntos.");
    if (seAutointersecta(geo.puntos)) problemas.push("El contorno se cruza consigo mismo: revisa el orden de los puntos.");
  }
  return problemas;
}

export function aFeature(lote, finca) {
  const geo = lote.geometria;
  const geometry =
    geo.tipo === "punto"
      ? { type: "Point", coordinates: [seis(geo.punto[0]), seis(geo.punto[1])] }
      : {
          type: "Polygon",
          coordinates: [[...geo.puntos, geo.puntos[0]].map(([lon, lat]) => [seis(lon), seis(lat)])],
        };
  return {
    type: "Feature",
    geometry,
    properties: {
      ProducerName: finca?.propietario ?? null,
      ProducerCountry: "CO",
      ProductionPlace: `${finca?.nombre ?? ""} · ${lote.nombre}`.trim(),
      Area: Number((lote.areaHa ?? 0).toFixed(4)),
      Variedad: lote.variedad ?? null,
      EstablecidoAntesDe2021: lote.antesDe2021 ?? "desconocido",
      Municipio: finca?.municipio ?? null,
      Departamento: finca?.departamento ?? null,
    },
  };
}

export function geojsonFinca(finca, lotes) {
  return {
    type: "FeatureCollection",
    features: lotes.filter((lote) => lote.geometria).map((lote) => aFeature(lote, finca)),
  };
}

/* Coordenadas que salen a servicios externos (clima): redondeadas a ~1 km. */
export const redondearParaTerceros = (valor) => Math.round(valor * 100) / 100;
