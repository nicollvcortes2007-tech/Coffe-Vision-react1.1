import { Link, useLocation } from "react-router-dom";

export default function AsistenteFlotante() {
  const { pathname } = useLocation();

  if (
    ["/", "/login", "/registro"].includes(pathname) ||
    pathname === "/dashboard/administrador" ||
    pathname.startsWith("/admin/")
  ) return null;

  return (
    <Link
      to="/chatbot"
      aria-label="Abrir la página del Chatbot IA"
      title="Consultar con el Chatbot IA"
      className="fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green to-green-deep text-2xl text-white shadow-hero transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green/30"
    >
      <i className="fa-solid fa-robot" aria-hidden="true"></i>
    </Link>
  );
}
