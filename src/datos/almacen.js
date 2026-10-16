import { useSyncExternalStore } from "react";
import { COLECCIONES, VERSION_DATOS, MIGRACIONES, ORDEN_VERSIONES } from "./esquema.js";
import { generarSemilla } from "./semilla.js";

/*
  Almacén local de Coffee+Visión. No hay servidor: cada colección vive en
  localStorage y este módulo es la única puerta de lectura y escritura. Las vistas
  se suscriben con useDatos() y se vuelven a pintar cuando algo cambia.

  Reglas:
  - Nunca se vuelve a sembrar sobre datos existentes.
  - Antes de migrar de versión se guarda una copia completa (respaldo automático).
  - Una clave ilegible se aparta en «<clave>:corrupto» antes de seguir.
*/

const PREFIJO = "cv:";
const CLAVE_VERSION = `${PREFIJO}version`;
const CLAVE_RESPALDO = `${PREFIJO}respaldo-automatico`;
const EVENTO = "cv-datos";

const oyentes = new Set();
let instantanea = null;

const clave = (nombre) => `${PREFIJO}${nombre}`;

function leer(nombre) {
  let crudo = null;
  try {
    crudo = localStorage.getItem(clave(nombre));
    if (!crudo) return [];
    const valor = JSON.parse(crudo);
    if (Array.isArray(valor)) return valor.filter((item) => item && typeof item === "object");
    throw new TypeError("no es una lista");
  } catch (error) {
    console.error(`No se pudo leer ${nombre}; se guardó una copia aparte.`, error);
    try {
      if (crudo && localStorage.getItem(`${clave(nombre)}:corrupto`) === null) {
        localStorage.setItem(`${clave(nombre)}:corrupto`, crudo);
      }
    } catch {
      // Sin espacio: queda el aviso en consola.
    }
    return [];
  }
}

function escribir(nombre, lista) {
  localStorage.setItem(clave(nombre), JSON.stringify(lista));
}

function construir() {
  const datos = {};
  for (const nombre of COLECCIONES) datos[nombre] = leer(nombre);
  return datos;
}

function hayDatos() {
  return COLECCIONES.some((nombre) => localStorage.getItem(clave(nombre)) !== null);
}

function emitir() {
  instantanea = construir();
  oyentes.forEach((oyente) => oyente());
}

function migrar() {
  const guardada = JSON.parse(localStorage.getItem(CLAVE_VERSION) || "null");
  if (guardada === VERSION_DATOS) return;
  const datos = construir();
  try {
    localStorage.setItem(CLAVE_RESPALDO, JSON.stringify({ version: guardada, fecha: new Date().toISOString(), datos }));
  } catch {
    // Si no cabe el respaldo, se migra igual: las migraciones no borran datos.
  }
  let version = guardada;
  let resultado = datos;
  while (version !== VERSION_DATOS) {
    const indice = ORDEN_VERSIONES.indexOf(version);
    if (indice === -1 || indice === ORDEN_VERSIONES.length - 1) break;
    const paso = MIGRACIONES[version];
    if (paso) resultado = paso(resultado);
    version = ORDEN_VERSIONES[indice + 1];
  }
  for (const nombre of COLECCIONES) escribir(nombre, resultado[nombre] ?? []);
  localStorage.setItem(CLAVE_VERSION, JSON.stringify(VERSION_DATOS));
}

export function inicializarDatos({ forzar = false } = {}) {
  if (forzar || !hayDatos()) {
    const semilla = generarSemilla();
    for (const nombre of COLECCIONES) escribir(nombre, semilla[nombre] ?? []);
    localStorage.setItem(CLAVE_VERSION, JSON.stringify(VERSION_DATOS));
  } else {
    migrar();
  }
  emitir();
}

export function vaciarDatos() {
  for (const nombre of COLECCIONES) escribir(nombre, []);
  localStorage.setItem(CLAVE_VERSION, JSON.stringify(VERSION_DATOS));
  emitir();
}

function suscribir(oyente) {
  oyentes.add(oyente);
  const alCambiarOtraPestana = (evento) => {
    if (evento.key?.startsWith(PREFIJO)) emitir();
  };
  window.addEventListener("storage", alCambiarOtraPestana);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

function obtener() {
  if (!instantanea) instantanea = construir();
  return instantanea;
}

export function useDatos() {
  return useSyncExternalStore(suscribir, obtener);
}

export function leerDatos() {
  return obtener();
}

export function nuevoId(prefijo) {
  const azar = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  return `${prefijo}-${Date.now().toString(36)}${azar}`;
}

export function crear(nombre, registro, prefijo = nombre.slice(0, 3)) {
  const item = { id: nuevoId(prefijo), creado: new Date().toISOString(), ...registro };
  escribir(nombre, [item, ...leer(nombre)]);
  emitir();
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { nombre, accion: "crear", item } }));
  return item;
}

export function actualizar(nombre, id, cambios) {
  let actualizado = null;
  const lista = leer(nombre).map((item) => {
    if (item.id !== id) return item;
    actualizado = { ...item, ...cambios, editado: new Date().toISOString() };
    return actualizado;
  });
  if (!actualizado) return null;
  escribir(nombre, lista);
  emitir();
  return actualizado;
}

export function eliminar(nombre, id) {
  const lista = leer(nombre);
  const restante = lista.filter((item) => item.id !== id);
  if (restante.length === lista.length) return false;
  escribir(nombre, restante);
  emitir();
  return true;
}

export function reemplazarColeccion(nombre, lista) {
  escribir(nombre, lista);
  emitir();
}

/* Respaldo manual: el usuario descarga un JSON y puede restaurarlo en otro equipo. */
export function exportarRespaldo() {
  return JSON.stringify({ app: "coffee-vision", version: VERSION_DATOS, fecha: new Date().toISOString(), datos: construir() }, null, 2);
}

export function validarRespaldo(texto) {
  let contenido;
  try {
    contenido = JSON.parse(texto);
  } catch {
    return { ok: false, error: "El archivo no es un JSON válido." };
  }
  if (contenido?.app !== "coffee-vision" || typeof contenido.datos !== "object") {
    return { ok: false, error: "El archivo no es un respaldo de Coffee+Visión." };
  }
  const desconocidas = Object.keys(contenido.datos).filter((nombre) => !COLECCIONES.includes(nombre));
  if (desconocidas.length) return { ok: false, error: `El respaldo trae colecciones desconocidas: ${desconocidas.join(", ")}.` };
  for (const [nombre, lista] of Object.entries(contenido.datos)) {
    if (!Array.isArray(lista)) return { ok: false, error: `La colección ${nombre} no es una lista.` };
  }
  return { ok: true, contenido };
}

export function restaurarRespaldo(texto) {
  const resultado = validarRespaldo(texto);
  if (!resultado.ok) return resultado;
  const { contenido } = resultado;
  localStorage.setItem(CLAVE_RESPALDO, JSON.stringify({ version: VERSION_DATOS, fecha: new Date().toISOString(), datos: construir() }));
  for (const nombre of COLECCIONES) escribir(nombre, contenido.datos[nombre] ?? []);
  localStorage.setItem(CLAVE_VERSION, JSON.stringify(contenido.version ?? VERSION_DATOS));
  migrar();
  emitir();
  return { ok: true };
}
