import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navCaficultor, navAdministrador } from "@/datos/navegacion";
import logo from "@/assets/imagenes/logo2.png";
import avatarCaficultor from "@/assets/imagenes/image.png";
import avatarAdministrador from "@/assets/imagenes/persona.jpg";

/**
 * Barra lateral unificada de la plataforma.
 * Se usa en TODAS las páginas internas (caficultor y administrador)
 * para que la experiencia sea siempre la misma, sin importar el módulo.
 */
function Sidebar({ role = "caficultor" }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const items = role === "administrador" ? navAdministrador : navCaficultor;
  const homeRoute = role === "administrador" ? "/dashboard/administrador" : "/dashboard/caficultor";
  const perfilRoute = role === "administrador" ? "/admin/perfil" : "/perfil";
  const notificacionesRoute = role === "administrador" ? "/admin/notificaciones" : "/notificaciones";
  const avatar = role === "administrador" ? avatarAdministrador : avatarCaficultor;
  const nombre = role === "administrador" ? "Administrador" : "Caficultor";
  const detalle = role === "administrador" ? "Cuenta del sistema" : "Finca El Paraíso";

  return (
    <aside className="relative z-30 flex w-full min-w-0 flex-none flex-col gap-3 border-b border-line bg-white/95 p-3 backdrop-blur-md lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:gap-6 lg:border-b-0 lg:border-r lg:p-5">
      <header className="flex items-center justify-between lg:justify-center">
        <NavLink to={homeRoute} onClick={() => setMenuAbierto(false)} className="flex min-w-0 items-center justify-center">
          <img src={logo} alt="Coffee+visión" className="h-16 w-auto max-w-full object-contain lg:h-[112px]" />
        </NavLink>
        <div className="flex min-w-0 items-center gap-1.5 lg:hidden sm:gap-2">
          <NavLink to={notificacionesRoute} onClick={() => setMenuAbierto(false)} aria-label="Notificaciones" className="relative grid h-10 w-10 flex-none place-items-center rounded-xl border border-line bg-white text-lg text-coffee shadow-sm">
            <i className="fa-regular fa-bell" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          </NavLink>
          <NavLink to={perfilRoute} onClick={() => setMenuAbierto(false)} aria-label="Abrir perfil" className="flex min-w-0 items-center gap-2 rounded-xl border border-line bg-white px-2 py-1.5 shadow-sm">
            <img src={avatar} alt="" className="h-9 w-9 flex-none rounded-full border border-green-soft object-cover" />
            <span className="hidden min-w-0 pr-1 sm:block">
              <strong className="block truncate text-xs text-ink">{nombre}</strong>
              <small className="block max-w-28 truncate text-[11px] text-muted">{detalle}</small>
            </span>
          </NavLink>
          <button
            type="button"
            className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-line text-xl text-coffee"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <i className={`fa-solid ${menuAbierto ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className={`${menuAbierto ? "grid" : "hidden"} gap-2 lg:grid`} aria-label={`Menú ${role}`}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMenuAbierto(false)}
            className={({ isActive }) =>
              `flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 font-bold transition-colors ${
                isActive ? "bg-green-soft text-coffee" : "text-muted hover:bg-green-soft hover:text-coffee"
              }`
            }
          >
            <i className={`${item.icon} w-4 text-center`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {role === "caficultor" && (
        <section className={`${menuAbierto ? "grid" : "hidden"} gap-2 rounded-lg bg-gradient-to-br from-coffee to-coffee-soft p-4 text-white lg:grid`}>
          <i className="fa-solid fa-leaf text-xl text-gold"></i>
          <p className="text-sm opacity-80">Proxima revision</p>
          <strong className="text-sm">Lote 2 - Broca</strong>
        </section>
      )}

      <NavLink
        to="/login"
        onClick={() => setMenuAbierto(false)}
        className={`${menuAbierto ? "flex" : "hidden"} min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 font-bold text-danger hover:bg-red-50 lg:mt-auto lg:flex`}
      >
        <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
        Cerrar sesion
      </NavLink>
    </aside>
  );
}

export default Sidebar;
