import { DIAS, esSusceptible, etapaLote, evaluarBroca, evaluarRoya, FUENTES } from "./agronomia.js";
import { ultimo } from "./calculos.js";
import { diasEntre, hoyISO, sumarDias, fCorta } from "../utilidades/formato.js";

/*
  Motor de avisos de «Hoy en la finca». Cada aviso dice qué hacer, en qué lote, por
  qué (con su regla) y de dónde sale la regla. El estado del lote es el aviso más
  grave: actuar > vigilar > ok; «sinDatos» si no hay con qué juzgarlo.
*/

const PESO = { actuar: 3, vigilar: 2, info: 1, ok: 0, sinDatos: 0 };

function aviso(lote, nivel, titulo, razon, fuente, extra = {}) {
  return { id: `${lote?.id ?? "finca"}-${titulo}`, loteId: lote?.id ?? null, loteNombre: lote?.nombre ?? null, nivel, titulo, razon, fuente, ...extra };
}

/* Floración principal de referencia: la más reciente dentro de un ciclo (≤ 260 días). */
export function floracionVigente(floraciones, loteId, hoy = new Date()) {
  const delLote = floraciones.filter((item) => item.loteId === loteId && diasEntre(item.fecha, hoy) >= 0 && diasEntre(item.fecha, hoy) <= 260);
  if (!delLote.length) return null;
  const principales = delLote.filter((item) => item.principal);
  return ultimo(principales.length ? principales : delLote);
}

