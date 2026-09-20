import { Link } from "react-router-dom";
import logo from "@/assets/imagenes/logo2.png";

/**
 * PLANTILLA DE ESTILO PARA AUTENTICACIÓN
 * ---------------------------------------
 * Usada por Login y Signup (registro). No lleva sidebar porque el usuario
 * todavia no ha iniciado sesion; en su lugar centra una tarjeta sobre el
 * fondo de marca, manteniendo la misma paleta e identidad visual del resto
 * de la plataforma.
 */
function PlantillaAuth({ titulo, subtitulo, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbfaf7] via-page to-[#eef4e4] px-4 py-10">
      <article className="w-full max-w-md rounded-lg border border-line bg-surface p-8 shadow-panel">
        <header className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="mb-2 self-start text-sm font-semibold text-muted hover:text-coffee">
            <i className="fa-solid fa-arrow-left mr-1.5"></i> Volver
          </Link>
          <img src={logo} alt="Coffee+visión Logo" className="mb-3 h-16 w-auto object-contain" />
          <h1 className="text-2xl">{titulo}</h1>
          <p className="mt-1 text-sm text-muted">{subtitulo}</p>
        </header>
        {children}
      </article>
    </main>
  );
}

export default PlantillaAuth;
