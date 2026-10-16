import { lonLatATesela, teselaALonLat } from "./terreno.js";

/*
  Imagen satelital Sentinel-2 cloudless (EOX), 10 m por píxel. Licencia CC BY-NC-SA 4.0:
  uso no comercial (proyecto académico del SENA) con la atribución visible.
*/
export const ATRIBUCION_SATELITE = {
  texto: "Imagen: Sentinel-2 cloudless 2024 de EOX IT Services GmbH (contiene datos Copernicus Sentinel modificados, 2024)",
  url: "https://cloudless.eox.at",
};

const URL = (z, x, y) => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/g/${z}/${y}/${x}.jpg`;

async function imagen(url, senal) {
  const respuesta = await fetch(url, { signal: senal, cache: "force-cache", mode: "cors" });
  if (!respuesta.ok) throw new Error(`Satélite ${respuesta.status}`);
  return createImageBitmap(await respuesta.blob());
}

/* Compone las teselas que cubren los límites del relieve en un canvas cuadrado. */
export async function cargarSatelite({ limites, z = 15, tam = 1024, senal }) {
  const a = lonLatATesela(limites.oeste, limites.norte, z);
  const b = lonLatATesela(limites.este, limites.sur, z);
  const lienzo = document.createElement("canvas");
  lienzo.width = tam;
  lienzo.height = tam;
  const ctx = lienzo.getContext("2d");
  const aPx = (lon, lat) => [((lon - limites.oeste) / (limites.este - limites.oeste)) * tam, ((limites.norte - lat) / (limites.norte - limites.sur)) * tam];
  const tareas = [];
  for (let x = Math.floor(a.x); x <= Math.floor(b.x); x += 1) {
    for (let y = Math.floor(a.y); y <= Math.floor(b.y); y += 1) {
      tareas.push(
        imagen(URL(z, x, y), senal).then((bmp) => {
          const no = teselaALonLat(x, y, z);
          const se = teselaALonLat(x + 1, y + 1, z);
          const [x0, y0] = aPx(no.lon, no.lat);
          const [x1, y1] = aPx(se.lon, se.lat);
          ctx.drawImage(bmp, x0, y0, x1 - x0, y1 - y0);
          bmp.close?.();
        }),
      );
    }
  }
  await Promise.all(tareas);
  return lienzo;
}
