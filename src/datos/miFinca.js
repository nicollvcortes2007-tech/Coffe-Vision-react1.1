import { useMemo } from "react";
import { useDatos } from "./almacen.js";
import { filtrarFinca } from "./miFincaBase.js";
import { useSesion } from "@/utilidades/autenticacion";

export { filtrarFinca };

/* Datos de la finca de la persona en sesión. */
export function useMiFinca() {
  const sesion = useSesion();
  const datos = useDatos();
  return useMemo(() => ({ sesion, ...filtrarFinca(datos, sesion?.fincaId) }), [datos, sesion]);
}
