import { Link } from "react-router-dom";
import logo from "@/assets/imagenes/logo2.png";
import cafe from "@/assets/imagenes/Cafe.webp";
import cosecha from "@/assets/imagenes/cosecha.webp";
import cafecito from "@/assets/imagenes/cafecito.webp";

const FUNCIONALIDADES = [
  { icon: "fa-mug-hot", titulo: "Gestión de Cultivos", texto: "Administra tus plantaciones de café con registro completo de variedades, ubicaciones y ciclos de producción." },
  { icon: "fa-bug", titulo: "Control de Plagas", texto: "Registra y monitorea plagas y enfermedades en tiempo real para tomar acciones preventivas." },
  { icon: "fa-droplet", titulo: "Manejo de Fertilizantes", texto: "Controla aplicaciones de fertilizantes, optimiza recursos y mejora la nutrición de tus cultivos." },
  { icon: "fa-leaf", titulo: "Monitoreo de Cosechas", texto: "Registra producción, calidad del grano y optimiza tus procesos de recolección." },
  { icon: "fa-database", titulo: "Base de Datos Agrícola", texto: "Almacena toda la información de tu finca en una plataforma segura y accesible desde cualquier lugar." },
  { icon: "fa-chart-line", titulo: "Reportes en Tiempo Real", texto: "Visualiza estadísticas, tendencias y métricas de producción con dashboards interactivos." },
];

const BENEFICIOS = [
  { titulo: "Toma Decisiones Informadas", texto: "Accede a datos en tiempo real sobre el estado de tus cultivos, clima y producción." },
  { titulo: "Mejora la Calidad del Café", texto: "Controla variables críticas que impactan directamente en el sabor y aroma de tu café." },
  { titulo: "Aumenta la Rentabilidad", texto: "Optimiza recursos, reduce pérdidas y maximiza el rendimiento de tus plantaciones." },
  { titulo: "Gestión Sostenible", texto: "Implementa prácticas agrícolas responsables con el medio ambiente." },
];

