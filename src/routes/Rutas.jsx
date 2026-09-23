import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";
import ChatBot from "../pages/ChatBot";
import Guias from "../pages/Guias";

// Páginas del administrador


function Rutas() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/guias" element={<Guias />} />

    </Routes>
  );
}
 
export default Rutas;
 