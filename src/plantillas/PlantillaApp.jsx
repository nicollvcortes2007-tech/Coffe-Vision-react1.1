import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sun,
  Map as MapaIcono,
  Plus,
  LayoutGrid,
  CloudSun,
  ScanSearch,
  Wallet,
  BookOpen,
  MessagesSquare,
  UserRound,
  LogOut,
  Users,
  Building2,
  Database,
  Gauge,
  X,
  BadgeDollarSign,
} from "lucide-react";
import { Logotipo, Isotipo } from "@/components/marca/Marca";
import { Canasto, Broca } from "@/components/marca/Pictogramas";
import { cerrarSesion, useSesion } from "@/utilidades/autenticacion";
import { ProveedorRegistro, useRegistro } from "@/components/registro/ContextoRegistro";
import AvisoLocal from "@/components/ui/AvisoLocal";

const NAV_CAFICULTOR = {
  principales: [
    { a: "/finca", texto: "Hoy", Icono: Sun },
    { a: "/finca/lotes", texto: "Lotes", Icono: MapaIcono },
    { registrar: true },
    { a: "/finca/cosecha", texto: "Cosecha", Icono: Canasto },
    { mas: true, texto: "Más", Icono: LayoutGrid },
  ],
  todas: [
    { a: "/finca", texto: "Hoy en la finca", Icono: Sun, fin: true },
    { a: "/finca/lotes", texto: "Lotes", Icono: MapaIcono },
    { a: "/finca/sanidad", texto: "Broca y roya", Icono: Broca },
    { a: "/finca/cosecha", texto: "Cosecha y ventas", Icono: Canasto },
    { a: "/finca/costos", texto: "Costos", Icono: Wallet },
    { a: "/finca/clima", texto: "Clima", Icono: CloudSun },
    { a: "/finca/diagnostico", texto: "Diagnóstico por foto", Icono: ScanSearch },
    { a: "/finca/guias", texto: "Guías", Icono: BookOpen },
    { a: "/finca/asistente", texto: "Asistente", Icono: MessagesSquare },
    { a: "/finca/perfil", texto: "Mi cuenta y datos", Icono: UserRound },
  ],
};

const NAV_ADMIN = {
  principales: [
    { a: "/admin", texto: "Panorama", Icono: Gauge, fin: true },
    { a: "/admin/fincas", texto: "Fincas", Icono: Building2 },
    { a: "/admin/cuentas", texto: "Cuentas", Icono: Users },
    { a: "/admin/precio", texto: "Precio", Icono: BadgeDollarSign },
    { mas: true, texto: "Más", Icono: LayoutGrid },
  ],
  todas: [
    { a: "/admin", texto: "Panorama", Icono: Gauge, fin: true },
    { a: "/admin/fincas", texto: "Fincas", Icono: Building2 },
    { a: "/admin/cuentas", texto: "Cuentas", Icono: Users },
    { a: "/admin/precio", texto: "Precio del café", Icono: BadgeDollarSign },
    { a: "/admin/datos", texto: "Datos y respaldo", Icono: Database },
  ],
};

function enlaceLateral({ isActive }) {
  return `flex min-h-12 items-center gap-3 rounded-md px-3.5 font-bold transition-colors ${
    isActive ? "bg-tinta text-niebla" : "text-grafito hover:bg-cal-honda hover:text-tinta"
  }`;
}

function BotonRegistrar({ compacto = false }) {
  const { abrir } = useRegistro();
  if (compacto) {
    return (
      <button
        type="button"
        onClick={() => abrir()}
        className="-mt-7 grid h-16 w-16 place-items-center rounded-lg bg-tinta text-amarillo shadow-levantado ring-4 ring-cal transition-transform active:scale-95"
        aria-label="Registrar en el campo"
      >
        <Plus className="h-8 w-8" strokeWidth={2.4} aria-hidden="true" />
      </button>
    );
  }
  return (
    <button type="button" onClick={() => abrir()} className="boton-primario w-full">
      <Plus className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
      Registrar en el campo
    </button>
  );
}

