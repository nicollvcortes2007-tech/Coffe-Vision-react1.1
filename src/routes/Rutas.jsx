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

function Rutas() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />
      <Route path="/chatbot" element={<ChatBot/>} />
      <Route path="/guias" element={<Guias />} />

      <Route path="/inicio" element={<Inicio/>} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />

      {/* Administrador */}
      <Route path='configuracion' element={<ConfiguracionAdministrador />} />


    </Routes>
  );
}
 
export default Rutas;
 