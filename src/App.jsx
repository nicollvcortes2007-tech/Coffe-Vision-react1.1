import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import RutaProtegida from "@/routes/RutaProtegida";
import PlantillaApp from "@/plantillas/PlantillaApp";
import { ProveedorAvisos } from "@/components/ui/Avisos";
import { inicializarDatos } from "@/datos/almacen";
import { activarVersion } from "@/pwa/registrar";

const Landing = lazy(() => import("@/pages/publicas/Landing"));
const Acceso = lazy(() => import("@/pages/publicas/Acceso"));
const Registro = lazy(() => import("@/pages/publicas/Registro"));
const Privacidad = lazy(() => import("@/pages/publicas/Privacidad"));
const NoEncontrada = lazy(() => import("@/pages/publicas/NoEncontrada"));

const Hoy = lazy(() => import("@/pages/finca/Hoy"));
const Lotes = lazy(() => import("@/pages/finca/Lotes"));
const Lote = lazy(() => import("@/pages/finca/Lote"));
const Sanidad = lazy(() => import("@/pages/finca/Sanidad"));
const Cosecha = lazy(() => import("@/pages/finca/Cosecha"));
const Costos = lazy(() => import("@/pages/finca/Costos"));
const Clima = lazy(() => import("@/pages/finca/Clima"));
const Diagnostico = lazy(() => import("@/pages/finca/Diagnostico"));
const Guias = lazy(() => import("@/pages/finca/Guias"));
const Guia = lazy(() => import("@/pages/finca/Guia"));
const Asistente = lazy(() => import("@/pages/finca/Asistente"));
const Perfil = lazy(() => import("@/pages/finca/Perfil"));

const Panorama = lazy(() => import("@/pages/admin/Panorama"));
const Fincas = lazy(() => import("@/pages/admin/Fincas"));
const Cuentas = lazy(() => import("@/pages/admin/Cuentas"));
const Precio = lazy(() => import("@/pages/admin/Precio"));
const Datos = lazy(() => import("@/pages/admin/Datos"));

inicializarDatos();

function Cargando() {
  return (
    <div className="grid min-h-[50dvh] place-items-center" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-cal-honda border-t-cereza" aria-label="Cargando" />
    </div>
  );
}

function VersionNueva() {
  const [trabajador, setTrabajador] = useState(null);
  useEffect(() => {
    const oir = (evento) => setTrabajador(evento.detail);
    window.addEventListener("cv-version-nueva", oir);
    return () => window.removeEventListener("cv-version-nueva", oir);
  }, []);
  if (!trabajador) return null;
  return (
    <div className="fixed inset-x-4 top-4 z-[80] mx-auto flex max-w-md items-center gap-3 rounded-lg bg-basalto px-4 py-3 text-niebla shadow-levantado" role="status">
      <p className="flex-1 font-bold">Hay una versión nueva de la app.</p>
      <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-lamina/15 px-3 font-bold text-amarillo" onClick={() => activarVersion(trabajador)}>
        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Actualizar
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProveedorAvisos>
        <VersionNueva />
        <Suspense fallback={<Cargando />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/acceso" element={<Acceso />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/privacidad" element={<Privacidad />} />

            <Route
              path="/finca"
              element={
                <RutaProtegida rol="caficultor">
                  <PlantillaApp rol="caficultor" />
                </RutaProtegida>
              }
            >
              <Route index element={<Hoy />} />
              <Route path="lotes" element={<Lotes />} />
              <Route path="lotes/:loteId" element={<Lote />} />
              <Route path="sanidad" element={<Sanidad />} />
              <Route path="cosecha" element={<Cosecha />} />
              <Route path="costos" element={<Costos />} />
              <Route path="clima" element={<Clima />} />
              <Route path="diagnostico" element={<Diagnostico />} />
              <Route path="guias" element={<Guias />} />
              <Route path="guias/:guiaId" element={<Guia />} />
              <Route path="asistente" element={<Asistente />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>

            <Route
              path="/admin"
              element={
                <RutaProtegida rol="administrador">
                  <PlantillaApp rol="administrador" />
                </RutaProtegida>
              }
            >
              <Route index element={<Panorama />} />
              <Route path="fincas" element={<Fincas />} />
              <Route path="fincas/:fincaId" element={<Fincas />} />
              <Route path="cuentas" element={<Cuentas />} />
              <Route path="precio" element={<Precio />} />
              <Route path="datos" element={<Datos />} />
            </Route>

            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </ProveedorAvisos>
    </BrowserRouter>
  );
}
