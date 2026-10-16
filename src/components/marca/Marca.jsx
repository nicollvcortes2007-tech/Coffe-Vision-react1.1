/*
  Marca de Coffee+Visión: isotipo de una cereza con su surco y curvas de nivel,
  y logotipo tipográfico en Fraunces con el «+» en cereza (DESIGN.md → Brand).
*/

export function Isotipo({ className = "h-9 w-9", claro = false }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Coffee+Visión">
      <circle cx="20" cy="20" r="19" fill={claro ? "#FBF7F0" : "#2B1E16"} />
      <g fill="none" stroke={claro ? "#2B1E16" : "#F4EDE1"} strokeOpacity=".28" strokeWidth="1">
        <path d="M3 27c6-3 10-2 15-5s8-8 13-8 6 2 7 2" />
        <path d="M4 31c6-2 11-1 16-4s9-7 14-6" />
      </g>
      <path d="M21.5 6.5c3.4-1.6 6.6-.6 8.4 1.6-2.9 1.3-5.9 1.3-8.4-1.6Z" fill="#7FA36B" />
      <path d="M20.6 10.4c.2-1.6.6-2.8 1.3-3.8" stroke="#7FA36B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <ellipse cx="20" cy="21.5" rx="9.6" ry="10.4" fill="#C8372D" />
      <path d="M20.4 11.6c-3.2 3.1-3.2 6.6-.6 9.8 2.6 3.2 2.6 6.9-.4 10.3" stroke="#7E1C13" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <ellipse cx="16.4" cy="17.4" rx="2.2" ry="1.4" fill="#FBF7F0" fillOpacity=".55" transform="rotate(-28 16.4 17.4)" />
    </svg>
  );
}

export function Logotipo({ className = "", claro = false, conIsotipo = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {conIsotipo && <Isotipo claro={claro} className="h-9 w-9 shrink-0" />}
      <span className={`titular text-[1.45rem] leading-none ${claro ? "text-papel" : "text-tierra"}`}>
        Coffee<span className={claro ? "text-pinton" : "text-cereza"}>+</span>Visión
      </span>
    </span>
  );
}
