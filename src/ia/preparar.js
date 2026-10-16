import { LADO, LADO_CORTO, LUZ, MIN_VARIANZA_BORDES } from "./modelo.js";

/*
  Prepara una foto igual que predict.py del autor: lado corto a 256 px, recorte
  central de 224, tensor RGB 0..255 NHWC. Mide además la calidad (nitidez y luz)
  antes de inferir. La interpolación del canvas es de alta calidad, no bicúbica
  exacta de Pillow: la diferencia es pequeña y se asume.
*/

// Luminancia entera de Pillow (modo «L»).
const gris = (r, g, b) => (19595 * r + 38470 * g + 7471 * b + 32768) >> 16;

export function calidadDesdePixeles(pixeles, ancho = LADO, alto = LADO) {
  const lum = new Float32Array(ancho * alto);
  let suma = 0;
  let brillantes = 0;
  for (let i = 0, p = 0; i < lum.length; i += 1, p += 4) {
    const valor = gris(pixeles[p], pixeles[p + 1], pixeles[p + 2]);
    lum[i] = valor;
    suma += valor;
    if (valor >= LUZ.brillo) brillantes += 1;
  }
  const media = suma / lum.length;
  const fraccionBrillantes = brillantes / lum.length;

  // Varianza del laplaciano de 4 vecinos sobre el interior (como predict.py).
  let n = 0;
  let mediaLap = 0;
  let m2 = 0;
  for (let y = 1; y < alto - 1; y += 1) {
    for (let x = 1; x < ancho - 1; x += 1) {
      const i = y * ancho + x;
      const lap = lum[i] * 4 - lum[i - ancho] - lum[i + ancho] - lum[i - 1] - lum[i + 1];
      n += 1;
      const delta = lap - mediaLap;
      mediaLap += delta / n;
      m2 += delta * (lap - mediaLap);
    }
  }
  const varianzaBordes = n ? m2 / n : 0;

  let luz = "buena";
  if (media < LUZ.minimo) luz = "oscura";
  else if (media > LUZ.maximo && fraccionBrillantes > LUZ.fraccionBrillosMaxima) luz = "quemada";

  return {
    media,
    fraccionBrillantes,
    varianzaBordes,
    nitida: varianzaBordes >= MIN_VARIANZA_BORDES,
    luz,
    aceptable: varianzaBordes >= MIN_VARIANZA_BORDES && luz === "buena",
  };
}

export function tensorDesdePixeles(pixeles) {
  const tensor = new Float32Array(LADO * LADO * 3);
  for (let i = 0, p = 0, t = 0; i < LADO * LADO; i += 1, p += 4, t += 3) {
    tensor[t] = pixeles[p];
    tensor[t + 1] = pixeles[p + 1];
    tensor[t + 2] = pixeles[p + 2];
  }
  return tensor;
}

/* Lee un archivo de imagen respetando la orientación EXIF y devuelve el recorte 224×224. */
export async function prepararFoto(archivo) {
  const mapa = await createImageBitmap(archivo, { imageOrientation: "from-image" });
  const escala = LADO_CORTO / Math.min(mapa.width, mapa.height);
  const ancho = Math.floor(mapa.width * escala);
  const alto = Math.floor(mapa.height * escala);
  const izquierda = Math.floor((ancho - LADO) / 2 + 0.5);
  const arriba = Math.floor((alto - LADO) / 2 + 0.5);

  const lienzo = document.createElement("canvas");
  lienzo.width = LADO;
  lienzo.height = LADO;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(mapa, -izquierda, -arriba, ancho, alto);
  mapa.close?.();

  const { data } = ctx.getImageData(0, 0, LADO, LADO);
  const miniatura = lienzo.toDataURL("image/jpeg", 0.72);
  return { tensor: tensorDesdePixeles(data), calidad: calidadDesdePixeles(data), miniatura };
}
