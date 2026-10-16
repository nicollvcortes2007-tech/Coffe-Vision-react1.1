import { hoyISO, sumarDias } from "../utilidades/formato.js";

/*
  Datos de demostración. Las fincas, las personas y las cifras son ficticias; las
  fechas se calculan desde hoy para que la finca de ejemplo siempre esté «al día».
  Lo único real es el precio de referencia de la FNC del 15-oct-2026 (con su enlace).
  Un generador con semilla fija hace que la demo sea siempre igual.
*/

function generador(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RECOLECTORES = ["Don Ernesto", "Luz Dary", "Wilmer", "Yeison", "Doña Rubiela", "Hernán"];

function rectangulo([lon, lat], anchoM, altoM, giro = 0) {
  const dLat = altoM / 111_320;
  const dLon = anchoM / (111_320 * Math.cos((lat * Math.PI) / 180));
  const esquinas = [
    [-dLon / 2, -dLat / 2],
    [dLon / 2, -dLat / 2],
    [dLon / 2, dLat / 2],
    [-dLon / 2, dLat / 2],
  ];
  const c = Math.cos(giro);
  const s = Math.sin(giro);
  return esquinas.map(([x, y]) => [lon + x * c - y * s, lat + x * s + y * c]);
}

export function generarSemilla(hoy = new Date()) {
  const azar = generador(20261015);
  const entre = (min, max) => min + azar() * (max - min);
  const entero = (min, max) => Math.round(entre(min, max));
  const dia = (desplazamiento) => hoyISO(sumarDias(hoy, desplazamiento));
  let contador = 0;
  const id = (prefijo) => `${prefijo}-demo-${(contador += 1).toString(36)}`;

  const datos = {
    fincas: [],
    lotes: [],
    labores: [],
    floraciones: [],
    muestreos: [],
    recolecciones: [],
    ventas: [],
    aplicaciones: [],
    gastos: [],
    diagnosticos: [],
    trabajadores: [],
    precios: [
      {
        id: "pre-fnc-20261015",
        fecha: "2026-10-15",
        precioCarga: 2095000,
        pasillaKg: 12000,
        bolsaNY: 294.8,
        trm: 3170,
        fuente: "FNC, precio interno de referencia",
        url: "https://federaciondecafeteros.org/wp-content/uploads/2026/03/precio_cafe.pdf",
        registradoPor: "Equipo Coffee+Visión",
        creado: "2026-10-15T13:00:00.000Z",
      },
    ],
  };

  /* ---------- Finca de ejemplo completa: La Esperanza (Timbío, Cauca) ---------- */
  const esperanza = {
    id: "fin-esperanza",
    nombre: "La Esperanza",
    propietario: "Rosa Elena Muñoz",
    vereda: "El Placer",
    municipio: "Timbío",
    departamento: "Cauca",
    lat: 2.37,
    lon: -76.72,
    altitud: 1768,
    areaTotal: 9,
    puntoCompra: "Cooperativa de Caficultores del Cauca",
    demo: true,
    creado: dia(-640),
  };
  datos.fincas.push(esperanza);

  const definicion = [
    { nombre: "La Loma", variedad: "castillo", areaHa: 1.5, siembra: -1950, sistema: "sol", surcos: 1.4, plantas: 0.9, arreglo: "cuadro", desfase: [0, 0] },
    { nombre: "El Mirador", variedad: "cenicafe-1", areaHa: 1.2, siembra: -1650, sistema: "sol", surcos: 1.3, plantas: 0.8, arreglo: "cuadro", desfase: [0.0016, 0.0009] },
    { nombre: "Guaduales", variedad: "castillo", areaHa: 0.8, siembra: -3300, renovacion: -1330, sistema: "semisombra", surcos: 1.5, plantas: 1.0, arreglo: "triangulo", desfase: [-0.0014, 0.0011] },
    { nombre: "La Cañada", variedad: "caturra", areaHa: 0.6, siembra: -3050, sistema: "sol", surcos: 1.5, plantas: 1.0, arreglo: "cuadro", desfase: [0.0009, -0.0013] },
    { nombre: "Alto Bonito", variedad: "tabi", areaHa: 1.0, siembra: -3400, sistema: "semisombra", surcos: 2.0, plantas: 1.0, arreglo: "cuadro", desfase: [-0.0021, -0.0006] },
    { nombre: "Zoca 2025", variedad: "castillo", areaHa: 0.7, siembra: -3200, renovacion: -205, sistema: "sol", surcos: 1.4, plantas: 1.0, arreglo: "cuadro", desfase: [0.0024, -0.0002] },
  ];

  const lotes = definicion.map((def, indice) => {
    const centro = [esperanza.lon + def.desfase[0], esperanza.lat + def.desfase[1]];
    const lado = Math.sqrt(def.areaHa * 10000);
    const base = 10000 / (def.surcos * def.plantas);
    const lote = {
      id: `lot-esperanza-${indice + 1}`,
      fincaId: esperanza.id,
      nombre: def.nombre,
      variedad: def.variedad,
      areaHa: def.areaHa,
      sistema: def.sistema,
      fechaSiembra: dia(def.siembra),
      fechaRenovacion: def.renovacion ? dia(def.renovacion) : null,
      distSurcos: def.surcos,
      distPlantas: def.plantas,
      arreglo: def.arreglo,
      densidad: Math.round(def.arreglo === "triangulo" ? base * 1.154 : base),
      factorCps: 0.2,
      geometria: indice < 3 ? { tipo: "poligono", puntos: rectangulo(centro, lado * 1.3, lado / 1.3, 0.35 * indice) } : { tipo: "punto", punto: centro, precision: 6 },
      antesDe2021: dia(def.siembra) <= "2020-12-31" ? "si" : "no",
      creado: dia(-640),
    };
    return lote;
  });
  datos.lotes.push(...lotes);
  const [loma, mirador, guaduales, canada, altoBonito] = lotes;
  const productivos = [loma, mirador, guaduales, canada, altoBonito];

  for (const nombre of RECOLECTORES) datos.trabajadores.push({ id: id("tra"), fincaId: esperanza.id, nombre, creado: dia(-600) });

  // Floraciones: la principal del ciclo anterior (cosecha principal pasada), una de mitaca y la del ciclo actual.
  for (const lote of productivos) {
    const corrimiento = lote === altoBonito ? 7 : 0;
    datos.floraciones.push({ id: id("flo"), loteId: lote.id, fecha: dia(-400 + corrimiento), intensidad: "muy-buena", principal: true, creado: dia(-399) });
    datos.floraciones.push({ id: id("flo"), loteId: lote.id, fecha: dia(-232 + corrimiento), intensidad: "regular", principal: false, creado: dia(-231) });
    datos.floraciones.push({ id: id("flo"), loteId: lote.id, fecha: dia(-55 + corrimiento), intensidad: lote === canada ? "buena" : "muy-buena", principal: true, creado: dia(-54) });
  }

  // Recolecciones: cosecha principal (hace ~200 a ~110 días) y mitaca en curso (últimas 3 semanas).
  const productividad = { [loma.id]: 1, [mirador.id]: 1.12, [guaduales.id]: 0.88, [canada.id]: 0.7, [altoBonito.id]: 0.78 };
  for (const lote of productivos) {
    const cerezaTemporada = lote.areaHa * 14 * 125 * 5 * productividad[lote.id]; // ~14 cargas/ha
    const pases = 7;
    for (let p = 0; p < pases; p += 1) {
      const peso = [0.06, 0.13, 0.19, 0.22, 0.19, 0.13, 0.08][p];
      const kgPase = cerezaTemporada * 0.9 * peso;
      const fechaPase = -205 + p * 15 + entero(-1, 1);
      const cuadrilla = RECOLECTORES.slice(0, Math.max(2, Math.min(6, Math.round(kgPase / 260))));
      let restante = kgPase;
      cuadrilla.forEach((recolector, i) => {
        const kg = i === cuadrilla.length - 1 ? restante : Math.min(restante, kgPase / cuadrilla.length * entre(0.85, 1.15));
        restante -= kg;
        datos.recolecciones.push({ id: id("rec"), loteId: lote.id, fecha: dia(fechaPase + (i % 2)), recolector, kgCereza: Math.round(kg), pagoKg: 1200, verdesPct: Number(entre(0.8, 2.6).toFixed(1)), creado: dia(fechaPase) });
      });
    }
    // Mitaca: dos pases pequeños recientes.
    const ultimoPase = lote === loma ? -18 : lote === mirador ? -16 : -11;
    for (const desplazamiento of [ultimoPase - 15, ultimoPase]) {
      const kg = cerezaTemporada * 0.05 * entre(0.8, 1.2);
      datos.recolecciones.push({ id: id("rec"), loteId: lote.id, fecha: dia(desplazamiento), recolector: "Luz Dary", kgCereza: Math.round(kg * 0.55), pagoKg: 1250, verdesPct: Number(entre(1, 2.4).toFixed(1)), creado: dia(desplazamiento) });
      datos.recolecciones.push({ id: id("rec"), loteId: lote.id, fecha: dia(desplazamiento), recolector: "Wilmer", kgCereza: Math.round(kg * 0.45), pagoKg: 1250, verdesPct: Number(entre(1, 2.4).toFixed(1)), creado: dia(desplazamiento) });
    }
  }

  // Repases después de la cosecha principal y en La Loma tras la mitaca.
  for (const lote of productivos) {
    datos.labores.push({ id: id("lab"), loteId: lote.id, fecha: dia(-95), tipo: "repase", jornales: Math.ceil(lote.areaHa * 2), valorJornal: 60000, costoInsumos: 0, notas: "Repase de la cosecha principal", creado: dia(-95) });
  }
  datos.labores.push({ id: id("lab"), loteId: loma.id, fecha: dia(-3), tipo: "repase", jornales: 3, valorJornal: 60000, costoInsumos: 0, notas: "Repase de mitaca, quedaron menos de 5 frutos por árbol", creado: dia(-3) });

  // Otras labores del año.
  for (const lote of lotes) {
    for (const [desplazamiento, tipo, jornalesHa, notas] of [
      [-330, "plateo", 3, "Plateo antes de abonar"],
      [-240, "guadana", 2.5, ""],
      [-150, "plateo", 3, ""],
      [-60, "guadana", 2.5, ""],
      [-30, "deschuponada", 1.5, ""],
    ]) {
      datos.labores.push({ id: id("lab"), loteId: lote.id, fecha: dia(desplazamiento + entero(-3, 3)), tipo, jornales: Math.max(1, Math.round(lote.areaHa * jornalesHa)), valorJornal: 60000, costoInsumos: 0, notas, creado: dia(desplazamiento) });
    }
  }

  // Fertilización (al empezar las lluvias) y aplicaciones fitosanitarias.
  for (const lote of lotes) {
    for (const desplazamiento of [-345, -165, -20]) {
      const bultos = Math.max(1, Math.round(lote.areaHa * 6.5));
      datos.aplicaciones.push({
        id: id("apl"),
        loteId: lote.id,
        fecha: dia(desplazamiento + entero(-2, 2)),
        motivo: "nutricion",
        producto: "Fertilizante 17-6-18-2",
        ingredienteActivo: "N-P-K-Mg",
        registroIca: "",
        dosis: bultos * 50,
        unidad: "kg",
        costo: bultos * 165000,
        carenciaDias: 0,
        reingresoHoras: 0,
        recomendo: "Extensionista del Comité",
        aplico: "Wilmer",
        creado: dia(desplazamiento),
      });
    }
  }
  // Roya en La Cañada (Caturra): aplicaciones a los 60 y 105 días de la floración del ciclo anterior.
  for (const desplazamiento of [-340, -295]) {
    datos.aplicaciones.push({
      id: id("apl"),
      loteId: canada.id,
      fecha: dia(desplazamiento),
      motivo: "roya",
      producto: "Fungicida cúprico",
      ingredienteActivo: "Oxicloruro de cobre",
      registroIca: "Ver etiqueta",
      dosis: 1.8,
      unidad: "kg",
      costo: 98000,
      carenciaDias: 15,
      reingresoHoras: 24,
      recomendo: "Extensionista del Comité",
      aplico: "Hernán",
      creado: dia(desplazamiento),
    });
  }
  // Broca: Beauveria en El Mirador durante el período crítico del ciclo anterior.
  datos.aplicaciones.push({
    id: id("apl"),
    loteId: mirador.id,
    fecha: dia(-262),
    motivo: "broca",
    producto: "Beauveria bassiana",
    ingredienteActivo: "Beauveria bassiana (2×10¹⁰ conidias/L)",
    registroIca: "Ver etiqueta",
    dosis: 60,
    unidad: "L de mezcla",
    costo: 145000,
    carenciaDias: 0,
    reingresoHoras: 0,
    recomendo: "Extensionista del Comité",
    aplico: "Yeison",
    creado: dia(-262),
  });

  // Muestreos de broca (mensuales desde el período crítico del ciclo anterior) y recientes.
  const infestaciones = {
    [loma.id]: [0.6, 1.1, 1.4, 0.9],
    [mirador.id]: [1.2, 2.8, 1.5, 1.1],
    [guaduales.id]: [0.9, 1.6, 2.1, 1.3],
    [canada.id]: [1.4, 1.9, 1.7, 1.2],
    [altoBonito.id]: [0.8, 1.2, 0.9, 0.7],
  };
  const muestreoBroca = (lote, fecha, pct, posiciones) => {
    const arboles = Array.from({ length: 30 }, () => {
      const frutos = entero(38, 92);
      return { frutos, brocados: 0 };
    });
    const total = arboles.reduce((s, a) => s + a.frutos, 0);
    let brocados = Math.round((total * pct) / 100);
    while (brocados > 0) {
      const arbol = arboles[entero(0, 29)];
      if (arbol.brocados < arbol.frutos) {
        arbol.brocados += 1;
        brocados -= 1;
      }
    }
    datos.muestreos.push({ id: id("mue"), loteId: lote.id, fecha: dia(fecha), tipo: "broca", arboles, posiciones: posiciones ?? null, creado: dia(fecha) });
  };
  for (const lote of productivos) {
    infestaciones[lote.id].forEach((pct, i) => muestreoBroca(lote, -280 + i * 30, pct, i === 1 && lote === mirador ? { A: 41, B: 27, C: 20, D: 12 } : null));
  }
  muestreoBroca(loma, -12, 0.9);
  muestreoBroca(mirador, -8, 2.6);
  muestreoBroca(guaduales, -6, 3.4, { A: 38, B: 24, C: 22, D: 16 });

  // Muestreos de roya (10 árboles × 10 ramas).
  const muestreoRoya = (lote, fecha, pct) => {
    const arboles = Array.from({ length: 10 }, () => {
      const hojas = entero(95, 140);
      return { hojas, conRoya: Math.max(0, Math.round(hojas * (pct / 100) * entre(0.6, 1.4))) };
    });
    datos.muestreos.push({ id: id("mue"), loteId: lote.id, fecha: dia(fecha), tipo: "roya", arboles, creado: dia(fecha) });
  };
  for (const lote of productivos) {
    const base = lote === canada ? 3.2 : 1.4;
    [90, 135, 180, 225].forEach((d, i) => muestreoRoya(lote, -400 + d + (lote === altoBonito ? 7 : 0), base + i * (lote === canada ? 1.1 : 0.3)));
  }
  muestreoRoya(loma, -10, 2.2);

  // Ventas semanales de pergamino durante la cosecha principal y una de mitaca.
  const fechasVenta = [-196, -181, -166, -151, -136, -121, -106, -6];
  const preciosDemo = [2560000, 2610000, 2540000, 2480000, 2430000, 2390000, 2350000, 2095000];
  const totalCereza = datos.recolecciones.reduce((s, r) => s + r.kgCereza, 0);
  const cpsTotal = totalCereza * 0.2 * 0.97; // algo queda en bodega
  const pesos = [0.08, 0.14, 0.18, 0.2, 0.16, 0.12, 0.08, 0.04];
  fechasVenta.forEach((desplazamiento, i) => {
    const kgCps = Math.round(cpsTotal * pesos[i]);
    const fr = [93, 94, 92, 94, 95, 93, 94, 94][i];
    const precioBase = preciosDemo[i];
    const kgExcelso = (125 * 70) / fr;
    const valorExcelso = (precioBase - 8.16 * 12000) / ((125 * 70) / 94);
    const pasilla = [6.45, 8.16, 9.6][Math.max(0, Math.min(2, fr - 93))] ?? 8.16;
    const precioCarga = kgExcelso * valorExcelso + pasilla * 12000;
    datos.ventas.push({
      id: id("ven"),
      fincaId: esperanza.id,
      fecha: dia(desplazamiento),
      comprador: "Cooperativa de Caficultores del Cauca",
      kgCps,
      factorRendimiento: fr,
      humedad: Number(entre(10.6, 11.8).toFixed(1)),
      precioBase,
      total: Math.round((kgCps / 125) * precioCarga),
      notas: i === 7 ? "Venta de mitaca" : "",
      creado: dia(desplazamiento),
    });
  });

  // Gastos generales.
  for (const [desplazamiento, actividad, descripcion, valor] of [
    [-330, "administracion", "Análisis de suelo (2 muestras)", 190000],
    [-300, "beneficio", "Mantenimiento de la despulpadora", 240000],
    [-200, "beneficio", "Costales y plástico para el secado", 135000],
    [-190, "otras", "Transporte del café a la cooperativa (temporada)", 320000],
    [-120, "beneficio", "Energía del beneficiadero (temporada)", 210000],
    [-90, "administracion", "Cuota del contador", 150000],
    [-45, "sombrio", "Plántulas de guamo para sombrío", 96000],
    [-15, "otras", "Transporte de la mitaca", 60000],
  ]) {
    datos.gastos.push({ id: id("gas"), fincaId: esperanza.id, loteId: null, fecha: dia(desplazamiento), actividad, descripcion, valor, creado: dia(desplazamiento) });
  }

  /* ---------- Otras fincas (para el panorama del administrador) ---------- */
  const otras = [
    { id: "fin-diviso", nombre: "El Diviso", propietario: "Jesús Antonio Calambás", vereda: "La Pedregosa", municipio: "Cajibío", lat: 2.6231, lon: -76.5702, altitud: 1740, lotes: [["La Huerta", "castillo", 2.1], ["Bajo", "cenicafe-1", 1.4], ["Cañaduzal", "caturra", 0.9]], broca: [1.1, 4.2, 2.3], roya: [1.9, 1.2, 7.6] },
    { id: "fin-villa-clara", nombre: "Villa Clara", propietario: "María Nelly Daza", vereda: "Huisitó", municipio: "El Tambo", lat: 2.4528, lon: -76.8133, altitud: 1690, lotes: [["Principal", "castillo-el-tambo", 3.2], ["La Quebrada", "castillo", 1.6]], broca: [1.3, 0.8], roya: [2.1, 1.6] },
    { id: "fin-los-naranjos", nombre: "Los Naranjos", propietario: "Ferney Guzmán", vereda: "Tunía", municipio: "Piendamó - Tunía", lat: 2.6407, lon: -76.5289, altitud: 1810, lotes: [["Arriba", "tabi", 1.8], ["Medio", "castillo", 2.4], ["Zoca", "castillo", 1.1]], broca: [0.7, 1.9, 5.6], roya: [1.0, 2.8, 1.5] },
  ];
  for (const finca of otras) {
    datos.fincas.push({ id: finca.id, nombre: finca.nombre, propietario: finca.propietario, vereda: finca.vereda, municipio: finca.municipio, departamento: "Cauca", lat: finca.lat, lon: finca.lon, altitud: finca.altitud, areaTotal: Math.ceil(finca.lotes.reduce((s, l) => s + l[2], 0) + 2), demo: true, creado: dia(-500) });
    finca.lotes.forEach(([nombre, variedadId, areaHa], i) => {
      const lote = {
        id: `lot-${finca.id.slice(4)}-${i + 1}`,
        fincaId: finca.id,
        nombre,
        variedad: variedadId,
        areaHa,
        sistema: i === 0 ? "semisombra" : "sol",
        fechaSiembra: dia(-2200 - i * 400),
        fechaRenovacion: null,
        densidad: variedadId === "tabi" ? 5000 : 7400,
        factorCps: 0.2,
        geometria: { tipo: "punto", punto: [finca.lon + i * 0.0012, finca.lat - i * 0.0009], precision: 8 },
        antesDe2021: "si",
        creado: dia(-500),
      };
      datos.lotes.push(lote);
      datos.floraciones.push({ id: id("flo"), loteId: lote.id, fecha: dia(-58 + i * 2), intensidad: "buena", principal: true, creado: dia(-57) });
      datos.floraciones.push({ id: id("flo"), loteId: lote.id, fecha: dia(-402), intensidad: "buena", principal: true, creado: dia(-401) });
      muestreoBroca(lote, -9 - i, finca.broca[i], finca.broca[i] >= 2 ? { A: 30, B: 26, C: 26, D: 18 } : null);
      muestreoRoya(lote, -14 - i, finca.roya[i]);
      const cereza = areaHa * 12.5 * 125 * 5 * entre(0.8, 1.1);
      for (let p = 0; p < 6; p += 1) {
        datos.recolecciones.push({ id: id("rec"), loteId: lote.id, fecha: dia(-200 + p * 16), recolector: "Cuadrilla", kgCereza: Math.round(cereza * [0.08, 0.16, 0.22, 0.24, 0.18, 0.12][p]), pagoKg: 1200, creado: dia(-200 + p * 16) });
      }
    });
  }

  return datos;
}
