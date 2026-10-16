import { test } from "node:test";
import assert from "node:assert/strict";
import { protegerClave, verificarClave, problemaDeClave } from "../../src/utilidades/claves.js";
import { CUENTAS_INICIALES } from "../../src/utilidades/autenticacion.js";

test("una clave protegida se verifica y otra no", async () => {
  const protegida = await protegerClave("Cafetal2026");
  assert.equal(protegida.alg, "PBKDF2-SHA256");
  assert.notEqual(protegida.hash, "Cafetal2026");
  assert.equal(await verificarClave("Cafetal2026", protegida), true);
  assert.equal(await verificarClave("cafetal2026", protegida), false);
});

test("las cuentas de prueba abren con la contraseña documentada", async () => {
  for (const cuenta of CUENTAS_INICIALES) {
    assert.equal(await verificarClave("Cafetal2026", cuenta.clave), true, cuenta.correo);
  }
});

test("reglas de contraseña", () => {
  assert.match(problemaDeClave("corta1A"), /8 caracteres/);
  assert.match(problemaDeClave("sinnumeroS"), /número/);
  assert.match(problemaDeClave("todominuscula1"), /mayúsculas/);
  assert.equal(problemaDeClave("Cafetal2026"), null);
});