export function avisosLote(lote, datos, { finca, hoy = new Date() } = {}) {
  const avisos = [];
  const hoyTxt = hoyISO(hoy);
  const etapa = etapaLote(lote, { altitud: finca?.altitud, hoy });
  const floracion = floracionVigente(datos.floraciones, lote.id, hoy);
  const dias = floracion ? diasEntre(floracion.fecha, hoy) : null;
  const muestreosLote = datos.muestreos.filter((item) => item.loteId === lote.id);
  const ultimoBroca = ultimo(muestreosLote, (item) => item.tipo === "broca");
  const ultimoRoya = ultimo(muestreosLote, (item) => item.tipo === "roya");

  // Carencia: no cosechar mientras dure el período de carencia de una aplicación.
  for (const aplicacion of datos.aplicaciones.filter((item) => item.loteId === lote.id && Number(item.carenciaDias) > 0)) {
    const libre = hoyISO(sumarDias(aplicacion.fecha, Number(aplicacion.carenciaDias)));
    if (libre > hoyTxt) {
      avisos.push(
        aviso(lote, "actuar", `No cosechar hasta el ${fCorta(libre)}`, `${aplicacion.producto} se aplicó el ${fCorta(aplicacion.fecha)} y tiene ${aplicacion.carenciaDias} días de carencia.`, {
          texto: "Res. ICA 30021 de 2017, num. 10.1.2: registro del período de carencia",
          url: "https://faolex.fao.org/docs/pdf/col169216.pdf",
        }, { tipo: "carencia" }),
      );
    }
  }

  // Broca: resultado del último muestreo y muestreo mensual desde el período crítico.
  const controladaDespues =
    ultimoBroca && datos.aplicaciones.some((item) => item.loteId === lote.id && item.motivo === "broca" && item.fecha >= ultimoBroca.fecha);
  if (ultimoBroca && diasEntre(ultimoBroca.fecha, hoy) <= 45 && !controladaDespues) {
    const r = evaluarBroca(ultimoBroca);
    if (r.nivel !== "ok") {
      avisos.push(
        aviso(lote, r.nivel, r.aplicar ? "Controlar la broca" : r.infestacion >= 5 ? "Broca en nivel de daño" : "Broca sobre el umbral", `${r.infestacion.toFixed(1)} % de frutos brocados el ${fCorta(ultimoBroca.fecha)}. ${r.recomendacion}`, FUENTES.broca, {
          tipo: "broca",
          accion: { registrar: "muestreo-broca", texto: "Nuevo muestreo" },
        }),
      );
    }
  }
  if (dias !== null && dias >= DIAS.brocaCritico && dias <= DIAS.cosechaHasta + 30) {
    const desdeUltimo = ultimoBroca ? diasEntre(ultimoBroca.fecha, hoy) : Infinity;
    if (desdeUltimo > 30) {
      avisos.push(
        aviso(lote, "vigilar", "Muestrear broca", `Van ${dias} días desde la floración del ${fCorta(floracion.fecha)}: es el período crítico (desde el día ${DIAS.brocaCritico}). ${ultimoBroca ? `El último muestreo fue hace ${desdeUltimo} días.` : "No hay muestreos registrados."}`, FUENTES.broca, {
          tipo: "broca",
          accion: { registrar: "muestreo-broca", texto: "Muestrear ahora" },
        }),
      );
    }
  }

  // Roya: primera aplicación en susceptibles, muestreos y último resultado.
  if (dias !== null && esSusceptible(lote)) {
    const aplicada = datos.aplicaciones.some((item) => item.loteId === lote.id && item.motivo === "roya" && item.fecha >= floracion.fecha);
    const faltan = DIAS.royaPrimeraAplicacion - dias;
    if (!aplicada && faltan <= 10 && faltan >= -20) {
      avisos.push(
        aviso(lote, faltan <= 0 ? "actuar" : "vigilar", "Primera aplicación contra la roya", `Variedad susceptible: Cenicafé indica aplicar a los ${DIAS.royaPrimeraAplicacion} días de la floración principal (${fCorta(sumarDias(floracion.fecha, DIAS.royaPrimeraAplicacion))}). Después pierde efecto.`, FUENTES.royaCalendario, {
          tipo: "roya",
          accion: { registrar: "aplicacion", texto: "Registrar aplicación" },
        }),
      );
    }
  }
  if (dias !== null) {
    const proximo = DIAS.muestreosRoya.find((d) => Math.abs(d - dias) <= 7);
    const hechoCerca = ultimoRoya && Math.abs(diasEntre(ultimoRoya.fecha, hoy)) <= 10;
    if (proximo && !hechoCerca) {
      avisos.push(
        aviso(lote, "vigilar", "Muestrear roya", `Toca el muestreo de los ${proximo} días después de la floración (10 árboles × 10 ramas).`, FUENTES.roya, {
          tipo: "roya",
          accion: { registrar: "muestreo-roya", texto: "Muestrear ahora" },
        }),
      );
    }
  }
  if (ultimoRoya && diasEntre(ultimoRoya.fecha, hoy) <= 45) {
    const r = evaluarRoya(ultimoRoya);
    if (r.nivel === "actuar") {
      avisos.push(aviso(lote, "actuar", "Roya sobre el 5 %", `${r.incidencia.toFixed(1)} % de hojas con roya el ${fCorta(ultimoRoya.fecha)}. ${r.recomendacion}`, FUENTES.roya, { tipo: "roya" }));
    }
  }

  // Cosecha: ventana estimada y repase al terminar.
  if (dias !== null && dias >= DIAS.cosechaDesde - 14 && dias <= DIAS.cosechaHasta) {
    const fecha = sumarDias(floracion.fecha, DIAS.cosecha);
    avisos.push(
      aviso(lote, "info", dias < DIAS.cosechaDesde ? "Se acerca la cosecha" : "Cosecha en curso", `Por la floración del ${fCorta(floracion.fecha)}, el pico se espera hacia el ${fCorta(fecha)} (unas 32 semanas).`, FUENTES.fenologia, {
        tipo: "cosecha",
        accion: { registrar: "recoleccion", texto: "Registrar recolección" },
      }),
    );
  }
  const recoleccionesLote = datos.recolecciones.filter((item) => item.loteId === lote.id);
  const ultimaRecoleccion = ultimo(recoleccionesLote);
  if (ultimaRecoleccion) {
    const desde = diasEntre(ultimaRecoleccion.fecha, hoy);
    const huboRepase = datos.labores.some((item) => item.loteId === lote.id && item.tipo === "repase" && item.fecha > ultimaRecoleccion.fecha);
    if (desde >= 14 && desde <= 35 && !huboRepase) {
      avisos.push(
        aviso(lote, "vigilar", "Hacer el repase", `La última recolección fue hace ${desde} días. Cenicafé indica repasar de 2 a 3 semanas después: deben quedar menos de 5 frutos por árbol y 5 en el suelo.`, FUENTES.broca, {
          tipo: "cosecha",
          accion: { registrar: "labor", texto: "Registrar repase", tipoLabor: "repase" },
        }),
      );
    }
  }

  // Renovación y datos faltantes.
  if (etapa.id === "renovar") {
    avisos.push(aviso(lote, "vigilar", "Planear la renovación", `El lote lleva ${etapa.cosechas} cosechas en este ciclo. Cenicafé sugiere renovar a las 4 o 5 cosechas, por quintas partes de la finca.`, FUENTES.renovacion, { tipo: "renovacion" }));
  }
  if (!floracion && etapa.id !== "levante") {
    avisos.push(
      aviso(lote, "sinDatos", "Registrar la floración", "Sin la fecha de la floración principal no se pueden calcular la cosecha ni los muestreos.", FUENTES.fenologia, {
        tipo: "floracion",
        accion: { registrar: "floracion", texto: "Registrar floración" },
      }),
    );
  }
  return avisos;
}

