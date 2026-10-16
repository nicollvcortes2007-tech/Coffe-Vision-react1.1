import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Logotipo } from "@/components/marca/Marca";
import Escenario from "./landing/Escenario";
import Calculadora from "./landing/Calculadora";
import { Ceniza, Diagnostico, Celular, Modulos, Cifras, Honestidad, Pie } from "./landing/Secciones";
import { crearFincaDemo } from "./landing/fincaDemo";

/*
  Landing «Ceniza y Cereza» (DESIGN.md): la finca de ejemplo en 3D sobre el relieve
  real, de noche, con los capítulos de lotes, broca, roya y cosecha; después el
  suelo de ceniza, la calculadora de precio, el diagnóstico por foto y la app.
*/
export default function Landing() {
  const demo = useMemo(() => crearFincaDemo(), []);

  useEffect(() => {
    document.title = "Coffee+Visión · Tu finca, sobre su relieve real";
  }, []);

  return (
    <div className="tema-basalto min-h-dvh overflow-x-clip bg-basalto">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded focus:bg-amarillo focus:px-4 focus:py-3 focus:font-bold focus:text-basalto">
        Saltar al contenido
      </a>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8 lg:py-5">
          <Link to="/" aria-label="Coffee+Visión, inicio">
            <Logotipo claro />
          </Link>
          <nav aria-label="Secciones" className="hidden items-center gap-6 font-mono text-[0.6875rem] tracking-[0.06em] text-ceniza uppercase lg:flex">
            <a href="#ceniza" className="hover:text-niebla">
              El suelo
            </a>
            <a href="#calculadora" className="hover:text-niebla">
              Precio
            </a>
            <a href="#diagnostico" className="hover:text-niebla">
              Diagnóstico
            </a>
            <a href="#modulos" className="hover:text-niebla">
              Qué hace
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/acceso" className="boton min-h-11 px-4 text-niebla hover:bg-escoria">
              Entrar
            </Link>
            <Link to="/registro" className="boton hidden min-h-11 bg-niebla px-4 text-basalto hover:bg-white sm:inline-flex">
              Crear mi finca
            </Link>
          </div>
        </div>
      </header>

      <main id="contenido">
        <Escenario demo={demo} />
        <Ceniza />
        <Calculadora precio={demo.precio} />
        <Diagnostico />
        <Celular />
        <Cifras />
        <Modulos />
        <Honestidad />
      </main>
      <Pie />
    </div>
  );
}
