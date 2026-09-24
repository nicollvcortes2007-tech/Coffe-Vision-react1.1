import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import DashboardCaficultor from "@/pages/DashboardCaficultor";
import Inicio from "@/pages/Inicio";
import Cultivos from "@/pages/cultivos";
import GestionDeCultivos from "@/pages/gestiondecultivos";
import Estadisticas from "@/pages/estadisticascultivo";
import Guias from "@/pages/Guias";
import Notificaciones from "@/pages/Notificaciones";
import ChatBot from "@/pages/ChatBot";
import Recomendaciones from "@/pages/Recomendaciones";

import DashboardAdministrador from "@/pages/Dashboardadministrador";
import GestionDePlagas from "@/pages/gestiondeplagas";
import PerfilAdministrador from "@/pages/Perfiladminist";
import ConfiguracionAdministrador from "@/pages/ConfiguracionAdministrador";

function NoEncontrada() {
  return (
    <main className="grid min-h-screen place-items-center bg-page p-6 text-center">
      <section>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2">No encontramos esa página</h1>
        <p className="mt-2 text-muted">Revisa la dirección o vuelve al inicio.</p>
        <a className="mt-5 inline-block font-bold text-green" href="/">
          Volver al inicio
        </a>
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
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/cultivos" element={<Cultivos />} />
      <Route path="/cultivos/gestion" element={<GestionDeCultivos />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="/guias" element={<Guias />} />
      <Route path="/notificaciones" element={<Notificaciones />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />

      {/* Área del administrador */}
      <Route path="/dashboard/administrador" element={<DashboardAdministrador />} />
      <Route path="/admin/plagas" element={<GestionDePlagas />} />
      <Route path="/admin/perfil" element={<PerfilAdministrador />} />
      <Route path="/admin/configuracion" element={<ConfiguracionAdministrador />} />

      <Route path="/admin/notificaciones" element={<Navigate to="/notificaciones" replace />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}
