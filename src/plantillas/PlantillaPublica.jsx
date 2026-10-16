import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logotipo } from "@/components/marca/Marca";
import LaderaSVG from "@/components/ladera/LaderaSVG";

const LOTES = [
  { id: "a", nombre: "La Loma", estado: "ok" },
  { id: "b", nombre: "El Mirador", estado: "vigilar" },
  { id: "c", nombre: "Guaduales", estado: "actuar" },
  { id: "d", nombre: "La Cañada", estado: "vigilar" },
  { id: "e", nombre: "Alto Bonito", estado: "ok" },
];

/* Acceso y registro: tarjeta de papel sobre la ladera, con la marca y volver al inicio. */
export default function PlantillaPublica({ titulo, bajada, children, ancho = "max-w-md" }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-tostado lg:block" aria-hidden="true">
        <div className="absolute inset-0 opacity-90">
          <LaderaSVG lotes={LOTES} className="h-full w-full object-cover [&_text]:hidden" titulo="Ladera" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-tostado via-tostado/40 to-transparent" />
        <div className="absolute inset-x-12 bottom-12 text-papel">
          <p className="titular text-[2.6rem] leading-tight">
            Lo que pasa en el lote, <em className="text-pinton">anotado y a la mano.</em>
          </p>
          <p className="mt-3 max-w-md text-papel/80">Broca, roya, cosecha y costos con las reglas de Cenicafé. Funciona sin señal.</p>
        </div>
      </aside>
      <main id="contenido" className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="boton-fantasma -ml-3">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Inicio
          </Link>
          <Logotipo />
        </div>
        <div className={`mx-auto my-auto w-full ${ancho} py-10`}>
          <h1 className="titular text-[2.4rem]">{titulo}</h1>
          {bajada && <p className="mt-2 text-tierra-media">{bajada}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
