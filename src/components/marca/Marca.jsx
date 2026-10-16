import { useId } from "react";

/*
  Marca de Coffee+Visión («Ceniza y Cereza», DESIGN.md → Marca): el isotipo es una
  cereza vista como un lente sobre el terreno. Sus curvas de nivel dibujan la loma y
  el punto amarillo es la casa de la finca. Logotipo en Archivo Expanded 900.
*/

export function Isotipo({ className = "h-9 w-9", claro = false, titulo = "Coffee+Visión" }) {
  const lente = `cv-lente-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 40 40" className={className} role={titulo ? "img" : undefined} aria-label={titulo || undefined} aria-hidden={titulo ? undefined : true}>
      <rect width="40" height="40" rx="7" fill={claro ? "#E9EAE4" : "#0E0F0C"} />
      <clipPath id={lente}>
        <circle cx="20" cy="20" r="13" />
      </clipPath>
      <circle cx="20" cy="20" r="13" fill="#FF3B2F" />
      <g clipPath={`url(#${lente})`} fill="none" stroke="#0E0F0C" strokeWidth="1.5">
        <path d="M3 25.5c4.2-1.2 6.4-6.8 10.8-9.6 4.9-3.1 9.3-1.4 12.8 1.7 3.1 2.8 6.4 3.4 10.4 2.4" />
        <path d="M6 31c4.6-1.3 7.1-6.1 11.6-8.3 4.5-2.2 8.1-.7 11.2 1.9 2.7 2.2 5.6 2.9 9.2 2" />
        <path d="M14.5 17.3c2.4-2.6 5.9-3 8.4-.9" />
      </g>
      <circle cx="26.2" cy="24.6" r="2.4" fill="#FFC21A" stroke="#0E0F0C" strokeWidth="1.2" />
    </svg>
  );
}

export function Logotipo({ className = "", claro = false, conIsotipo = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {conIsotipo && <Isotipo claro={claro} className="h-9 w-9 shrink-0" titulo="" />}
      <span className={`titular-mayor text-[1.05rem] leading-none tracking-[-0.01em] ${claro ? "text-niebla" : "text-tinta"}`}>
        Coffee<span className={claro ? "text-cereza-viva" : "text-cereza"}>+</span>Visión
      </span>
    </span>
  );
}
