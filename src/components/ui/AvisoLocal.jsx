import { useState } from "react";
import { Link } from "react-router-dom";
import { HardDrive, X } from "lucide-react";
import { useSesion } from "@/utilidades/autenticacion";

const CLAVE = "cv:aviso-local-cerrado";

/*
  La app no tiene servidor: los datos y las cuentas viven en este navegador.
  Se dice una vez, claro, y se puede cerrar (PRODUCT.md → «nada de mentira»).
*/
export default function AvisoLocal() {
  const sesion = useSesion();
  const [cerrado, setCerrado] = useState(() => {
    try {
      return localStorage.getItem(CLAVE) === "1";
    } catch {
      return false;
    }
  });
  if (cerrado) return null;
  const cerrar = () => {
    setCerrado(true);
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {
      // Sin almacenamiento: vuelve a salir la próxima vez.
    }
  };
  return (
    <aside className="mb-5 flex items-start gap-3 rounded-2xl border border-niebla-oscura/25 bg-niebla/70 px-4 py-3 text-[0.95rem]">
      <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-niebla-oscura" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-tierra">
        <strong>Tus datos se guardan en este celular o computador.</strong> Funciona sin señal; descarga un respaldo de vez en cuando desde{" "}
        <Link to={sesion?.rol === "administrador" ? "/admin/datos" : "/finca/perfil"} className="font-bold underline decoration-2 underline-offset-2">
          {sesion?.rol === "administrador" ? "Datos y respaldo" : "Mi cuenta"}
        </Link>
        .
      </p>
      <button type="button" onClick={cerrar} className="-m-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-papel/70" aria-label="Cerrar este aviso">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
