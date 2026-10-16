/* Formatos en es-CO: «1.250 kg», «$ 2.300.000», «12 oct.». */

const numero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
const entero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const porcentaje = new Intl.NumberFormat("es-CO", { style: "percent", maximumFractionDigits: 1 });
const fechaCorta = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });
const fechaLarga = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });
const diaSemana = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric" });
const relativa = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });

export const num = (valor) => (Number.isFinite(valor) ? numero.format(valor) : "—");
export const ent = (valor) => (Number.isFinite(valor) ? entero.format(valor) : "—");
export const cop = (valor) => (Number.isFinite(valor) ? pesos.format(valor) : "—");
export const pct = (fraccion) => (Number.isFinite(fraccion) ? porcentaje.format(fraccion) : "—");

/* Fechas «YYYY-MM-DD» se leen como fecha local (no UTC) para no correr un día. */
export function aFecha(valor) {
  if (valor instanceof Date) return valor;
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [a, m, d] = valor.split("-").map(Number);
    return new Date(a, m - 1, d);
  }
  return new Date(valor);
}

export function hoyISO(fecha = new Date()) {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

export function sumarDias(fecha, dias) {
  const nueva = new Date(aFecha(fecha));
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
}

export function diasEntre(desde, hasta = new Date()) {
  const a = aFecha(desde);
  const b = aFecha(hasta);
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / 86_400_000);
}

export const fCorta = (valor) => fechaCorta.format(aFecha(valor));
export const fLarga = (valor) => fechaLarga.format(aFecha(valor));
export const fDia = (valor) => diaSemana.format(aFecha(valor));

export function hace(valor) {
  const dias = diasEntre(valor);
  if (Math.abs(dias) < 1) return "hoy";
  if (Math.abs(dias) < 31) return relativa.format(-dias, "day");
  const meses = Math.round(dias / 30.4);
  if (Math.abs(meses) < 12) return relativa.format(-meses, "month");
  return relativa.format(-Math.round(dias / 365), "year");
}

export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
