import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";

import ChatBot from "@/pages/ChatBot";
import Guias from "@/pages/Guias";

import Inicio from '@/pages/Inicio';
import Recomendaciones from '@/pages/Recomendaciones';


// Páginas del administrador
import ConfiguracionAdministrador from "@/pages/ConfiguracionAdministrador";
import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";
import Cultivos from "@/pages/Cultivos";
import RegistrarLabor from "@/pages/RegistrarLabor";
import Estadisticas from "@/pages/Estadisticas";
import Guias from "@/pages/Guias";
import NotificacionesCaficultor from "@/pages/NotificacionesCaficultor";
import Chatbot from "@/pages/Chatbot";
import PerfilCaficultor from "@/pages/PerfilCaficultor";
import ConfiguracionCaficultor from "@/pages/ConfiguracionCaficultor";

// Páginas del administrador
import DashboardAdmin from "@/pages/DashboardAdmin";
import GestionPlagas from "@/pages/GestionPlagas";
import NotificacionesAdmin from "@/pages/NotificacionesAdmin";
import PerfilAdmin from "@/pages/PerfilAdmin";

function Rutas() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />
      <Route path="/cultivos" element={<Cultivos />} />
      <Route path="/registrar-labor" element={<RegistrarLabor />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="/guias" element={<Guias />} />
      <Route path="/notificaciones" element={<NotificacionesCaficultor />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/perfil" element={<PerfilCaficultor />} />
      <Route path="/configuracion" element={<ConfiguracionCaficultor />} />

      {/* Administrador */}
      <Route path="/dashboard/administrador" element={<DashboardAdmin />} />
      <Route path="/admin/plagas" element={<GestionPlagas />} />
      <Route path="/admin/notificaciones" element={<NotificacionesAdmin />} />
      <Route path="/admin/perfil" element={<PerfilAdmin />} />
    </Routes>
  );
}

export default Rutas;