function Interior({ rol }) {
  const sesion = useSesion();
  const navegar = useNavigate();
  const { pathname } = useLocation();
  const [masAbierto, setMasAbierto] = useState(false);
  const nav = rol === "administrador" ? NAV_ADMIN : NAV_CAFICULTOR;

  useEffect(() => {
    setMasAbierto(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const salir = () => {
    cerrarSesion();
    navegar("/acceso", { replace: true });
  };

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17.5rem_1fr]">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-tinta focus:px-4 focus:py-3 focus:text-niebla">
        Saltar al contenido
      </a>

      {/* Barra lateral (escritorio) */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-linea bg-lamina/70 px-4 py-6 lg:flex">
        <NavLink to={nav.todas[0].a} className="px-2">
          <Logotipo />
        </NavLink>
        {rol === "caficultor" && <BotonRegistrar />}
        <nav aria-label="Secciones" className="grid gap-1">
          {nav.todas.map(({ a, texto, Icono, fin }) => (
            <NavLink key={a} to={a} end={fin} className={enlaceLateral}>
              <Icono className="h-5 w-5 shrink-0" aria-hidden="true" />
              {texto}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto grid gap-2 border-t border-linea pt-4">
          <p className="px-2 text-sm leading-snug">
            <span className="block font-bold text-tinta">{sesion?.nombre}</span>
            <span className="text-grafito">{rol === "administrador" ? "Administrador" : "Caficultor"}</span>
          </p>
          <button type="button" onClick={salir} className="boton-fantasma justify-start">
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra superior (celular) */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-linea bg-cal/92 px-4 py-2.5 backdrop-blur-md lg:hidden">
          <NavLink to={nav.todas[0].a} aria-label="Inicio">
            <Logotipo className="[&_span.titular-mayor]:text-[1.15rem]" />
          </NavLink>
          <NavLink to={rol === "administrador" ? "/admin/datos" : "/finca/perfil"} className="grid h-12 w-12 place-items-center rounded-full hover:bg-cal-honda" aria-label="Mi cuenta">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-tinta text-sm font-bold text-niebla">
              {sesion?.nombre?.split(" ").slice(0, 2).map((parte) => parte[0]).join("")}
            </span>
          </NavLink>
        </header>

        <main id="contenido" className="mx-auto w-full max-w-6xl px-4 pt-5 pb-32 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
          <AvisoLocal />
          <Outlet />
        </main>
      </div>

      {/* Barra inferior (celular) */}
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-linea bg-lamina/96 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end">
          {nav.principales.map((item, indice) => {
            if (item.registrar) {
              return (
                <li key="registrar" className="grid place-items-center">
                  <BotonRegistrar compacto />
                </li>
              );
            }
            if (item.mas) {
              return (
                <li key="mas">
                  <button
                    type="button"
                    onClick={() => setMasAbierto(true)}
                    className="flex min-h-16 w-full flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-bold text-grafito"
                    aria-haspopup="dialog"
                  >
                    <item.Icono className="h-6 w-6" aria-hidden="true" />
                    {item.texto}
                  </button>
                </li>
              );
            }
            return (
              <li key={item.a ?? indice}>
                <NavLink
                  to={item.a}
                  end={item.fin ?? item.a === "/finca"}
                  className={({ isActive }) =>
                    `relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-[0.8125rem] font-bold ${isActive ? "text-tinta before:absolute before:inset-x-4 before:top-0 before:h-[3px] before:bg-tinta" : "text-grafito"}`
                  }
                >
                  <item.Icono className="h-6 w-6" aria-hidden="true" />
                  {item.texto}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Menú «Más» (celular) */}
      {masAbierto && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Todas las secciones">
          <button type="button" className="absolute inset-0 bg-tinta/45" aria-label="Cerrar menú" onClick={() => setMasAbierto(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-lamina px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-levantado animate-aparecer">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="inline-flex items-center gap-2 font-bold">
                <Isotipo className="h-7 w-7" /> Todas las secciones
              </span>
              <button type="button" className="boton-fantasma h-12 w-12 px-0" onClick={() => setMasAbierto(false)} aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-2">
              {nav.todas.map(({ a, texto, Icono, fin }) => (
                <NavLink
                  key={a}
                  to={a}
                  end={fin}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center gap-2.5 rounded-md border px-3 font-bold ${isActive ? "border-tinta bg-tinta text-niebla" : "border-linea bg-cal text-tinta"}`
                  }
                >
                  <Icono className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="leading-tight">{texto}</span>
                </NavLink>
              ))}
              <button type="button" onClick={salir} className="col-span-2 flex min-h-14 items-center justify-center gap-2 rounded-md border border-linea font-bold text-cereza">
                <LogOut className="h-5 w-5" aria-hidden="true" /> Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlantillaApp({ rol }) {
  if (rol === "caficultor") {
    return (
      <ProveedorRegistro>
        <Interior rol={rol} />
      </ProveedorRegistro>
    );
  }
  return <Interior rol={rol} />;
}
