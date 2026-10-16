import { test } from "node:test";
import assert from "node:assert/strict";
import { interpretar, combinar } from "../../src/ia/interpretar.js";
import { calidadDesdePixeles } from "../../src/ia/preparar.js";

const buena = { aceptable: true, nitida: true, luz: "buena" };
const probs = (pares) => {
  const p = new Float32Array(8);
  for (const [i, v] of pares) p[i] = v;
  return p;
};

test("roya por encima de su umbral se acepta", () => {
  const r = interpretar(probs([[4, 0.82], [1, 0.1], [2, 0.08]]), buena);
  assert.equal(r.aceptada, true);
  assert.equal(r.ganadora.id, "rust");
  assert.equal(r.estado, "confiado");
});

test("mancha de hierro por debajo de 0,835 se abstiene", () => {
  const r = interpretar(probs([[0, 0.7], [4, 0.3]]), buena);
  assert.equal(r.aceptada, false);
  assert.equal(r.estado, "incierto");
});

test("«no compatible» nunca se acepta", () => {
  const r = interpretar(probs([[7, 0.99]]), buena);
  assert.equal(r.aceptada, false);
  assert.match(r.motivo, /No parece/);
});

test("una foto movida se rechaza aunque el modelo esté seguro", () => {
  const r = interpretar(probs([[4, 0.99]]), { aceptable: false, nitida: false, luz: "buena" });
  assert.equal(r.aceptada, false);
  assert.match(r.motivo, /movida/);
});

test("combinar promedia solo las fotos de buena calidad", () => {
  const r = combinar([
    { calidad: buena, probabilidades: probs([[4, 0.9], [1, 0.1]]) },
    { calidad: buena, probabilidades: probs([[4, 0.5], [1, 0.5]]) },
    { calidad: { aceptable: false }, probabilidades: probs([[1, 1]]) },
  ]);
  assert.equal(r.ganadora.id, "rust");
  assert.ok(Math.abs(r.ganadora.probabilidad - 0.7) < 1e-6);
});

test("calidad: imagen plana es borrosa; ruido es nítido; negro es oscuro", () => {
  const lado = 224;
  const plano = new Uint8ClampedArray(lado * lado * 4).fill(120);
  assert.equal(calidadDesdePixeles(plano).nitida, false);
  const ruido = plano.map((_, i) => (i % 4 === 3 ? 255 : (i * 2654435761) % 256));
  assert.equal(calidadDesdePixeles(ruido).nitida, true);
  const negro = new Uint8ClampedArray(lado * lado * 4);
  assert.equal(calidadDesdePixeles(negro).luz, "oscura");
});
