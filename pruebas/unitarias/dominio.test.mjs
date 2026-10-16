import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluarBroca, evaluarRoya, precioCargaPorFR, densidad, anioCafetero, etapaLote } from "../../src/datos/agronomia.js";
import { generarSemilla } from "../../src/datos/semilla.js";
import { filtrarFinca } from "../../src/datos/miFincaBase.js";
import { lotesConEstado } from "../../src/datos/reglas.js";
import { resumenFinanciero } from "../../src/datos/calculos.js";
import { responder } from "../../src/datos/asistente.js";

const arboles = (frutos, brocados) => [{ frutos, brocados }];

test("broca: bajo 2 % no se aplica; sobre 2 % con A+B > 50 % sí", () => {
  assert.equal(evaluarBroca({ arboles: arboles(1000, 15) }).nivel, "ok");
  const sinPosiciones = evaluarBroca({ arboles: arboles(1000, 30) });
  assert.equal(sinPosiciones.nivel, "vigilar");
  assert.equal(sinPosiciones.aplicar, false);
  const conAB = evaluarBroca({ arboles: arboles(1000, 30), posiciones: { A: 40, B: 20, C: 25, D: 15 } });
  assert.equal(conAB.aplicar, true);
  assert.equal(conAB.nivel, "actuar");
  const enCD = evaluarBroca({ arboles: arboles(1000, 30), posiciones: { A: 10, B: 10, C: 40, D: 40 } });
  assert.equal(enCD.aplicar, false);
  assert.equal(evaluarBroca({ arboles: arboles(1000, 60) }).nivel, "actuar");
});

test("roya: sobre el 5 % se recomienda aplicar", () => {
  const baja = evaluarRoya({ arboles: Array.from({ length: 10 }, () => ({ hojas: 100, conRoya: 3 })) });
  assert.equal(baja.aplicar, false);
  const alta = evaluarRoya({ arboles: Array.from({ length: 10 }, () => ({ hojas: 100, conRoya: 7 })) });
  assert.ok(Math.abs(alta.incidencia - 7) < 1e-9);
  assert.equal(alta.aplicar, true);
});

test("precio por factor de rendimiento reproduce la tabla de la FNC del 15-oct-2026", () => {
  const tabla = { 88: 2158750, 92: 2117875, 94: 2095000, 98: 2050500, 100: 2031000 };
  for (const [fr, esperado] of Object.entries(tabla)) {
    const calculado = precioCargaPorFR(2095000, Number(fr), 12000);
    assert.ok(Math.abs(calculado - esperado) / esperado < 0.001, `FR ${fr}: ${calculado} vs ${esperado}`);
  }
});

test("densidad y año cafetero", () => {
  assert.equal(densidad(1.4, 0.9), 7937);
  assert.equal(densidad(1.5, 1, "triangulo"), Math.round((10000 / 1.5) * 1.154));
  assert.deepEqual(anioCafetero(new Date(2026, 9, 15)), { inicio: "2026-10-01", fin: "2027-09-30", nombre: "2026/27" });
  assert.equal(anioCafetero(new Date(2026, 3, 1)).nombre, "2025/26");
  assert.equal(etapaLote({ fechaSiembra: "2026-01-01" }, { hoy: new Date(2026, 9, 15) }).id, "levante");
});

test("la finca de ejemplo da los estados esperados y cifras plausibles", () => {
  const hoy = new Date(2026, 9, 15);
  const datos = generarSemilla(hoy);
  const finca = filtrarFinca(datos, "fin-esperanza");
  const estados = Object.fromEntries(lotesConEstado(finca, { finca: finca.finca, hoy }).map((l) => [l.nombre, l.estado]));
  assert.equal(estados["La Loma"], "ok");
  assert.equal(estados.Guaduales, "actuar");
  assert.equal(estados["La Cañada"], "vigilar");
  const r = resumenFinanciero(finca, { inicio: "2025-10-01", fin: "2026-09-30" });
  const cargasHa = r.produccion.cargas / 5.1;
  assert.ok(cargasHa > 10 && cargasHa < 16, `cargas/ha ${cargasHa}`);
});

test("el asistente responde con los datos de la finca", () => {
  const hoy = new Date(2026, 9, 15);
  const datos = generarSemilla(hoy);
  const finca = filtrarFinca(datos, "fin-esperanza");
  const contexto = { ...finca, lotes: lotesConEstado(finca, { finca: finca.finca, hoy }), hoy };
  assert.match(responder("¿Cuánto gasté en abono en La Loma este año?", contexto).texto, /La Loma.*abono|nutrici/i);
  assert.match(responder("¿Cómo está la broca?", contexto).texto, /broca/i);
  assert.match(responder("¿Cuánto me pagan por 500 kilos de pergamino?", contexto).texto, /500 kg/);
  assert.match(responder("1000 kilos de cereza cuánto pergamino dan", contexto).texto, /200 kg/);
  assert.match(responder("¿qué es el factor de rendimiento?", contexto).lineas[0], /guía/);
  assert.match(responder("xyzzy", contexto).texto, /No sé/);
});
