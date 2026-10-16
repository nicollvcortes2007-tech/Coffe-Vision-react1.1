import { useMemo } from "react";
import { useMiFinca } from "./miFinca.js";
import { useClima } from "./clima.js";
import { lotesConEstado, avisosFinca, avisosClima } from "./reglas.js";
import { redondearParaTerceros } from "@/utilidades/geo";

/* La finca en sesión con el estado de cada lote, los avisos del día y el clima. */
export function useFinca({ conClima = true } = {}) {
  const base = useMiFinca();
  const lat = base.finca?.lat;
  const lon = base.finca?.lon;
  const clima = useClima(conClima && Number.isFinite(lat) ? redondearParaTerceros(lat) : NaN, conClima && Number.isFinite(lon) ? redondearParaTerceros(lon) : NaN);
  const lotes = useMemo(() => lotesConEstado(base, { finca: base.finca }), [base]);
  const avisos = useMemo(() => {
    const deClima = avisosClima(clima.datos?.clima, lotes);
    return [...avisosFinca(lotes), ...deClima].sort((a, b) => peso(b.nivel) - peso(a.nivel));
  }, [lotes, clima.datos]);
  return { ...base, lotes, avisos, clima };
}

const peso = (nivel) => ({ actuar: 4, vigilar: 3, sinDatos: 2, info: 1 })[nivel] ?? 0;
