import { test } from "node:test";
import assert from "node:assert/strict";
import { areaHa, seAutointersecta, aFeature, validarGeometria } from "../../src/utilidades/geo.js";

// Un cuadrado de ~100 m × 100 m cerca de Popayán (1 ha).
const lat = 2.44;
const dLat = 100 / 111_320;
const dLon = 100 / (111_320 * Math.cos((lat * Math.PI) / 180));
const cuadrado = [
  [-76.61, lat],
  [-76.61 + dLon, lat],
  [-76.61 + dLon, lat + dLat],
  [-76.61, lat + dLat],
];

test("el área de un cuadrado de 100 m es cercana a 1 ha", () => {
  assert.ok(Math.abs(areaHa(cuadrado) - 1) < 0.02, `área ${areaHa(cuadrado)}`);
});

test("detecta un contorno que se cruza", () => {
  assert.equal(seAutointersecta(cuadrado), false);
  const corbatin = [cuadrado[0], cuadrado[2], cuadrado[1], cuadrado[3]];
  assert.equal(seAutointersecta(corbatin), true);
});

test("el GeoJSON sale cerrado, en [lon, lat] y con 6 decimales", () => {
  const feature = aFeature({ nombre: "La Loma", areaHa: 1, geometria: { tipo: "poligono", puntos: cuadrado } }, { nombre: "La Esperanza" });
  const anillo = feature.geometry.coordinates[0];
  assert.deepEqual(anillo[0], anillo[anillo.length - 1]);
  assert.equal(anillo[0][0], -76.61);
  for (const [lon, latitud] of anillo) {
    assert.ok(Number.isInteger(Math.round(lon * 1e6)) && String(lon).split(".")[1]?.length <= 6);
    assert.ok(String(latitud).split(".")[1]?.length <= 6);
  }
});

test("un punto no basta para un lote de 4 ha o más", () => {
  const problemas = validarGeometria({ areaHa: 5, geometria: { tipo: "punto", punto: [-76.6, 2.4] } });
  assert.match(problemas[0], /contorno/);
});
