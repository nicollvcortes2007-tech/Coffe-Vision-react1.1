import { generarSemilla } from "@/datos/semilla";
import { filtrarFinca } from "@/datos/miFincaBase";
import { lotesConEstado, floracionVigente } from "@/datos/reglas";
import { evaluarBroca, evaluarRoya, DIAS, variedad } from "@/datos/agronomia";
import { ultimo, precioVigente } from "@/datos/calculos";
import { diasEntre, sumarDias } from "@/utilidades/formato";

/*
  La finca de ejemplo de la landing: la misma semilla que usa la app («La Esperanza»,
  ficticia, en una vereda rural de Timbío), con las reglas de Cenicafé aplicadas a
  cada lote. El relieve va horneado en public/finca-demo para no depender de la red.
*/
export const RELIEVE_DEMO = "/finca-demo/relieve-160.png";
export const EXTENSION_DEMO = 1300; // metros por lado del relieve horneado

export function crearFincaDemo(hoy = new Date()) {
  const datos = generarSemilla(hoy);
  const base = filtrarFinca(datos, "fin-esperanza");
  const lotes = lotesConEstado(base, { finca: base.finca, hoy }).map((lote) => {
    const muestraBroca = ultimo(base.muestreos, (m) => m.loteId === lote.id && m.tipo === "broca");
    const muestraRoya = ultimo(base.muestreos, (m) => m.loteId === lote.id && m.tipo === "roya");
    const floracion = floracionVigente(base.floraciones, lote.id, hoy);
    return {
      ...lote,
      variedadNombre: variedad(lote.variedad).nombre,
      arboles: Math.round((lote.densidad || 0) * (lote.areaHa || 0)),
      broca: muestraBroca ? { ...evaluarBroca(muestraBroca), fecha: muestraBroca.fecha } : null,
      roya: muestraRoya ? { ...evaluarRoya(muestraRoya), fecha: muestraRoya.fecha } : null,
      floracion: floracion ? { fecha: floracion.fecha, dias: diasEntre(floracion.fecha, hoy), cosecha: sumarDias(floracion.fecha, DIAS.cosecha) } : null,
    };
  });
  return { finca: base.finca, lotes, precio: precioVigente(datos.precios) };
}

/* Capas de la leyenda: cada una pinta las placas con su propia regla publicada. */
export const CAPAS = [
  {
    id: "estado",
    nombre: "Estado",
    leyenda: [
      ["actuar", "Actuar hoy"],
      ["vigilar", "Vigilar"],
      ["ok", "Al día"],
      ["sinDatos", "Sin datos"],
    ],
    pintar: (lote) => lote.estado,
  },
  {
    id: "broca",
    nombre: "Broca",
    leyenda: [
      ["actuar", "5 % o más: daño económico"],
      ["vigilar", "2 % a 5 %: umbral de acción"],
      ["ok", "Menos de 2 %"],
      ["sinDatos", "Sin muestreo"],
    ],
    pintar: (lote) => (!lote.broca ? "sinDatos" : lote.broca.infestacion >= 5 ? "actuar" : lote.broca.infestacion >= 2 ? "vigilar" : "ok"),
  },
  {
    id: "roya",
    nombre: "Roya",
    leyenda: [
      ["actuar", "Más de 5 %: aplicar"],
      ["ok", "5 % o menos"],
      ["sinDatos", "Sin muestreo"],
    ],
    pintar: (lote) => (!lote.roya ? "sinDatos" : lote.roya.incidencia > 5 ? "actuar" : "ok"),
  },
];
