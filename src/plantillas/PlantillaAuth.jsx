import { Link } from "react-router-dom";
import logo from "@/assets/imagenes/logo2.png";
import fondoCafe from "@/assets/imagenes/cafecito.webp";

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
    <main
      className="relative isolate flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-8 sm:py-12"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(35, 22, 13, .76), rgba(49, 34, 20, .48)), url(${fondoCafe})`,
      }}
    >
      <article className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green via-gold to-coffee" />
        <header className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="mb-2 self-start text-sm font-semibold text-muted hover:text-coffee">
            <i className="fa-solid fa-arrow-left mr-1.5"></i> Volver
          </Link>
          <img src={logo} alt="Coffee+visión Logo" className="mb-3 h-24 w-auto object-contain" />
          <h1 className="text-2xl">{titulo}</h1>
          <p className="mt-1 text-sm text-muted">{subtitulo}</p>
        </header>
        {children}
      </article>
    </main>
  );
}

export default PlantillaAuth;
