import { Link } from "react-router-dom";
import avatarPorDefecto from "@/assets/imagenes/image.png";
import avatarAdministrador from "@/assets/imagenes/persona.jpg";

/**
 * Barra superior compartida por todas las páginas internas: título de la
 * sección, campana de notificaciones y chip de perfil del usuario activo.
 */
function Topbar({
  eyebrow,
  title,
  notifTo,
  perfilTo,
  notiflo,
  perfilto,
  avatar,
  caficultor,
  nombre,
  rol,
  admin = false,
}) {
  const destinoNotificaciones = notifTo || notiflo || (admin ? "/admin/notificaciones" : "/notificaciones");
  const destinoPerfil = perfilTo || perfilto || (admin ? "/admin/perfil" : "/perfil");
  const fotoPerfil = admin ? avatarAdministrador : avatar || caficultor || avatarPorDefecto;
  const nombreVisible = admin ? "Administrador Sistema" : nombre || "Caficultor";
  const rolVisible = admin ? "admin@coffeetech.com" : rol || "Coffee+Visión";
  return (
    <header className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
      <section>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </section>

      <section className="hidden w-full items-center justify-end gap-2 lg:flex lg:w-auto lg:gap-4">
        <Link
          to={destinoNotificaciones}
          aria-label="Notificaciones"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-lg text-coffee shadow-sm transition-colors hover:border-green sm:h-[45px] sm:w-[45px]"
        >
          <i className="fa-regular fa-bell"></i>
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-danger"></span>
        </Link>

        <Link
          to={destinoPerfil}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-2.5 py-1.5 shadow-sm sm:w-auto sm:flex-none sm:min-w-[220px] sm:gap-3 sm:px-4"
        >
          <img
            src={fotoPerfil}
            alt={`Foto de perfil de ${nombreVisible}`}
            className="h-10 w-10 shrink-0 rounded-full border-2 border-green-soft object-cover"
          />
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <strong className="max-w-full truncate text-sm text-ink">{nombreVisible}</strong>
            <small className="max-w-full truncate text-muted">{rolVisible}</small>
          </span>
        </Link>
      </section>
    </header>
  );
}

export default Topbar;
