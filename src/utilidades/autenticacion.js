import { useSyncExternalStore } from "react";
import { protegerClave, verificarClave, problemaDeClave } from "./claves.js";

/*
  Autenticación local. Las cuentas viven en este navegador para poder probar los
  dos roles sin servidor. No es seguridad de producción: quien tenga acceso al
  navegador puede leer y cambiar localStorage. Lo que sí se cuida: contraseñas
  con hash, freno de intentos fallidos, sesión que vence y rutas protegidas.
*/

const CLAVE_CUENTAS = "cv:cuentas";
const CLAVE_SESION = "cv:sesion";
const CLAVE_INTENTOS = "cv:intentos";
const EVENTO = "cv-sesion";

const HORAS_SESION = 12;
const DIAS_RECORDAR = 30;
const MAX_INTENTOS = 5;
const ESPERA_SEGUNDOS = 60;

export const ROLES = {
  caficultor: { id: "caficultor", nombre: "Caficultor", inicio: "/finca" },
  administrador: { id: "administrador", nombre: "Administrador", inicio: "/admin" },
};

// Cuentas de prueba (contraseña «Cafetal2026», documentada en el README).
// Aquí solo queda su hash.
export const CUENTAS_INICIALES = [
  {
    id: "usr-caficultor",
    nombre: "Rosa Elena Muñoz",
    correo: "caficultor@coffeevision.test",
    telefono: "+57 310 000 0000",
    rol: "caficultor",
    fincaId: "fin-esperanza",
    activa: true,
    clave: {
      alg: "PBKDF2-SHA256",
      it: 310000,
      sal: "b06e4d25b9f6e48791f3a9177e63f789",
      hash: "15b23335d12e0d9442c47748363454af8d59b0ef4e9e349a97b0ab0f9b6c9a7b",
    },
    creado: "2026-01-15T14:00:00.000Z",
  },
  {
    id: "usr-admin",
    nombre: "Equipo Coffee+Visión",
    correo: "admin@coffeevision.test",
    telefono: "",
    rol: "administrador",
    fincaId: null,
    activa: true,
    clave: {
      alg: "PBKDF2-SHA256",
      it: 310000,
      sal: "c4270682dd883d954ea7e0f9d4689110",
      hash: "1e9a5325320a1ad15cdc986f85f9d979036c2f4730ab1eaf0903828b50ab858e",
    },
    creado: "2026-01-10T14:00:00.000Z",
  },
  ...[
    ["usr-diviso", "Jesús Antonio Calambás", "eldiviso@coffeevision.test", "fin-diviso"],
    ["usr-villa-clara", "María Nelly Daza", "villaclara@coffeevision.test", "fin-villa-clara"],
    ["usr-naranjos", "Ferney Guzmán", "losnaranjos@coffeevision.test", "fin-los-naranjos"],
  ].map(([id, nombre, correo, fincaId]) => ({
    id,
    nombre,
    correo,
    telefono: "",
    rol: "caficultor",
    fincaId,
    activa: true,
    clave: {
      alg: "PBKDF2-SHA256",
      it: 310000,
      sal: "b06e4d25b9f6e48791f3a9177e63f789",
      hash: "15b23335d12e0d9442c47748363454af8d59b0ef4e9e349a97b0ab0f9b6c9a7b",
    },
    creado: "2026-03-02T14:00:00.000Z",
  })),
];

function leerJSON(almacen, clave, respaldo) {
  try {
    const crudo = almacen.getItem(clave);
    return crudo ? JSON.parse(crudo) : respaldo;
  } catch {
    return respaldo;
  }
}

function avisar() {
  window.dispatchEvent(new Event(EVENTO));
}

export function listarCuentas() {
  const cuentas = leerJSON(localStorage, CLAVE_CUENTAS, null);
  if (Array.isArray(cuentas) && cuentas.length) return cuentas;
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(CUENTAS_INICIALES));
  return CUENTAS_INICIALES;
}

function guardarCuentas(cuentas) {
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
  avisar();
}

export function cuentaPublica(cuenta) {
  if (!cuenta) return null;
  const resto = { ...cuenta };
  delete resto.clave;
  return resto;
}

function normalizarCorreo(correo) {
  return String(correo ?? "").trim().toLowerCase();
}

/* ---- Sesión ---- */

function leerSesionCruda() {
  return leerJSON(sessionStorage, CLAVE_SESION, null) ?? leerJSON(localStorage, CLAVE_SESION, null);
}

export function obtenerSesion() {
  const sesion = leerSesionCruda();
  if (!sesion) return null;
  if (Date.parse(sesion.vence) < Date.now()) {
    cerrarSesion();
    return null;
  }
  const cuenta = listarCuentas().find((item) => item.id === sesion.cuentaId);
  if (!cuenta || !cuenta.activa) {
    cerrarSesion();
    return null;
  }
  return { ...cuentaPublica(cuenta), vence: sesion.vence };
}

function abrirSesion(cuenta, recordar) {
  const horas = recordar ? DIAS_RECORDAR * 24 : HORAS_SESION;
  const sesion = { cuentaId: cuenta.id, vence: new Date(Date.now() + horas * 3_600_000).toISOString() };
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_SESION);
  (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION, JSON.stringify(sesion));
  avisar();
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_SESION);
  avisar();
}

