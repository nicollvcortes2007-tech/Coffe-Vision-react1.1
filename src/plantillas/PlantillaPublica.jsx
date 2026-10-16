import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logotipo } from "@/components/marca/Marca";
import RelieveFijo from "@/components/finca3d/RelieveFijo";
import { gms } from "@/components/finca3d/coordenadas";
import { crearFincaDemo, RELIEVE_DEMO, EXTENSION_DEMO } from "@/pages/publicas/landing/fincaDemo";

/* Acceso y registro: el formulario en Cal y, al lado, la finca de ejemplo vista desde arriba. */
export default function PlantillaPublica({ titulo, bajada, children, ancho = "max-w-md" }) {
  const demo = useMemo(() => crearFincaDemo(), []);
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="tema-basalto reticula relative hidden overflow-hidden bg-basalto lg:block" aria-hidden="true">
        <RelieveFijo
          url={RELIEVE_DEMO}
          lat={demo.finca.lat}
          lon={demo.finca.lon}
          extension={EXTENSION_DEMO}
          lotes={demo.lotes}
          className="absolute top-[8%] left-1/2 aspect-square w-[min(78%,34rem)] -translate-x-1/2 rounded-full shadow-[0_0_0_1px_rgb(233_234_228/0.25),0_0_0_10px_rgb(14_15_12),0_0_0_11px_rgb(233_234_228/0.12)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-basalto via-basalto/30 to-transparent" />
        <div className="absolute inset-x-12 bottom-12 text-niebla">
          <p className="font-mono text-[0.6875rem] tracking-[0.06em] text-ceniza uppercase">Finca de ejemplo · Timbío, Cauca · {gms(demo.finca.lat, demo.finca.lon)}</p>
          <p className="titular-mayor mt-4 text-[clamp(2.4rem,3.6vw,3.6rem)]">
            Lo de la finca, <span className="text-amarillo">a la mano.</span>
          </p>
          <p className="mt-4 max-w-md text-niebla/80">Broca, roya, cosecha y costos con las reglas de Cenicafé. Funciona sin señal.</p>
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
          {bajada && <p className="mt-2 text-grafito">{bajada}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
