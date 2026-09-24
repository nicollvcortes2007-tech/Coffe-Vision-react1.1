import React from 'react';
import logo from '@/assets/imagenes/logo2.png';

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <header className="admin-brand">
        <img src={logo} alt="Coffee+Visión" className="admin-brand-logo" />
      </header>

      <nav className="admin-nav-menu" aria-label="Menú del administrador">
        <a href="#inicio" className="admin-nav-link active">
          <i className="fa-solid fa-house" aria-hidden="true" /> <span>Inicio</span>
        </a>
        <a href="#usuarios" className="admin-nav-link">
          <i className="fa-solid fa-users" aria-hidden="true" /> <span>Usuarios</span>
        </a>
        <a href="#reportes" className="admin-nav-link">
          <i className="fa-solid fa-file-lines" aria-hidden="true" /> <span>Reportes</span>
        </a>
        <a href="#estadisticas" className="admin-nav-link">
          <i className="fa-solid fa-chart-column" aria-hidden="true" /> <span>Estadísticas</span>
        </a>
      </nav>

      <section className="admin-alert-box">
        <span className="admin-alert-tag">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /> Alerta Crítica
        </span>
        <p className="admin-alert-title">Lote 2 - Presencia de Broca</p>
      </section>
    </aside>
  );
}