/* ---- Intentos ---- */

function leerIntentos() {
  return leerJSON(localStorage, CLAVE_INTENTOS, { fallos: 0, hasta: 0 });
}

export function segundosDeEspera() {
  const { hasta } = leerIntentos();
  return Math.max(0, Math.ceil((hasta - Date.now()) / 1000));
}

function registrarFallo() {
  const intentos = leerIntentos();
  const fallos = intentos.fallos + 1;
  const hasta = fallos >= MAX_INTENTOS ? Date.now() + ESPERA_SEGUNDOS * 1000 : 0;
  localStorage.setItem(CLAVE_INTENTOS, JSON.stringify({ fallos: fallos >= MAX_INTENTOS ? 0 : fallos, hasta }));
}

/* ---- Acciones ---- */

export async function iniciarSesion({ correo, clave, recordar = false }) {
  const espera = segundosDeEspera();
  if (espera > 0) return { ok: false, error: `Demasiados intentos. Espera ${espera} s y vuelve a intentarlo.` };
  const cuenta = listarCuentas().find((item) => item.correo === normalizarCorreo(correo));
  const valida = cuenta ? await verificarClave(clave, cuenta.clave) : false;
  if (!cuenta || !valida) {
    registrarFallo();
    return { ok: false, error: "El correo o la contraseña no coinciden." };
  }
  if (!cuenta.activa) return { ok: false, error: "Esta cuenta está desactivada. Habla con el administrador." };
  localStorage.removeItem(CLAVE_INTENTOS);
  abrirSesion(cuenta, recordar);
  return { ok: true, cuenta: cuentaPublica(cuenta) };
}

export async function registrarCuenta({ nombre, correo, telefono, clave, fincaId }) {
  const limpio = normalizarCorreo(correo);
  if (!nombre?.trim()) return { ok: false, error: "Escribe tu nombre." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return { ok: false, error: "Revisa el correo." };
  const problema = problemaDeClave(clave);
  if (problema) return { ok: false, error: problema };
  const cuentas = listarCuentas();
  if (cuentas.some((item) => item.correo === limpio)) return { ok: false, error: "Ya existe una cuenta con ese correo." };
  const cuenta = {
    id: `usr-${Date.now().toString(36)}`,
    nombre: nombre.trim(),
    correo: limpio,
    telefono: telefono?.trim() ?? "",
    rol: "caficultor",
    fincaId,
    activa: true,
    clave: await protegerClave(clave),
    creado: new Date().toISOString(),
  };
  guardarCuentas([...cuentas, cuenta]);
  abrirSesion(cuenta, false);
  return { ok: true, cuenta: cuentaPublica(cuenta) };
}

export async function cambiarClave(cuentaId, { actual, nueva }) {
  const cuentas = listarCuentas();
  const cuenta = cuentas.find((item) => item.id === cuentaId);
  if (!cuenta) return { ok: false, error: "No encontramos la cuenta." };
  if (actual !== undefined && !(await verificarClave(actual, cuenta.clave))) {
    return { ok: false, error: "La contraseña actual no es correcta." };
  }
  const problema = problemaDeClave(nueva);
  if (problema) return { ok: false, error: problema };
  const clave = await protegerClave(nueva);
  guardarCuentas(cuentas.map((item) => (item.id === cuentaId ? { ...item, clave } : item)));
  return { ok: true };
}

export function actualizarCuenta(cuentaId, cambios) {
  const permitidos = ["nombre", "telefono", "rol", "activa", "fincaId"];
  const limpios = Object.fromEntries(Object.entries(cambios).filter(([campo]) => permitidos.includes(campo)));
  const cuentas = listarCuentas();
  guardarCuentas(cuentas.map((item) => (item.id === cuentaId ? { ...item, ...limpios } : item)));
}

export function eliminarCuenta(cuentaId) {
  guardarCuentas(listarCuentas().filter((item) => item.id !== cuentaId));
}

export function restablecerCuentas() {
  guardarCuentas(CUENTAS_INICIALES);
  cerrarSesion();
}

/* ---- Hooks ---- */

function suscribir(oyente) {
  window.addEventListener(EVENTO, oyente);
  window.addEventListener("storage", oyente);
  return () => {
    window.removeEventListener(EVENTO, oyente);
    window.removeEventListener("storage", oyente);
  };
}

let cacheSesion = { clave: null, valor: null };
function instantaneaSesion() {
  const sesion = obtenerSesion();
  const clave = sesion ? JSON.stringify(sesion) : "";
  if (clave !== cacheSesion.clave) cacheSesion = { clave, valor: sesion };
  return cacheSesion.valor;
}

export function useSesion() {
  return useSyncExternalStore(suscribir, instantaneaSesion);
}

let cacheCuentas = { clave: null, valor: [] };
function instantaneaCuentas() {
  const lista = listarCuentas().map(cuentaPublica);
  const clave = JSON.stringify(lista);
  if (clave !== cacheCuentas.clave) cacheCuentas = { clave, valor: lista };
  return cacheCuentas.valor;
}

export function useCuentas() {
  return useSyncExternalStore(suscribir, instantaneaCuentas);
}
