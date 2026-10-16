/*
  Reglas agronómicas con fuente (docs/investigacion/02-dominio-cafetero.md).
  Cada constante dice de dónde sale para poder mostrarlo en la interfaz.
*/

export const FUENTES = {
  conversion: { texto: "Cenicafé, Avance Técnico 370 (2008): factores de conversión del café", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/358/1/avt0370.pdf" },
  carga: { texto: "Cenicafé, Atlas cafetero: 1 @ = 12,5 kg; 1 carga = 125 kg de c.p.s.", url: "https://publicaciones.cenicafe.org/index.php/atl/article/download/2961/2950/2636" },
  fr: { texto: "FNC, precio interno de referencia del 15-oct-2026 (tabla por factor de rendimiento)", url: "https://federaciondecafeteros.org/wp-content/uploads/2026/03/precio_cafe.pdf" },
  fenologia: { texto: "Cenicafé, Avance Técnico 441 (2014) y 495 (2018): de la floración a la cosecha, unas 32 semanas", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/489/1/avt0441.pdf" },
  broca: { texto: "Benavides et al., Manual del cafetero colombiano t. 2 (Cenicafé, 2013): muestreo de 30 árboles, umbral 2 %, posiciones A y B", url: "https://biblioteca.cenicafe.org/bitstream/10778/4340/1/cenbook-0026_24.pdf" },
  brocaUmbrales: { texto: "Cenicafé, Boletín fitosanitario 20 (3T-2026): umbral de acción 2 %, daño económico 5 %", url: "https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484" },
  roya: { texto: "Cenicafé, Avance Técnico 195 (1993) y Boletín fitosanitario 20 (2026): 10 árboles × 10 ramas, aplicar si supera el 5 %", url: "https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484" },
  royaCalendario: { texto: "Rivillas, Avance Técnico 495 (2018): en variedades susceptibles, primera aplicación a los 60 días de la floración", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/1105/1/AT0495.pdf" },
  densidad: { texto: "Rendón (Cenicafé, 2020): densidad = 10.000 / (surcos × plantas); ×1,154 en tres bolillo", url: "https://biblioteca.cenicafe.org/bitstream/10778/4229/3/Cap2.pdf" },
  primeraCosecha: { texto: "Ramírez, Jaramillo y Arcila, Manual del cafetero t. 1 (2013), tabla 6: días a la primera cosecha según la temperatura", url: "https://biblioteca.cenicafe.org/bitstream/10778/4322/1/cenbook-0026_10.pdf" },
  costos: { texto: "FNC, FEPCafé: costo medio de producción de agosto de 2026 (pendiente de actualización del modelo)", url: "https://federaciondecafeteros.org/wp-content/uploads/2026/10/9.-Reporte-Mensual_Septiembre26_FEPCafe%CC%81.pdf" },
  productividad: { texto: "FNC, FEPCafé (2026): promedio nacional 2025 de 21 sacos/ha = 12,6 cargas/ha", url: "https://federaciondecafeteros.org/wp-content/uploads/2026/10/9.-Reporte-Mensual_Septiembre26_FEPCafe%CC%81.pdf" },
  recoleccion: { texto: "Bloomberg Línea (10-oct-2025), citando a la FNC: 1.100 a 1.200 COP por kg de cereza en la cosecha de 2025", url: "https://www.bloomberglinea.com/latinoamerica/colombia/la-mejor-cosecha-de-cafe-en-tres-decadas-llevo-a-colombia-a-buscar-unos-450000-recolectores/" },
  humedad: { texto: "Peñuela y Sanz (Cenicafé, 2021): el pergamino se vende con 10 % a 12 % de humedad", url: "https://biblioteca.cenicafe.org/bitstream/10778/4289/1/189-218.pdf" },
  calidad: { texto: "Peñuela y Sanz (Cenicafé, 2021): buena recolección con más de 80 % de maduros y menos de 2,5 % de verdes", url: "https://biblioteca.cenicafe.org/bitstream/10778/4289/1/189-218.pdf" },
  renovacion: { texto: "Rendón (Cenicafé, 2020): renovar por quintas partes, a las 4 o 5 cosechas", url: "https://biblioteca.cenicafe.org/bitstream/10778/4229/3/Cap2.pdf" },
  clima: { texto: "Cenicafé, Manual del cafetero 1969 y 2013: 18 a 22 °C; 1.800 a 2.800 mm de lluvia al año", url: "https://publicaciones.cenicafe.org/index.php/boe/article/download/2586/2374/2110" },
  floracionLluvia: { texto: "Ramírez et al. (Cenicafé, 2013): la floración abre 7 a 10 días después de una lluvia de más de 10 mm tras un periodo seco", url: "https://biblioteca.cenicafe.org/bitstream/10778/4322/1/cenbook-0026_10.pdf" },
};

/* ---- Unidades ---- */
export const KG_ARROBA = 12.5;
export const KG_CARGA = 125;
export const FACTOR_CEREZA_CPS = 0.2; // 4,9 a 5 kg de cereza por kg de c.p.s.
export const FACTOR_CPS_VERDE = 0.8;
export const FR_BASE = 94;

export const aCps = (kgCereza, factor = FACTOR_CEREZA_CPS) => kgCereza * factor;
export const aArrobas = (kgCps) => kgCps / KG_ARROBA;
export const aCargas = (kgCps) => kgCps / KG_CARGA;

/* Pasilla por carga según el factor de rendimiento (tabla FNC del 15-oct-2026). */
const PASILLA_FR = [
  [88, 2.13],
  [90, 4.94],
  [92, 6.45],
  [94, 8.16],
  [96, 9.6],
  [98, 11.25],
  [100, 12.81],
];

function interpolar(tabla, x) {
  if (x <= tabla[0][0]) return tabla[0][1];
  if (x >= tabla.at(-1)[0]) return tabla.at(-1)[1];
  for (let i = 1; i < tabla.length; i += 1) {
    const [x1, y1] = tabla[i];
    const [x0, y0] = tabla[i - 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return tabla.at(-1)[1];
}

/*
  Precio de una carga según su factor de rendimiento, con la estructura de la FNC:
  kg de excelso = 125 × 70 / FR, más la pasilla de la tabla. El valor del kg de excelso
  se despeja del precio base (FR 94). Reproduce la tabla del 15-oct-2026 con error < 0,1 %.
*/
export function precioCargaPorFR(precioBase, fr = FR_BASE, precioPasillaKg = 12000) {
  const kgExcelsoBase = (KG_CARGA * 70) / FR_BASE;
  const valorExcelsoKg = (precioBase - interpolar(PASILLA_FR, FR_BASE) * precioPasillaKg) / kgExcelsoBase;
  return ((KG_CARGA * 70) / fr) * valorExcelsoKg + interpolar(PASILLA_FR, fr) * precioPasillaKg;
}

export function valorVenta({ kgCps, fr = FR_BASE, precioBase, precioPasillaKg }) {
  return aCargas(kgCps) * precioCargaPorFR(precioBase, fr, precioPasillaKg);
}

/* ---- Variedades ---- */
export const VARIEDADES = [
  { id: "castillo", nombre: "Castillo", resistente: true, porte: "bajo", densidadSur: 8000 },
  { id: "castillo-el-tambo", nombre: "Castillo El Tambo", resistente: true, porte: "bajo", densidadSur: 8000 },
  { id: "cenicafe-1", nombre: "Cenicafé 1", resistente: true, porte: "bajo", densidadSur: 10000 },
  { id: "colombia", nombre: "Colombia", resistente: true, porte: "bajo", densidadSur: 8000 },
  { id: "tabi", nombre: "Tabi", resistente: true, porte: "alto", densidadSur: 5000 },
  { id: "caturra", nombre: "Caturra", resistente: false, porte: "bajo", densidadSur: 8000 },
  { id: "tipica", nombre: "Típica", resistente: false, porte: "alto", densidadSur: 2500 },
  { id: "borbon", nombre: "Borbón", resistente: false, porte: "alto", densidadSur: 2500 },
  { id: "geisha", nombre: "Geisha", resistente: false, porte: "alto", densidadSur: 2500 },
  { id: "otra", nombre: "Otra", resistente: null, porte: null, densidadSur: null },
];

export const variedad = (id) => VARIEDADES.find((item) => item.id === id) ?? VARIEDADES.at(-1);
export const esSusceptible = (lote) => variedad(lote.variedad).resistente === false;

export const SISTEMAS = [
  { id: "sol", nombre: "Libre exposición" },
  { id: "semisombra", nombre: "Semisombra" },
  { id: "sombra", nombre: "Bajo sombra" },
];

/* ---- Densidad ---- */
export function densidad(distSurcos, distPlantas, arreglo = "cuadro") {
  if (!(distSurcos > 0) || !(distPlantas > 0)) return null;
  const base = 10000 / (distSurcos * distPlantas);
  return Math.round(arreglo === "triangulo" ? base * 1.154 : base);
}

/* ---- Edad, etapa y renovación ---- */

// Tabla 6 (Manual del cafetero, 2013): días desde la siembra a la primera cosecha.
const DIAS_PRIMERA_COSECHA = [
  [16, 958],
  [17, 821],
  [18, 719],
  [19, 639],
  [20, 575],
  [21, 523],
  [22, 479],
  [23, 442],
];

// 20 °C a unos 1.550 m en la cuenca del Cauca; 0,6 °C menos por cada 100 m (Cenicafé, 1969).
export const temperaturaPorAltitud = (altitud) => (Number.isFinite(altitud) ? 20 - ((altitud - 1550) / 100) * 0.6 : 20);

export function diasAPrimeraCosecha(temperatura = 20) {
  return Math.round(interpolar(DIAS_PRIMERA_COSECHA, temperatura));
}

/* Edad del ciclo (desde la siembra o la última zoca), en años. */
export function inicioCiclo(lote) {
  return lote.fechaRenovacion || lote.fechaSiembra || null;
}

export function etapaLote(lote, { altitud, hoy = new Date() } = {}) {
  const inicio = inicioCiclo(lote);
  if (!inicio) return { id: "sinDatos", nombre: "Sin fecha de siembra", cosechas: 0 };
  const dias = Math.floor((hoy - new Date(`${inicio}T00:00:00`)) / 86_400_000);
  const diasLevante = lote.fechaRenovacion ? 365 : diasAPrimeraCosecha(temperaturaPorAltitud(altitud));
  if (dias < diasLevante) {
    return { id: "levante", nombre: lote.fechaRenovacion ? "Zoca en levante" : "Levante", cosechas: 0, diasParaCosechar: diasLevante - dias };
  }
  const cosechas = Math.floor((dias - diasLevante) / 365) + 1;
  if (cosechas >= 5) return { id: "renovar", nombre: "Para renovar", cosechas };
  return { id: "produccion", nombre: "Producción", cosechas };
}

/* ---- Fenología ---- */
export const DIAS = {
  demandaNutrientes: 50, // etapa II del fruto
  royaPrimeraAplicacion: 60,
  brocaCritico: 120,
  cosecha: 224, // ~32 semanas (ventana 220–240)
  cosechaDesde: 210,
  cosechaHasta: 250,
  muestreosRoya: [90, 135, 180, 225],
};

/* ---- Broca ---- */
export function evaluarBroca(muestreo) {
  const frutos = muestreo.arboles.reduce((suma, arbol) => suma + (Number(arbol.frutos) || 0), 0);
  const brocados = muestreo.arboles.reduce((suma, arbol) => suma + (Number(arbol.brocados) || 0), 0);
  const infestacion = frutos ? (brocados / frutos) * 100 : 0;
  const pos = muestreo.posiciones;
  const totalPos = pos ? pos.A + pos.B + pos.C + pos.D : 0;
  const pctAB = totalPos ? ((pos.A + pos.B) / totalPos) * 100 : null;
  const aplicar = infestacion >= 2 && pctAB !== null && pctAB > 50;
  const nivel = infestacion >= 5 || aplicar ? "actuar" : infestacion >= 2 ? "vigilar" : "ok";
  let recomendacion;
  if (infestacion < 2) recomendacion = "Por debajo del umbral. No aplique; siga con la recolección oportuna y el repase (Re-Re).";
  else if (pctAB === null) recomendacion = "Supera el 2 %. Abra 100 frutos brocados y cuente posiciones A, B, C y D antes de decidir si aplicar.";
  else if (pctAB > 50) recomendacion = "Supera el 2 % y la mayoría de brocas está en A o B: es el momento de controlar (Beauveria o insecticida recomendado).";
  else recomendacion = "Supera el 2 %, pero la broca ya está dentro de la almendra (C o D): ningún producto la alcanza. Refuerce Re-Re.";
  return { frutos, brocados, infestacion, pctAB, nivel, recomendacion, aplicar };
}

/* ---- Roya ---- */
export function evaluarRoya(muestreo) {
  const porArbol = muestreo.arboles.filter((arbol) => Number(arbol.hojas) > 0).map((arbol) => (Number(arbol.conRoya) / Number(arbol.hojas)) * 100);
  const incidencia = porArbol.length ? porArbol.reduce((a, b) => a + b, 0) / porArbol.length : 0;
  // Clases del Boletín: < 5 %, 5 a < 15 %, ≥ 15 %. Por encima del 5 % ya se recomienda aplicar: es «actuar».
  const nivel = incidencia > 5 ? "actuar" : "ok";
  const recomendacion =
    incidencia > 5
      ? "Supera el 5 %: Cenicafé recomienda aplicación preventiva de fungicida, sin importar la variedad. Consulte el producto con su extensionista."
      : "Por debajo del 5 %. Siga muestreando a los 90, 135, 180 y 225 días de la floración.";
  return { incidencia, nivel, recomendacion, aplicar: incidencia > 5 };
}

/* ---- Labores y costos (categorías del FEPCafé) ---- */
export const ACTIVIDADES = [
  { id: "recoleccion", nombre: "Recolección" },
  { id: "nutricion", nombre: "Nutrición" },
  { id: "instalacion", nombre: "Siembra y renovación" },
  { id: "arvenses", nombre: "Manejo de arvenses" },
  { id: "fitosanitario", nombre: "Control fitosanitario" },
  { id: "beneficio", nombre: "Beneficio" },
  { id: "administracion", nombre: "Administración" },
  { id: "sombrio", nombre: "Sombrío" },
  { id: "otras", nombre: "Otras" },
];

export const ESTRUCTURA_REFERENCIA = {
  recoleccion: 52.1,
  nutricion: 18.6,
  instalacion: 9.4,
  arvenses: 7.2,
  administracion: 6.1,
  beneficio: 5.0,
  fitosanitario: 1.2,
  sombrio: 0.2,
  otras: 0.2,
};

export const COSTO_REFERENCIA_CARGA = 1_689_501; // FEPCafé, agosto de 2026
export const PRODUCTIVIDAD_PAIS_CARGAS_HA = 12.6;
export const PAGO_RECOLECCION_REFERENCIA = [1100, 1200];

export const LABORES = [
  { id: "fertilizacion", nombre: "Fertilización", actividad: "nutricion" },
  { id: "encalado", nombre: "Encalado", actividad: "nutricion" },
  { id: "plateo", nombre: "Plateo y limpieza", actividad: "arvenses" },
  { id: "guadana", nombre: "Guadaña / arvenses", actividad: "arvenses" },
  { id: "repase", nombre: "Repase", actividad: "recoleccion" },
  { id: "cosecha-sanitaria", nombre: "Cosecha sanitaria", actividad: "fitosanitario" },
  { id: "zoca", nombre: "Zoca", actividad: "instalacion" },
  { id: "siembra", nombre: "Siembra o resiembra", actividad: "instalacion" },
  { id: "almacigo", nombre: "Almácigo", actividad: "instalacion" },
  { id: "deschuponada", nombre: "Deschuponada", actividad: "otras" },
  { id: "beneficio", nombre: "Beneficio y secado", actividad: "beneficio" },
  { id: "sombrio", nombre: "Manejo del sombrío", actividad: "sombrio" },
  { id: "otra", nombre: "Otra labor", actividad: "otras" },
];

export const labor = (id) => LABORES.find((item) => item.id === id) ?? LABORES.at(-1);

export const MOTIVOS_APLICACION = [
  { id: "broca", nombre: "Broca", actividad: "fitosanitario" },
  { id: "roya", nombre: "Roya", actividad: "fitosanitario" },
  { id: "otra-plaga", nombre: "Otra plaga o enfermedad", actividad: "fitosanitario" },
  { id: "nutricion", nombre: "Fertilizante", actividad: "nutricion" },
  { id: "arvenses", nombre: "Herbicida", actividad: "arvenses" },
];

export const INTENSIDADES = [
  { id: "muy-buena", nombre: "Muy buena" },
  { id: "buena", nombre: "Buena" },
  { id: "regular", nombre: "Regular" },
  { id: "escasa", nombre: "Escasa" },
];

/* El año cafetero va del 1 de octubre al 30 de septiembre. */
export function anioCafetero(fecha = new Date()) {
  const f = new Date(fecha);
  const inicio = f.getMonth() >= 9 ? f.getFullYear() : f.getFullYear() - 1;
  return { inicio: `${inicio}-10-01`, fin: `${inicio + 1}-09-30`, nombre: `${inicio}/${String(inicio + 1).slice(2)}` };
}
