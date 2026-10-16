/*
  Contraseñas con PBKDF2-SHA256 (WebCrypto). La app no tiene servidor: las cuentas
  viven en este navegador, así que esto no es seguridad de producción, pero evita
  guardar contraseñas en texto plano y que aparezcan en el código o en el bundle.
*/

const ITERACIONES = 310_000;
const ALGORITMO = "PBKDF2-SHA256";

function aHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function deHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derivar(clave, sal, iteraciones) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: iteraciones }, material, 256);
  return aHex(bits);
}

export async function protegerClave(clave) {
  const sal = crypto.getRandomValues(new Uint8Array(16));
  return { alg: ALGORITMO, it: ITERACIONES, sal: aHex(sal), hash: await derivar(clave, sal, ITERACIONES) };
}

// Comparación en tiempo constante para no filtrar cuántos caracteres coinciden.
function iguales(a, b) {
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i += 1) diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferencia === 0;
}

export async function verificarClave(clave, protegida) {
  if (!protegida || protegida.alg !== ALGORITMO) return false;
  const hash = await derivar(clave, deHex(protegida.sal), protegida.it);
  return iguales(hash, protegida.hash);
}

export function problemaDeClave(clave) {
  if (clave.length < 8) return "Usa al menos 8 caracteres.";
  if (!/[A-ZÁÉÍÓÚÑ]/.test(clave) || !/[a-záéíóúñ]/.test(clave)) return "Combina mayúsculas y minúsculas.";
  if (!/\d/.test(clave)) return "Incluye al menos un número.";
  return null;
}
