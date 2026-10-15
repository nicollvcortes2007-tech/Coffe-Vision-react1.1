import { Link, Route, Routes, useLocation } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import DashboardCaficultor from "@/pages/DashboardCaficultor";
import DashboardAdministrador from "@/pages/Dashboardadministrador";
import Inicio from "@/pages/Inicio";
import GestionDePlagas from "@/pages/gestiondeplagas";
import Guias from "@/pages/Guias";
import Notificaciones from "@/pages/Notificaciones";
import ChatBot from "@/pages/ChatBot";
import PerfilAdministrador from "@/pages/Perfiladminist";
import Recomendaciones from "@/pages/Recomendaciones";


// Páginas del administrador
import ConfiguracionAdministrador from "@/pages/ConfiguracionAdministrador";

function NoEncontrada() {
  const { pathname } = useLocation();
  const esAdministrador = pathname.startsWith("/admin") || pathname.startsWith("/dashboard/administrador");
  const rutaInicio = esAdministrador ? "/dashboard/administrador" : "/dashboard/caficultor";

  return (
    <main className="grid min-h-screen place-items-center bg-page p-6 text-center">
      <section>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2">No encontramos esa página</h1>
        <p className="mt-2 text-muted">Revisa la dirección o vuelve al inicio.</p>
        <Link className="mt-5 inline-block font-bold text-green" to={rutaInicio}>
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}

export default function Rutas() {
  return (
    <Routes>
      {/* Acceso público */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Área del caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />
      <Route path="/chatbot" element={<ChatBot/>} />
      <Route path="/guias" element={<Guias />} />

      <Route path="/inicio" element={<Inicio/>} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />

      {/* Área del administrador */}
      <Route path="/dashboard/administrador" element={<DashboardAdministrador />} />
      <Route path="/admin/plagas" element={<GestionDePlagas />} />
      <Route path="/admin/perfil" element={<PerfilAdministrador />} />
      <Route path="/admin/configuracion" element={<ConfiguracionAdministrador />} />

      <Route path="/admin/notificaciones" element={<Notificaciones />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}
