import { Link } from 'react-router-dom';
import avatarAdministrador from '@/assets/imagenes/persona.jpg';

export default function Topbar() {
  return (
    <header className="admin-hero-banner" id="inicio">
      <hgroup>
        <span className="admin-hero-subtitle">Panel de Administración Coffee+Visión</span>
        <h1 className="admin-hero-title">Resumen</h1>
      </hgroup>

      <nav className="admin-hero-actions" aria-label="Accesos del administrador">
        <Link to="/admin/notificaciones" className="admin-hero-notification" aria-label="Notificaciones">
          <i className="fa-regular fa-bell" aria-hidden="true" />
          <span className="admin-hero-notification-dot" />
        </Link>
        <Link to="/admin/perfil" className="admin-user-badge">
        <img src={avatarAdministrador} alt="" className="admin-user-avatar" />
        <span className="admin-user-info">
          <p className="admin-user-name">Administrador Sistema</p>
          <p className="admin-user-role">admin@coffeetech.com</p>
        </span>
        </Link>
      </nav>
    </header>
  );
}
