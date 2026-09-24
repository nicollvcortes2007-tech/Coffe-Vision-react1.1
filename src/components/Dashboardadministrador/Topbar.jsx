import React from 'react';

export default function Topbar() {
  return (
    <header className="hero-banner" id="inicio">
      <span className="hero-overlay"></span>
      <hgroup>
        <span className="hero-subtitle">Panel de Administración Coffee+Vision</span>
        <h1 className="hero-title">¡BIENVENIDO, JULIO!</h1>
      </hgroup>

      <figure className="user-badge">
        <span className="user-avatar">J</span>
        <figcaption className="user-info">
          <p className="user-name">Julio</p>
          <p className="user-role">Administrador</p>
        </figcaption>
      </figure>
    </header>
  );
}