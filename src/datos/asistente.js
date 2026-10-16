import { normalizar, cop, num, ent, fLarga, fCorta, hoyISO, sumarDias } from "../utilidades/formato.js";
import { buscarGuias, mejorPunto } from "../utilidades/buscar.js";
import { GUIAS } from "./guias.js";
import { movimientosCosto, produccion, resumenFinanciero, kgPorRecolector, precioVigente, ultimo } from "./calculos.js";
import { anioCafetero, ACTIVIDADES, evaluarBroca, evaluarRoya, DIAS, FUENTES, aCps, aArrobas, aCargas, precioCargaPorFR, FR_BASE, COSTO_REFERENCIA_CARGA, esSusceptible } from "./agronomia.js";
import { floracionVigente } from "./reglas.js";
import { describirTiempo } from "./clima.js";

/*
  Asistente de la finca. No es un modelo de lenguaje: entiende un conjunto de
  preguntas por palabras clave y responde con los datos registrados y las reglas de
  Cenicafé, citando la fuente. Si no entiende, busca en las guías y, si tampoco,
  lo dice y sugiere AdrIAna (el chatbot de Cenicafé, en línea).
*/

const ADRIANA = { texto: "AdrIAna, el asistente de Cenicafé (necesita internet)", a: "https://www.cenicafe.org/" };

export const SUGERENCIAS = [
  "¿Qué tengo pendiente hoy?",
  "¿Cómo está la broca?",
  "¿Cuánto gasté en abono este año?",
  "¿Cuántas cargas llevo?",
  "¿Cuándo es la cosecha?",
  "¿Cuánto me pagan por 500 kilos de pergamino?",
  "¿Va a llover mañana?",
  "¿Cuánto me cuesta producir una carga?",
];

const tiene = (texto, ...patrones) => patrones.some((p) => (p instanceof RegExp ? p.test(texto) : texto.includes(p)));

function loteMencionado(texto, lotes) {
  return lotes.find((lote) => texto.includes(normalizar(lote.nombre))) ?? null;
}

function periodo(texto, hoy) {
  if (tiene(texto, "semana")) return { desde: hoyISO(sumarDias(hoy, -6)), hasta: hoyISO(hoy), nombre: "en los últimos 7 días" };
  if (tiene(texto, /\bmes\b/)) return { desde: hoyISO(sumarDias(hoy, -29)), hasta: hoyISO(hoy), nombre: "en los últimos 30 días" };
  const anio = anioCafetero(hoy);
  return { desde: anio.inicio, hasta: anio.fin, nombre: `en el año cafetero ${anio.nombre}` };
}

const ACTIVIDAD_PALABRAS = [
  [/abon|fertiliz|nutric|urea|cal\b|encal/, "nutricion"],
  [/recolec|recog|cosech|jornal de cosecha/, "recoleccion"],
  [/fungic|insectic|beauveria|fumig|aplicac|roya|broca|fitosan/, "fitosanitario"],
  [/arvens|maleza|guada|plateo|desyerb|herbic/, "arvenses"],
  [/benefic|secad|despulp|energ/, "beneficio"],
  [/siembr|zoca|renov|almacig/, "instalacion"],
  [/transport|flete/, "otras"],
  [/administ|contador|analisis/, "administracion"],
];

function numeros(texto) {
  return [...texto.matchAll(/(\d[\d.]*,?\d*)/g)].map((m) => Number(m[1].replace(/\./g, "").replace(",", ".")));
}

