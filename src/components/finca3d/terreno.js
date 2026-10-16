/*
  Relieve real alrededor de la finca a partir de las teselas de elevación
  «Terrarium» de AWS Open Data (Mapzen/Tilezen): PNG de 256 px donde
  altura = R·256 + G + B/256 − 32768 metros. Responden con CORS abierto y sin clave.
  Atribución: datos de elevación de AWS Terrain Tiles (SRTM, GMTED, ETOPO1 y otras
  fuentes; ver https://github.com/tilezen/joerd/blob/master/docs/attribution.md).
*/

export const URL_TESELAS = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";
export const ATRIBUCION_RELIEVE = {
  texto: "Relieve: AWS Terrain Tiles (Mapzen/Tilezen); SRTM, cortesía del U.S. Geological Survey",
  url: "https://github.com/tilezen/joerd/blob/master/docs/attribution.md",
};

const RADIO = 6378137;

export function lonLatATesela(lon, lat, z) {
  const n = 2 ** z;
  const x = ((lon + 180) / 360) * n;
  const r = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n;
  return { x, y };
}

export function teselaALonLat(x, y, z) {
  const n = 2 ** z;
  const lon = (x / n) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  return { lon, lat };
}

/* Metros por grado en la latitud de la finca (proyección local equirectangular). */
export function escalaLocal(lat) {
  const mLat = (Math.PI / 180) * RADIO;
  return { mLon: mLat * Math.cos((lat * Math.PI) / 180), mLat };
}

async function decodificar(blob) {
  const mapa = await createImageBitmap(blob);
  const lienzo = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(256, 256) : Object.assign(document.createElement("canvas"), { width: 256, height: 256 });
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(mapa, 0, 0);
  mapa.close?.();
  const { data } = ctx.getImageData(0, 0, 256, 256);
  const alturas = new Float32Array(256 * 256);
  for (let i = 0, p = 0; i < alturas.length; i += 1, p += 4) alturas[i] = data[p] * 256 + data[p + 1] + data[p + 2] / 256 - 32768;
  return alturas;
}

async function traerTesela(z, x, y, senal) {
  const url = `${URL_TESELAS}/${z}/${x}/${y}.png`;
  // El service worker las guarda en «cv-relieve-v1» para verlas sin señal.
  const respuesta = await fetch(url, { signal: senal, cache: "force-cache", mode: "cors" });
  if (!respuesta.ok) throw new Error(`Tesela ${z}/${x}/${y}: ${respuesta.status}`);
  return decodificar(await respuesta.blob());
}

/*
  Relieve a partir de una grilla de `lado` × `lado` alturas (metros) que cubre
  `extension` metros por lado, centrada en la finca. Expone las funciones para pasar
  de lon/lat a coordenadas locales (metros, x hacia el este y z hacia el sur) y para
  leer la altura en cualquier punto (interpolación bilineal sobre la grilla).
*/
export function crearRelieve({ alturas, lado, extension, lat, lon }) {
  const { mLon, mLat } = escalaLocal(lat);
  const medio = extension / 2;
  const limites = { oeste: lon - medio / mLon, este: lon + medio / mLon, norte: lat + medio / mLat, sur: lat - medio / mLat };
  let minimo = Infinity;
  let maximo = -Infinity;
  for (const h of alturas) {
    if (h < minimo) minimo = h;
    if (h > maximo) maximo = h;
  }
  const alturaEn = (lonP, latP) => {
    const fi = Math.min(lado - 1, Math.max(0, ((lonP - limites.oeste) / (limites.este - limites.oeste)) * (lado - 1)));
    const fj = Math.min(lado - 1, Math.max(0, ((limites.norte - latP) / (limites.norte - limites.sur)) * (lado - 1)));
    const i = Math.min(lado - 2, Math.floor(fi));
    const j = Math.min(lado - 2, Math.floor(fj));
    const fx = fi - i;
    const fy = fj - j;
    const v = (x, y) => alturas[y * lado + x];
    return (v(i, j) * (1 - fx) + v(i + 1, j) * fx) * (1 - fy) + (v(i, j + 1) * (1 - fx) + v(i + 1, j + 1) * fx) * fy;
  };
  const aLocal = (lonP, latP) => ({ x: (lonP - lon) * mLon, z: -(latP - lat) * mLat });
  const aLonLat = (x, zLocal) => ({ lon: lon + x / mLon, lat: lat - zLocal / mLat });
  return { alturas, lado, extension, minimo, maximo, limites, centro: { lat, lon }, aLocal, aLonLat, alturaEn };
}