function Home() {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white/80 px-6 py-4 backdrop-blur-md sm:px-10">
        <a href="#inicio" className="flex items-center">
          <img src={logo} alt="Coffee+visión Logo" className="h-12 w-auto object-contain" />
        </a>

        <nav className="hidden md:block">
          <ul className="flex gap-8 font-semibold text-ink">
            <li><a href="#inicio" className="hover:text-green">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-green">Servicios</a></li>
            <li><a href="#contacto" className="hover:text-green">Contacto</a></li>
            <li><a href="#nosotros" className="hover:text-green">Sobre Nosotros</a></li>
          </ul>
        </nav>

        <aside className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-coffee hover:text-green">Iniciar Sesión</Link>
          <Link to="/registro" className="rounded-lg bg-green px-4 py-2.5 font-bold text-white hover:bg-green-deep">
            Registro
          </Link>
        </aside>
      </header>

      <main>
        <section id="inicio" className="grid items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:py-24">
          <article>
            <span className="mb-4 inline-block rounded-full bg-green-soft px-4 py-1.5 text-sm font-bold text-green-deep">
              Tecnología Agrícola Premium
            </span>
            <h1 className="text-4xl leading-tight sm:text-5xl">
              Tecnología Inteligente para la Producción Cafetera
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              Monitorea cultivos de café, registra plagas y optimiza tu producción mediante herramientas
              digitales avanzadas diseñadas para el campo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-green px-6 py-3 font-bold text-white hover:bg-green-deep">
                Comenzar →
              </Link>
              <a href="#servicios" className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-3 font-bold text-coffee hover:border-green">
                Explorar
              </a>
            </div>
          </article>

          <figure className="overflow-hidden rounded-lg shadow-hero">
            <img src={cafe} alt="Cultivo de café" className="h-full w-full object-cover" />
          </figure>
        </section>

        <section id="servicios" className="bg-white px-6 py-16 sm:px-10">
          <header className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl">Funcionalidades Principales</h2>
            <p className="mt-2 text-muted">
              Herramientas diseñadas específicamente para optimizar la gestión de tus cultivos de café
            </p>
          </header>

          <section className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FUNCIONALIDADES.map((f) => (
              <article key={f.titulo} className="rounded-lg border border-line p-6 shadow-panel">
                <figure className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-green-soft text-xl text-green">
                  <i className={`fa-solid ${f.icon}`}></i>
                </figure>
                <h3 className="text-lg">{f.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.texto}</p>
              </article>
            ))}
          </section>
        </section>

        <section className="grid items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-lg shadow-panel">
            <img src={cosecha} alt="Optimiza tu Producción Cafetera" className="h-full w-full object-cover" />
          </figure>

          <article>
            <h2 className="text-3xl">Optimiza tu Producción Cafetera</h2>
            <p className="mt-3 leading-relaxed text-muted">
              CoffeeTech ayuda a los caficultores a transformar sus procesos tradicionales en operaciones
              modernas y eficientes mediante tecnología de punta.
            </p>

            <ul className="mt-6 grid gap-4">
              {BENEFICIOS.map((b) => (
                <li key={b.titulo} className="flex gap-3">
                  <i className="fa-regular fa-circle-check mt-1 text-green"></i>
                  <span>
                    <strong className="block text-coffee">{b.titulo}</strong>
                    <p className="text-sm text-muted">{b.texto}</p>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section id="nosotros" className="grid items-center gap-10 bg-white px-6 py-16 sm:px-10 lg:grid-cols-2">
          <article>
            <header className="mb-4">
              <h2 className="text-3xl">Nuestra Misión</h2>
              <p className="mt-1 text-muted">Impulsando la caficultura desde la formación y la innovación</p>
            </header>

            <p className="leading-relaxed text-muted">
              <strong className="text-coffee">Coffee+visión</strong> es un proyecto tecnológico nacido en el{" "}
              <strong className="text-coffee">SENA</strong>, diseñado por aprendices apasionados por
              transformar el campo colombiano. Nuestra meta es cerrar la brecha digital en la agricultura,
              ofreciendo herramientas de visión artificial y análisis de datos que antes eran inalcanzables
              para el pequeño productor.
            </p>

            <ul className="mt-6 grid gap-4">
              <li className="flex gap-3">
                <i className="fa-solid fa-graduation-cap mt-1 text-green"></i>
                <span>
                  <strong className="block text-coffee">Talento SENA</strong>
                  <p className="text-sm text-muted">Desarrollado con el respaldo académico y técnico del Servicio Nacional de Aprendizaje.</p>
                </span>
              </li>
              <li className="flex gap-3">
                <i className="fa-solid fa-users-gear mt-1 text-green"></i>
                <span>
                  <strong className="block text-coffee">Hecho para Caficultores</strong>
                  <p className="text-sm text-muted">Creamos soluciones reales para los desafíos diarios de las fincas cafeteras.</p>
                </span>
              </li>
            </ul>
          </article>

          <figure className="overflow-hidden rounded-lg shadow-panel">
            <img src={cafecito} alt="Desarrollo tecnológico SENA" className="h-full w-full object-cover" />
          </figure>
        </section>

        <section className="px-6 py-16 sm:px-10">
          <article className="mx-auto max-w-3xl rounded-lg bg-gradient-to-br from-coffee to-coffee-soft p-10 text-center text-white shadow-hero">
            <h2 className="text-3xl text-white">Comienza a Optimizar tu Producción Hoy</h2>
            <p className="mt-2 text-white/85">
              Únete a cientos de caficultores que ya están mejorando sus cultivos con CoffeeTech
            </p>
            <Link
              to="/registro"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-bold text-coffee hover:bg-white/90"
            >
              Comenzar Gratis
            </Link>
          </article>
        </section>
      </main>

      <footer id="contacto" className="bg-coffee px-6 py-12 text-white/85 sm:px-10">
        <section className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <article>
            <div className="mb-2 flex items-center gap-2 text-lg font-extrabold text-white">
              <i className="fa-solid fa-mug-hot text-gold"></i>
              <span>Coffee+Visión</span>
            </div>
            <p className="text-sm">Tecnología inteligente para la producción cafetera sostenible y eficiente.</p>
            <nav className="mt-4 flex gap-4 text-lg">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            </nav>
          </article>

          <nav>
            <h3 className="mb-3 font-bold text-white">Plataforma</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="#" className="hover:text-white">Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Gestión de Cultivos</a></li>
              <li><a href="#" className="hover:text-white">Control de Plagas</a></li>
              <li><a href="#" className="hover:text-white">Reportes</a></li>
            </ul>
          </nav>

          <nav>
            <h3 className="mb-3 font-bold text-white">Recursos</h3>
            <ul className="grid gap-2 text-sm">
              <li><a href="#" className="hover:text-white">Documentación</a></li>
              <li><a href="#" className="hover:text-white">Tutoriales</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Soporte</a></li>
            </ul>
          </nav>

          <article>
            <h3 className="mb-3 font-bold text-white">Contacto</h3>
            <p className="text-sm">Coffee+Visión@gmail.com</p>
            <p className="text-sm">+57 300 123 4567</p>
            <p className="text-sm">Popayán, Cauca - SENA</p>
            <p className="text-sm">Lun - Vie: 8am - 6pm</p>
          </article>
        </section>

        <aside className="mx-auto mt-8 max-w-6xl border-t border-white/15 pt-6 text-center text-xs text-white/60">
          <p>&copy; 2026 CoffeeTech. Todos los derechos reservados. Diseñado con tecnología para el café colombiano.</p>
        </aside>
      </footer>
    </>
  );
}

export default Home;
