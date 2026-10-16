import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logotipo } from "@/components/marca/Marca";

const SECCIONES = [
  {
    titulo: "Dónde quedan tus datos",
    texto: [
      "Coffee+Visión no tiene servidor. Tu cuenta, tu finca y todos tus registros se guardan solo en el navegador de este celular o computador (almacenamiento local).",
      "El equipo del proyecto no recibe ni ve tus datos. Si borras los datos del navegador o cambias de equipo, se pierden: por eso puedes descargar un respaldo y restaurarlo.",
    ],
  },
  {
    titulo: "Para qué se usan",
    texto: ["Para llevar tu cuaderno de campo y calcular tus reportes: estado de los lotes, producción, costos, ventas y avisos con las reglas de Cenicafé y la FNC."],
  },
  {
    titulo: "Qué sale de tu equipo",
    texto: [
      "Para el clima se consultan las coordenadas de la finca a Open-Meteo, redondeadas a dos decimales (alrededor de 1 km) y sin tu nombre.",
      "La TRM y las estadísticas agrícolas se leen de datos.gov.co, sin enviar datos tuyos.",
      "El diagnóstico por foto se hace en tu equipo: la foto no se envía a ningún servidor.",
    ],
  },
  {
    titulo: "Tus derechos",
    texto: [
      "Puedes ver, corregir, descargar y borrar todos tus datos desde «Mi cuenta y datos». Borrar es inmediato y no se puede deshacer.",
      "Si compartes tus datos (por ejemplo el GeoJSON de tus lotes con un comprador), esa entrega la decides tú.",
    ],
  },
  {
    titulo: "Límites de este prototipo",
    texto: [
      "Es un proyecto formativo del SENA. Las cuentas locales no son seguridad de producción: cualquiera con acceso a este navegador podría leer los datos. No guardes aquí información que no quieras que vea quien use el equipo.",
      "Si el proyecto llegara a guardar datos en un servidor, necesitaría una política de tratamiento completa según la Ley 1581 de 2012 y el Decreto 1377 de 2013, y una autorización aparte para compartir la ubicación de los lotes.",
    ],
  },
];

export default function Privacidad() {
  useEffect(() => {
    document.title = "Privacidad y datos · Coffee+Visión";
  }, []);
  return (
    <div className="min-h-dvh">
      <header className="border-b border-linea bg-lamina">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/" className="boton-fantasma -ml-3">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Inicio
          </Link>
          <Logotipo />
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-3xl px-5 py-12">
        <p className="rotulo">Versión del 15 de octubre de 2026</p>
        <h1 className="titular mt-3 text-[2.6rem]">Privacidad y datos</h1>
        <p className="mt-4 text-lg text-grafito">En pocas palabras: tus datos se quedan en tu equipo y son tuyos.</p>
        <div className="mt-10 grid gap-8">
          {SECCIONES.map((seccion) => (
            <section key={seccion.titulo}>
              <h2 className="titular text-2xl">{seccion.titulo}</h2>
              {seccion.texto.map((parrafo) => (
                <p key={parrafo} className="mt-3 max-w-[68ch] text-[1.0625rem] leading-relaxed">
                  {parrafo}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