// Relieves ya cargados en esta sesión: volver a una pantalla no repite la descarga.
const memoria = new Map();

/* Mapa de alturas desde las teselas de AWS (2 a 4 teselas de 256 px a z13). */
export async function cargarRelieve({ lat, lon, extension = 2000, lado = 160, z = 13, senal } = {}) {
  const clave = `${lat.toFixed(5)},${lon.toFixed(5)},${extension},${lado},${z}`;
  if (memoria.has(clave)) return memoria.get(clave);
  const { mLon, mLat } = escalaLocal(lat);
  const medio = extension / 2;
  const limites = { oeste: lon - medio / mLon, este: lon + medio / mLon, norte: lat + medio / mLat, sur: lat - medio / mLat };
  const a = lonLatATesela(limites.oeste, limites.norte, z);
  const b = lonLatATesela(limites.este, limites.sur, z);
  const x0 = Math.floor(a.x);
  const y0 = Math.floor(a.y);
  const x1 = Math.floor(b.x);
  const y1 = Math.floor(b.y);
  const teselas = new Map();
  await Promise.all(
    [...Array(x1 - x0 + 1).keys()].flatMap((dx) =>
      [...Array(y1 - y0 + 1).keys()].map(async (dy) => {
        teselas.set(`${x0 + dx}/${y0 + dy}`, await traerTesela(z, x0 + dx, y0 + dy, senal));
      }),
    ),
  );

  const muestra = (lonP, latP) => {
    const t = lonLatATesela(lonP, latP, z);
    const tx = Math.floor(t.x);
    const ty = Math.floor(t.y);
    const datos = teselas.get(`${tx}/${ty}`);
    if (!datos) return 0;
    const px = Math.min(255, Math.max(0, (t.x - tx) * 256));
    const py = Math.min(255, Math.max(0, (t.y - ty) * 256));
    const ix = Math.floor(px);
    const iy = Math.floor(py);
    const fx = px - ix;
    const fy = py - iy;
    const v = (xx, yy) => datos[Math.min(255, yy) * 256 + Math.min(255, xx)];
    return (v(ix, iy) * (1 - fx) + v(ix + 1, iy) * fx) * (1 - fy) + (v(ix, iy + 1) * (1 - fx) + v(ix + 1, iy + 1) * fx) * fy;
  };

  const alturas = new Float32Array(lado * lado);
  for (let j = 0; j < lado; j += 1) {
    const latP = limites.norte - ((limites.norte - limites.sur) * j) / (lado - 1);
    for (let i = 0; i < lado; i += 1) {
      const lonP = limites.oeste + ((limites.este - limites.oeste) * i) / (lado - 1);
      alturas[j * lado + i] = muestra(lonP, latP);
    }
  }
  const relieve = crearRelieve({ alturas, lado, extension, lat, lon });
  memoria.set(clave, relieve);
  return relieve;
}

/*
  Relieve «horneado» para la landing: la misma grilla guardada como PNG en formato
  terrarium (altura = R·256 + G + B/256 − 32768), sin depender de la red de AWS.
*/
export async function cargarRelieveHorneado({ url, lat, lon, extension, senal }) {
  const clave = url;
  if (memoria.has(clave)) return memoria.get(clave);
  const respuesta = await fetch(url, { signal: senal });
  if (!respuesta.ok) throw new Error(`Relieve horneado: ${respuesta.status}`);
  const mapa = await createImageBitmap(await respuesta.blob());
  const lado = mapa.width;
  const lienzo = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(lado, lado) : Object.assign(document.createElement("canvas"), { width: lado, height: lado });
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(mapa, 0, 0);
  mapa.close?.();
  const { data } = ctx.getImageData(0, 0, lado, lado);
  const alturas = new Float32Array(lado * lado);
  for (let i = 0, p = 0; i < alturas.length; i += 1, p += 4) alturas[i] = data[p] * 256 + data[p + 1] + data[p + 2] / 256 - 32768;
  const relieve = crearRelieve({ alturas, lado, extension, lat, lon });
  memoria.set(clave, relieve);
  return relieve;
}

/* ¿El punto [lon, lat] está dentro del polígono? (rayo). */
export function dentro(punto, poligono) {
  let adentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i, i += 1) {
    const [xi, yi] = poligono[i];
    const [xj, yj] = poligono[j];
    if (yi > punto[1] !== yj > punto[1] && punto[0] < ((xj - xi) * (punto[1] - yi)) / (yj - yi) + xi) adentro = !adentro;
  }
  return adentro;
}
