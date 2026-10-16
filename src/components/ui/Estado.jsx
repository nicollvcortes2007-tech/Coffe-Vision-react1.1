import { CircleCheck, Eye, CircleAlert, CloudFog } from "lucide-react";

/*
  Estado del lote («Ceniza y Cereza», DESIGN.md): cereza = actuar hoy, amarillo =
  vigilar, contorno de tinta = al día, ceniza punteada = sin datos. Siempre color +
  ícono + palabra; vigilar lleva además rayado para quien no distingue colores.
*/
export const ESTADOS = {
  ok: { etiqueta: "Al día", Icono: CircleCheck, clase: "bg-lamina text-tinta border-tinta/35", punto: "bg-tinta" },
  vigilar: { etiqueta: "Vigilar", Icono: Eye, clase: "bg-amarillo rayado text-tinta border-tinta/20", punto: "bg-amarillo" },
  actuar: { etiqueta: "Actuar hoy", Icono: CircleAlert, clase: "bg-cereza text-white border-cereza", punto: "bg-cereza" },
  sinDatos: { etiqueta: "Sin datos", Icono: CloudFog, clase: "bg-niebla text-ceniza-honda border-dashed border-ceniza-honda/50", punto: "bg-ceniza" },
};

export default function Estado({ tipo = "sinDatos", children, pequeno = false }) {
  const estado = ESTADOS[tipo] ?? ESTADOS.sinDatos;
  const { Icono } = estado;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border font-bold whitespace-nowrap ${estado.clase} ${
        pequeno ? "px-1.5 py-0.5 text-[0.8125rem]" : "px-2 py-1 text-sm"
      }`}
    >
      <Icono aria-hidden="true" className={pequeno ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2.2} />
      {children ?? estado.etiqueta}
    </span>
  );
}