export function estadoLote(avisos, { tieneDatos = true } = {}) {
  if (avisos.some((item) => item.nivel === "actuar")) return "actuar";
  if (avisos.some((item) => item.nivel === "vigilar")) return "vigilar";
  if (!tieneDatos || avisos.some((item) => item.nivel === "sinDatos")) return "sinDatos";
  return "ok";
}

export const TEXTO_ESTADO = { actuar: "Actuar hoy", vigilar: "Vigilar", ok: "Al día", sinDatos: "Sin datos" };

export function lotesConEstado(datos, opciones = {}) {
  return datos.lotes.map((lote) => {
    const avisos = avisosLote(lote, datos, opciones);
    const etapa = etapaLote(lote, { altitud: opciones.finca?.altitud, hoy: opciones.hoy });
    const tieneDatos =
      etapa.id === "levante" || datos.muestreos.some((item) => item.loteId === lote.id) || datos.floraciones.some((item) => item.loteId === lote.id);
    const estado = estadoLote(avisos, { tieneDatos });
    return { ...lote, avisos, estado, estadoTexto: TEXTO_ESTADO[estado], etapa };
  });
}

export function avisosFinca(lotes) {
  return lotes.flatMap((lote) => lote.avisos).sort((a, b) => PESO[b.nivel] - PESO[a.nivel]);
}

/* ---- Avisos del clima (interpretación sobre hechos citados; ver 02-dominio, §2.8) ---- */
export function avisosClima(clima, lotes, { hoy = new Date() } = {}) {
  if (!clima?.dias?.length) return [];
  const avisos = [];
  const hoyTxt = hoyISO(hoy);
  const pasados = clima.dias.filter((dia) => dia.fecha < hoyTxt);
  const futuros = clima.dias.filter((dia) => dia.fecha >= hoyTxt);

  // Floración probable: ≥ 10 días secos seguidos de un día con más de 10 mm.
  for (let i = pasados.length - 1; i >= 10; i -= 1) {
    if (pasados[i].lluvia > 10 && pasados.slice(i - 10, i).every((dia) => dia.lluvia < 1) && diasEntre(pasados[i].fecha, hoy) <= 12) {
      avisos.push({
        id: "clima-floracion",
        nivel: "vigilar",
        titulo: "Floración probable",
        razon: `Llovió ${Math.round(pasados[i].lluvia)} mm el ${fCorta(pasados[i].fecha)} después de 10 días secos: la flor suele abrir 7 a 10 días después. Regístrela cuando la vea.`,
        fuente: FUENTES.floracionLluvia,
        accion: { registrar: "floracion", texto: "Registrar floración" },
        tipo: "clima",
      });
      break;
    }
  }

  // No asperjar con lluvia probable (la primera lluvia lava la mitad del fungicida cúprico).
  const manana = futuros[1];
  if (manana && manana.probLluvia >= 60) {
    avisos.push({
      id: "clima-no-asperjar",
      nivel: "info",
      titulo: "Mañana no es buen día para asperjar",
      razon: `${manana.probLluvia} % de probabilidad de lluvia. La primera lluvia después de aplicar lava la mitad del fungicida cúprico.`,
      fuente: { texto: "Gil, Castro y Cadena (Cenicafé, 2003), Enfermedades del cafeto en Colombia", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/993/22/20.%20Roya%20anaranjada.pdf" },
      tipo: "clima",
    });
  }

  // Balance hídrico de los últimos 30 días (lluvia − ET0) mientras hay fruto en llenado.
  const ultimos30 = pasados.slice(-30);
  const balance = ultimos30.reduce((suma, dia) => suma + dia.lluvia - (dia.et0 ?? 0), 0);
  const hayLlenado = lotes.some((lote) => lote.avisos?.some((item) => item.tipo === "broca"));
  if (ultimos30.length >= 25 && balance < -40 && hayLlenado) {
    avisos.push({
      id: "clima-deficit",
      nivel: "vigilar",
      titulo: "Déficit de agua",
      razon: `En 30 días llovió ${Math.round(balance + ultimos30.reduce((s, d) => s + (d.et0 ?? 0), 0))} mm y se evaporaron más: balance de ${Math.round(balance)} mm. El fruto en llenado sufre; con sequía la broca vuela más al volver las lluvias.`,
      fuente: FUENTES.broca,
      tipo: "clima",
    });
  }
  return avisos;
}
