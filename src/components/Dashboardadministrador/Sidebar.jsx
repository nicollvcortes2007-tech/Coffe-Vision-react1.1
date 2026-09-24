import React from 'react';
import { Sprout, Home, Users, FileText, BarChart3, AlertTriangle } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <header className="brand">
        <Sprout className="brand-icon" />
        <span className="brand-name">Coffee+Vision</span>
      </header>

      <nav className="nav-menu">
        <a href="#inicio" className="nav-link active">
          <Home size={20} /> <span>Inicio</span>
        </a>
        <a href="#usuarios" className="nav-link">
          <Users size={20} /> <span>Usuarios</span>
        </a>
        <a href="#reportes" className="nav-link">
          <FileText size={20} /> <span>Reportes</span>
        </a>
        <a href="#estadisticas" className="nav-link">
          <BarChart3 size={20} /> <span>Estadísticas</span>
        </a>
      </nav>

      <section className="alert-box">
        <span className="alert-tag">
          <AlertTriangle size={16} /> Alerta Crítica
        </span>
        <p className="alert-title">Lote 2 - Presencia de Broca</p>
      </section>
    </aside>
  );
}