import { NavLink } from "react-router-dom";
import { navCaficultor, navAdministrador } from "@/datos/navegacion";
import logo from "@/assets/imagenes/logo2.png";

/**
 * Barra lateral unificada de la plataforma.
 * Se usa en TODAS las páginas internas (caficultor y administrador)
 * para que la experiencia sea siempre la misma, sin importar el módulo.
 */
function Sidebar({ role = "caficultor" }) {
  const items = role === "administrador" ? navAdministrador : navCaficultor;
  const homeRoute = role === "administrador" ? "/dashboard/administrador" : "/dashboard/caficultor";

  return (
    <aside className="sticky top-0 flex h-screen w-[280px] flex-none flex-col gap-6 overflow-y-auto border-r border-line bg-white/95 p-5 backdrop-blur-md">
      <NavLink to={homeRoute} className="flex items-center justify-center">
        <img src={logo} alt="Coffee+visión" className="h-[70px] w-auto object-contain" />
      </NavLink>

      <nav className="grid gap-2" aria-label={`Menu ${role}`}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
        <section className="grid gap-2 rounded-lg bg-gradient-to-br from-coffee to-coffee-soft p-4 text-white">
          <i className="fa-solid fa-leaf text-xl text-gold"></i>
          <p className="text-sm opacity-80">Proxima revision</p>
          <strong className="text-sm">Lote 2 - Broca</strong>
        </section>
      )}

      <NavLink
        to="/login"
        className="mt-auto flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 font-bold text-danger hover:bg-red-50"
      >
        <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
        Cerrar sesion
      </NavLink>
    </aside>
  );
}

export default Sidebar;
