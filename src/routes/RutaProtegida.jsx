import { Navigate, useLocation } from "react-router-dom";
import { ROLES, useSesion } from "@/utilidades/autenticacion";

/* Sin sesión → al acceso (y de vuelta después). Con otro rol → a su propio inicio. */
export default function RutaProtegida({ rol, children }) {
  const sesion = useSesion();
  const { pathname, search } = useLocation();
  if (!sesion) {
    return <Navigate to={`/acceso?siguiente=${encodeURIComponent(pathname + search)}`} replace />;
  }
  if (rol && sesion.rol !== rol) {
    return <Navigate to={ROLES[sesion.rol]?.inicio ?? "/"} replace />;
  }
  return children;
}
