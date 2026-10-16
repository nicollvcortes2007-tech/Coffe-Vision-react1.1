import { URL_MODELO, URL_RUNTIME, LADO } from "./modelo.js";

/*
  Carga diferida del runtime (LiteRT.js en WebAssembly, solo CPU) y del modelo.
  Nada de esto se descarga hasta que la persona pide analizar una foto. Después
  queda guardado por el service worker y funciona sin señal.
*/

let promesaModelo = null;

async function cargar() {
  const { loadLiteRt, loadAndCompile } = await import("@litertjs/core");
  await loadLiteRt(URL_RUNTIME);
  return loadAndCompile(URL_MODELO, { accelerator: "wasm" });
}

export function prepararMotor() {
  if (!promesaModelo) {
    promesaModelo = cargar().catch((error) => {
      promesaModelo = null;
      throw error;
    });
  }
  return promesaModelo;
}

export async function clasificar(tensorDatos) {
  const modelo = await prepararMotor();
  const { Tensor } = await import("@litertjs/core");
  const entrada = new Tensor(tensorDatos, [1, LADO, LADO, 3]);
  let salidas = [];
  try {
    salidas = await modelo.run(entrada);
    const salida = await salidas[0].moveTo("wasm");
    const probabilidades = Float32Array.from(salida.toTypedArray());
    salida.delete();
    return probabilidades;
  } finally {
    entrada.delete();
    for (const tensor of salidas) {
      try {
        tensor.delete();
      } catch {
        // Ya movido o liberado.
      }
    }
  }
}

/* ¿Está el modelo ya guardado para usarse sin señal? */
export async function modeloEnCache() {
  if (!("caches" in window)) return false;
  try {
    const cache = await caches.open("cv-ia-v1");
    return Boolean(await cache.match(URL_MODELO));
  } catch {
    return false;
  }
}