export function responder(pregunta, contexto) {
  const { lotes = [], finca, clima, avisos = [], hoy = new Date() } = contexto;
  const texto = normalizar(pregunta);
  const lote = loteMencionado(texto, lotes);
  const precio = precioVigente(contexto.precios ?? []);

  if (!texto) return { texto: "Escríbeme una pregunta sobre tu finca." };

  if (tiene(texto, /^(hola|buen[oa]s|que mas|saludos)/) && texto.length < 30) {
    return { texto: `¡Hola! Pregúntame por tus lotes, tus gastos, tus kilos, la broca, la roya, el clima o el precio. Respondo con lo que tienes registrado en ${finca?.nombre ?? "tu finca"}.`, sugerencias: SUGERENCIAS.slice(0, 4) };
  }

  // Pendientes del día.
  if (tiene(texto, "pendiente", "que hago", "que tengo que", "que hay que", "para hoy", "que toca")) {
    const lista = avisos.filter((a) => a.nivel !== "info");
    if (!lista.length) return { texto: "Según tus registros, ningún lote pide atención hoy. Sigue anotando floraciones y muestreos." };
    return {
      texto: `Tienes ${lista.length} ${lista.length === 1 ? "cosa" : "cosas"} para hoy:`,
      lineas: lista.slice(0, 6).map((a) => `${a.loteNombre ? `${a.loteNombre}: ` : ""}${a.titulo}`),
      enlaces: [{ texto: "Ver «Hoy en la finca»", a: "/finca" }],
    };
  }

  // Precio y valor de una venta.
  if (tiene(texto, "precio", "cuanto pagan", "cuanto me pagan", "cuanto recibo", "vale la carga", "cuanto vale")) {
    if (!precio) return { texto: "El administrador todavía no ha registrado el precio de referencia de la FNC." };
    const kg = numeros(texto).find((n) => n >= 10);
    const fr = numeros(texto).find((n) => n >= 80 && n <= 110 && n !== kg) ?? FR_BASE;
    const porCarga = precioCargaPorFR(precio.precioCarga, fr, precio.pasillaKg);
    if (kg && tiene(texto, "kilo", "kg")) {
      const esCereza = tiene(texto, "cereza");
      const cps = esCereza ? aCps(kg) : kg;
      return {
        texto: `Por ${ent(kg)} kg de ${esCereza ? `cereza (≈ ${num(cps)} kg de pergamino)` : "pergamino seco"} con factor ${fr}, serían unos ${cop(aCargas(cps) * porCarga)}.`,
        lineas: [`Precio de referencia del ${fLarga(precio.fecha)}: ${cop(precio.precioCarga)} la carga con factor 94.`, "La cooperativa descuenta el acopio y los defectos de taza."],
        fuente: FUENTES.fr,
      };
    }
    return { texto: `El precio de referencia registrado es ${cop(precio.precioCarga)} por carga de 125 kg de pergamino con factor 94 (${fLarga(precio.fecha)}).${fr !== FR_BASE ? ` Con factor ${fr}: ${cop(porCarga)}.` : ""}`, fuente: { texto: precio.fuente, url: precio.url } };
  }

  // Conversión de cereza a pergamino.
  if (tiene(texto, "cereza") && tiene(texto, "pergamino", "arroba", "carga", "convert", "cuanto da", "cuanto sale")) {
    const kg = numeros(texto)[0];
    if (kg) {
      const cps = aCps(kg);
      return { texto: `${ent(kg)} kg de cereza dan unos ${num(cps)} kg de pergamino seco: ${num(aArrobas(cps))} arrobas o ${num(aCargas(cps))} cargas.`, fuente: FUENTES.conversion };
    }
  }

  // Costo por carga.
  if (tiene(texto, "costo por carga", "cuesta producir", "cuesta la carga", "costo de produccion", "cuanto me cuesta")) {
    const r = resumenFinanciero(contexto, anioCafetero(hoy));
    if (!r.costoPorCarga) return { texto: "Todavía no puedo calcularlo: faltan costos o kilos de cosecha registrados este año cafetero." };
    return {
      texto: `Producir una carga te está costando ${cop(r.costoPorCarga)} este año cafetero (${cop(r.costoTotal)} ÷ ${num(r.produccion.cargas)} cargas).`,
      lineas: [`El promedio nacional estimado por la FNC es ${cop(COSTO_REFERENCIA_CARGA)}.`, precio ? `El precio de referencia de hoy es ${cop(precio.precioCarga)}.` : null].filter(Boolean),
      fuente: FUENTES.costos,
      enlaces: [{ texto: "Ver costos", a: "/finca/costos" }],
    };
  }

  // Gastos.
  if (tiene(texto, "gast", "cost", "plata", "invert", "pague", "pagué")) {
    const p = periodo(texto, hoy);
    const actividad = ACTIVIDAD_PALABRAS.find(([patron]) => patron.test(texto))?.[1];
    const recolector = contexto.trabajadores?.find((t) => texto.includes(normalizar(t.nombre)));
    if (recolector) {
      const datosR = kgPorRecolector(contexto.recolecciones.filter((r) => r.recolector === recolector.nombre), { desde: p.desde, hasta: p.hasta })[0];
      return datosR
        ? { texto: `A ${recolector.nombre} le corresponden ${cop(datosR.pago)} por ${ent(datosR.kg)} kg de cereza ${p.nombre} (${datosR.dias} días).` }
        : { texto: `No hay recolecciones de ${recolector.nombre} ${p.nombre}.` };
    }
    const movimientos = movimientosCosto(contexto, { desde: p.desde, hasta: p.hasta, loteId: lote?.id }).filter((m) => !actividad || m.actividad === actividad);
    const total = movimientos.reduce((s, m) => s + m.valor, 0);
    const nombreActividad = actividad ? ACTIVIDADES.find((a) => a.id === actividad)?.nombre.toLowerCase() : null;
    if (!movimientos.length) return { texto: `No encuentro gastos${nombreActividad ? ` de ${nombreActividad}` : ""}${lote ? ` en ${lote.nombre}` : ""} ${p.nombre}.` };
    const mayores = [...movimientos].sort((a, b) => b.valor - a.valor).slice(0, 3);
    return {
      texto: `${lote ? `En ${lote.nombre}` : "En la finca"} gastaste ${cop(total)}${nombreActividad ? ` en ${nombreActividad}` : ""} ${p.nombre}, en ${movimientos.length} registros.`,
      lineas: mayores.map((m) => `${fCorta(m.fecha)} · ${m.concepto}: ${cop(m.valor)}`),
      enlaces: [{ texto: "Ver todos los costos", a: "/finca/costos" }],
    };
  }

  // Producción.
  if (tiene(texto, "kilo", "carga", "arroba", "produc", "recog", "cuanto llevo", "cuanto cafe") && !tiene(texto, "cuando")) {
    const p = periodo(texto, hoy);
    const prod = produccion(contexto, { desde: p.desde, hasta: p.hasta, loteId: lote?.id });
    if (!prod.kgCereza) return { texto: `No hay recolecciones${lote ? ` en ${lote.nombre}` : ""} ${p.nombre}.` };
    return {
      texto: `${lote ? `En ${lote.nombre}` : "En la finca"} llevas ${ent(prod.kgCereza)} kg de cereza ${p.nombre}: unos ${num(prod.arrobas)} arrobas o ${num(prod.cargas)} cargas de pergamino seco.`,
      fuente: FUENTES.conversion,
      enlaces: [{ texto: "Ver cosecha", a: "/finca/cosecha" }],
    };
  }

  // Broca y roya.
  for (const tipo of ["broca", "roya"]) {
    if (!tiene(texto, tipo)) continue;
    const objetivo = lote ? [lote] : lotes;
    if (tiene(texto, "cuando", "toca", "proximo")) {
      const lineas = objetivo
        .map((l) => {
          const f = floracionVigente(contexto.floraciones ?? [], l.id, hoy);
          if (!f) return `${l.nombre}: sin floración registrada`;
          if (tipo === "broca") return `${l.nombre}: período crítico desde el ${fCorta(sumarDias(f.fecha, DIAS.brocaCritico))}, luego cada mes`;
          const proximos = [...(esSusceptible(l) ? [DIAS.royaPrimeraAplicacion] : []), ...DIAS.muestreosRoya].map((d) => sumarDias(f.fecha, d)).filter((d) => d >= sumarDias(hoy, -1));
          return `${l.nombre}: ${proximos.length ? `próximo el ${fCorta(proximos[0])}` : "ciclo terminado"}${esSusceptible(l) ? " (susceptible)" : ""}`;
        })
        .slice(0, 8);
      return { texto: tipo === "broca" ? "Fechas para muestrear la broca:" : "Fechas para la roya:", lineas, fuente: tipo === "broca" ? FUENTES.broca : FUENTES.royaCalendario };
    }
    const lineas = objetivo.map((l) => {
      const m = ultimo(contexto.muestreos ?? [], (x) => x.loteId === l.id && x.tipo === tipo);
      if (!m) return `${l.nombre}: sin muestreos`;
      const r = tipo === "broca" ? evaluarBroca(m) : evaluarRoya(m);
      const pct = tipo === "broca" ? r.infestacion : r.incidencia;
      return `${l.nombre}: ${pct.toFixed(1)} % el ${fCorta(m.fecha)}${r.nivel === "ok" ? "" : " — sobre el umbral"}`;
    });
    const unico = lote ? ultimo(contexto.muestreos ?? [], (x) => x.loteId === lote.id && x.tipo === tipo) : null;
    return {
      texto: tipo === "broca" ? "Último muestreo de broca por lote (umbral de acción: 2 %):" : "Último muestreo de roya por lote (se aplica sobre el 5 %):",
      lineas: [...lineas, ...(unico ? [(tipo === "broca" ? evaluarBroca(unico) : evaluarRoya(unico)).recomendacion] : [])],
      fuente: tipo === "broca" ? FUENTES.broca : FUENTES.roya,
      enlaces: [{ texto: "Ver broca y roya", a: "/finca/sanidad" }],
    };
  }

  // Cosecha: cuándo.
  if (tiene(texto, "cosech", "recolec") && tiene(texto, "cuando", "fecha", "cuanto falta")) {
    const lineas = (lote ? [lote] : lotes).map((l) => {
      const f = floracionVigente(contexto.floraciones ?? [], l.id, hoy);
      return f ? `${l.nombre}: hacia el ${fCorta(sumarDias(f.fecha, DIAS.cosecha))} (floración del ${fCorta(f.fecha)})` : `${l.nombre}: sin floración registrada`;
    });
    return { texto: "El pico de la cosecha llega unas 32 semanas después de la floración:", lineas, fuente: FUENTES.fenologia };
  }

  // Clima.
  if (tiene(texto, "llov", "lluvia", "clima", "tiempo", "temperatura", "calor", "frio")) {
    const dias = clima?.dias ?? [];
    if (!dias.length) return { texto: "No tengo el pronóstico: revisa que la finca esté ubicada y que haya habido señal alguna vez." };
    const quiereManana = tiene(texto, "manana");
    const dia = dias.find((d) => d.fecha === hoyISO(quiereManana ? sumarDias(hoy, 1) : hoy));
    if (!dia) return { texto: "No tengo el pronóstico de ese día." };
    return {
      texto: `${quiereManana ? "Mañana" : "Hoy"}: ${describirTiempo(dia.codigo).texto.toLowerCase()}, entre ${Math.round(dia.min)} y ${Math.round(dia.max)} °C, ${dia.probLluvia} % de probabilidad de lluvia y unos ${num(dia.lluvia)} mm.`,
      lineas: dia.probLluvia >= 60 ? ["Con esa probabilidad, mejor no asperjar: la primera lluvia lava buena parte del producto."] : [],
      fuente: { texto: "Open-Meteo.com (CC BY 4.0)", url: "https://open-meteo.com" },
    };
  }

  // Guías.
  const encontradas = buscarGuias(GUIAS, pregunta);
  if (encontradas.length) {
    const g = encontradas[0].guia;
    const punto = mejorPunto(g, pregunta);
    return {
      texto: punto?.puntaje ? punto.punto : g.resumen,
      lineas: [`De la guía «${g.titulo}».`],
      enlaces: [{ texto: `Leer «${g.titulo}»`, a: `/finca/guias/${g.id}` }, ...encontradas.slice(1, 3).map((r) => ({ texto: r.guia.titulo, a: `/finca/guias/${r.guia.id}` }))],
      fuente: g.fuentes[0],
    };
  }

  return {
    texto: "No sé responder eso con tus datos ni con las guías. Pregúntame por gastos, kilos, broca, roya, cosecha, precio o clima.",
    enlaces: [ADRIANA],
    sugerencias: SUGERENCIAS.slice(0, 4),
  };
}
