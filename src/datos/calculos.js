import { aCps, aCargas, labor, MOTIVOS_APLICACION, FACTOR_CEREZA_CPS, anioCafetero } from "./agronomia.js";

/*
  Cifras de la finca calculadas solo con sus propios registros. Ninguna se inventa:
  si no hay registros, el resultado es 0 o null y la interfaz dice «sin datos».
*/

export const enRango = (fecha, desde, hasta) => (!desde || fecha >= desde) && (!hasta || fecha <= hasta);

export function factorLote(lote) {
  return lote?.factorCps > 0 ? lote.factorCps : FACTOR_CEREZA_CPS;
}

/* Todos los costos de la finca como una sola lista, con su actividad del FEPCafé. */
export function movimientosCosto({ labores, recolecciones, aplicaciones, gastos }, { desde, hasta, loteId } = {}) {
  const lista = [];
  for (const item of labores) {
    const valor = (Number(item.jornales) || 0) * (Number(item.valorJornal) || 0) + (Number(item.costoInsumos) || 0);
    if (valor > 0) lista.push({ id: item.id, fecha: item.fecha, loteId: item.loteId, actividad: labor(item.tipo).actividad, concepto: labor(item.tipo).nombre, valor, origen: "labor" });
  }
  for (const item of recolecciones) {
    const valor = (Number(item.kgCereza) || 0) * (Number(item.pagoKg) || 0);
    if (valor > 0) lista.push({ id: item.id, fecha: item.fecha, loteId: item.loteId, actividad: "recoleccion", concepto: `Recolección (${item.recolector || "recolectores"})`, valor, origen: "recoleccion" });
  }
  for (const item of aplicaciones) {
    const valor = Number(item.costo) || 0;
    const motivo = MOTIVOS_APLICACION.find((m) => m.id === item.motivo);
    if (valor > 0) lista.push({ id: item.id, fecha: item.fecha, loteId: item.loteId, actividad: motivo?.actividad ?? "fitosanitario", concepto: item.producto, valor, origen: "aplicacion" });
  }
  for (const item of gastos) {
    const valor = Number(item.valor) || 0;
    if (valor > 0) lista.push({ id: item.id, fecha: item.fecha, loteId: item.loteId ?? null, actividad: item.actividad, concepto: item.descripcion, valor, origen: "gasto" });
  }
  return lista.filter((item) => enRango(item.fecha, desde, hasta) && (!loteId || item.loteId === loteId)).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function produccion({ recolecciones, lotes }, { desde, hasta, loteId } = {}) {
  const porLote = new Map(lotes.map((lote) => [lote.id, lote]));
  let kgCereza = 0;
  let kgCps = 0;
  for (const item of recolecciones) {
    if (!enRango(item.fecha, desde, hasta) || (loteId && item.loteId !== loteId)) continue;
    const kg = Number(item.kgCereza) || 0;
    kgCereza += kg;
    kgCps += aCps(kg, factorLote(porLote.get(item.loteId)));
  }
  return { kgCereza, kgCps, cargas: aCargas(kgCps), arrobas: kgCps / 12.5 };
}

export function resumenFinanciero(datos, rango = anioCafetero()) {
  const desde = rango.desde ?? rango.inicio;
  const hasta = rango.hasta ?? rango.fin;
  const costos = movimientosCosto(datos, { desde, hasta });
  const costoTotal = costos.reduce((suma, item) => suma + item.valor, 0);
  const prod = produccion(datos, { desde, hasta });
  const ventas = datos.ventas.filter((venta) => enRango(venta.fecha, desde, hasta));
  const ingresos = ventas.reduce((suma, venta) => suma + (Number(venta.total) || 0), 0);
  const kgVendidos = ventas.reduce((suma, venta) => suma + (Number(venta.kgCps) || 0), 0);
  const porActividad = {};
  for (const item of costos) porActividad[item.actividad] = (porActividad[item.actividad] ?? 0) + item.valor;
  return {
    costos,
    costoTotal,
    produccion: prod,
    ventas,
    ingresos,
    kgVendidos,
    costoPorCarga: prod.cargas > 0 ? costoTotal / prod.cargas : null,
    porActividad,
    margen: ingresos - costoTotal,
  };
}

export function areaTotal(lotes) {
  return lotes.reduce((suma, lote) => suma + (Number(lote.areaHa) || 0), 0);
}

export function ultimo(lista, filtro = () => true) {
  return lista.filter(filtro).sort((a, b) => b.fecha.localeCompare(a.fecha))[0] ?? null;
}

/* Precio de referencia vigente: el último registrado por el administrador. */
export function precioVigente(precios) {
  return ultimo(precios);
}

export function kgPorRecolector(recolecciones, { desde, hasta } = {}) {
  const mapa = new Map();
  for (const item of recolecciones) {
    if (!enRango(item.fecha, desde, hasta)) continue;
    const nombre = item.recolector || "Sin nombre";
    const actual = mapa.get(nombre) ?? { nombre, kg: 0, pago: 0, dias: new Set() };
    actual.kg += Number(item.kgCereza) || 0;
    actual.pago += (Number(item.kgCereza) || 0) * (Number(item.pagoKg) || 0);
    actual.dias.add(item.fecha);
    mapa.set(nombre, actual);
  }
  return [...mapa.values()].map((item) => ({ ...item, dias: item.dias.size })).sort((a, b) => b.kg - a.kg);
}
