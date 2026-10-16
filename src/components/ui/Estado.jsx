import { CircleCheck, Eye, CircleAlert, CloudFog } from "lucide-react";

/*
  La escala de maduración del grano es la escala de estado (DESIGN.md):
  hoja = al día, pintón = vigilar, cereza = actuar hoy, niebla = sin datos.
  Siempre color + ícono + palabra.
*/
export const ESTADOS = {
  ok: { etiqueta: "Al día", Icono: CircleCheck, clase: "bg-hoja-tenue text-hoja-oscura ring-hoja/25", punto: "bg-hoja" },
  vigilar: { etiqueta: "Vigilar", Icono: Eye, clase: "bg-pinton-tenue text-pinton-texto ring-pinton/40", punto: "bg-pinton" },
  actuar: { etiqueta: "Actuar hoy", Icono: CircleAlert, clase: "bg-cereza-tenue text-cereza-oscura ring-cereza/30", punto: "bg-cereza" },
  sinDatos: { etiqueta: "Sin datos", Icono: CloudFog, clase: "bg-niebla text-niebla-oscura ring-niebla-oscura/20", punto: "bg-niebla-oscura" },
};

export default function Estado({ tipo = "sinDatos", children, pequeno = false }) {
  const estado = ESTADOS[tipo] ?? ESTADOS.sinDatos;
  const { Icono } = estado;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ring-1 ring-inset ${estado.clase} ${
        pequeno ? "px-2 py-0.5 text-[0.8125rem]" : "px-2.5 py-1 text-sm"
      }`}
    >
      <Icono aria-hidden="true" className={pequeno ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2.2} />
      {children ?? estado.etiqueta}
    </span>
  );
}
