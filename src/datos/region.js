import { useMemo } from "react";
import { useDatos } from "./almacen.js";
import { filtrarFinca } from "./miFincaBase.js";
import { lotesConEstado, estadoLote } from "./reglas.js";
import { resumenFinanciero, areaTotal, ultimo } from "./calculos.js";
import { anioCafetero, evaluarBroca, evaluarRoya } from "./agronomia.js";
import { useCuentas } from "@/utilidades/autenticacion";

/*
  Vista del administrador: todas las fincas registradas en este equipo, con el
  estado de sus lotes y sus cifras del año cafetero.
*/
export function useRegion() {
  const datos = useDatos();
  const cuentas = useCuentas();
  return useMemo(() => {
    const anio = anioCafetero();
    const fincas = datos.fincas.map((finca) => {
      const propios = filtrarFinca(datos, finca.id);
      const lotes = lotesConEstado(propios, { finca });
      const avisos = lotes.flatMap((l) => l.avisos);
      const resumen = resumenFinanciero(propios, anio);
      const broca = lotes.map((l) => ultimo(propios.muestreos, (m) => m.loteId === l.id && m.tipo === "broca")).filter(Boolean);
      const roya = lotes.map((l) => ultimo(propios.muestreos, (m) => m.loteId === l.id && m.tipo === "roya")).filter(Boolean);
      const registros = [...propios.labores, ...propios.recolecciones, ...propios.muestreos, ...propios.floraciones, ...propios.ventas];
      return {
        ...finca,
        cuenta: cuentas.find((c) => c.fincaId === finca.id) ?? null,
        lotes,
        avisos,
        estado: estadoLote(avisos, { tieneDatos: lotes.length > 0 }),
        area: areaTotal(lotes),
        resumen,
        brocaPromedio: broca.length ? broca.reduce((s, m) => s + evaluarBroca(m).infestacion, 0) / broca.length : null,
        royaPromedio: roya.length ? roya.reduce((s, m) => s + evaluarRoya(m).incidencia, 0) / roya.length : null,
        ultimaActividad: registros.map((r) => r.fecha).sort().at(-1) ?? null,
      };
    });
    return { fincas, anio, precios: datos.precios, cuentas };
  }, [datos, cuentas]);
}
