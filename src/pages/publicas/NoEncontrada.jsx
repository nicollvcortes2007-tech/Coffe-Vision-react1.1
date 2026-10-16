import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Ladera } from "@/components/marca/Pictogramas";
import { ROLES, useSesion } from "@/utilidades/autenticacion";

export default function NoEncontrada() {
  const sesion = useSesion();
  useEffect(() => {
    document.title = "Página no encontrada · Coffee+Visión";
  }, []);
  const destino = sesion ? ROLES[sesion.rol]?.inicio : "/";
  return (
    <main id="contenido" className="curvas-nivel grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <Ladera className="mx-auto h-16 w-16 text-cereza" />
        <p className="rotulo mt-6">Error 404</p>
        <h1 className="titular mt-2 text-[2.6rem]">Este camino no lleva a ningún lote</h1>
        <p className="mt-3 text-tierra-media">Revisa la dirección o vuelve al inicio.</p>
        <Link to={destino} className="boton-primario mt-8">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
