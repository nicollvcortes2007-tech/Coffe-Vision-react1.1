/*
  Colecciones del almacén local (ver almacen.js). Cada registro lleva id, creado y,
  según la colección, fincaId y loteId. Los campos del lote siguen los del SICA de
  la FNC (área, variedad, edad, densidad, sombra) para que el caficultor los reconozca.
*/

export const VERSION_DATOS = "2026.10";

export const COLECCIONES = [
  "fincas",
  "lotes",
  "labores",
  "floraciones",
  "muestreos",
  "recolecciones",
  "ventas",
  "aplicaciones",
  "gastos",
  "diagnosticos",
  "trabajadores",
  "precios",
];

// Cambios de estructura: cada entrada transforma los datos de esa versión a la siguiente.
export const MIGRACIONES = {};
export const ORDEN_VERSIONES = ["2026.10"];
