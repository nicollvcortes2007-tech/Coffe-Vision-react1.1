import { useId } from "react";

/*
  La ladera en 2D: curvas de nivel y los lotes como parcelas sobre la pendiente,
  coloreadas por estado (con tramado en «actuar hoy» para no depender del color).
  Es la vista canónica y accesible del mapa; la ladera 3D (vgpu) es una mejora.
  Cada lote ocupa una de las parcelas dibujadas a mano siguiendo las curvas.
*/

export const PARCELAS = [
  { d: "M58 196 L112 168 L168 176 L150 214 L72 222 Z", etiqueta: [112, 197] },
  { d: "M168 176 L226 150 L276 160 L262 204 L150 214 Z", etiqueta: [214, 182] },
  { d: "M276 160 L330 140 L372 156 L366 200 L262 204 Z", etiqueta: [318, 176] },
  { d: "M112 168 L150 128 L206 118 L226 150 L168 176 Z", etiqueta: [172, 148] },
  { d: "M226 150 L206 118 L262 98 L308 112 L330 140 L276 160 Z", etiqueta: [268, 132] },
  { d: "M150 128 L178 92 L230 78 L262 98 L206 118 Z", etiqueta: [205, 103] },
  { d: "M262 98 L230 78 L262 58 L300 70 L308 112 Z", etiqueta: [276, 84] },
  { d: "M330 140 L308 112 L300 70 L348 96 L372 156 Z", etiqueta: [334, 118] },
];

const RELLENO = {
  ok: "#FFFFFF",
  vigilar: "#FFC21A",
  actuar: "#FF3B2F",
  sinDatos: "#E9EAE4",
};

export default function LaderaSVG({ lotes = [], seleccionado, alSeleccionar, className = "", titulo = "Mapa de la ladera de la finca" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 240" className={`h-auto w-full ${className}`} role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>{titulo}</title>
      <defs>
        <linearGradient id={`${id}-cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ECEDE8" />
          <stop offset="1" stopColor="#F6F6F3" />
        </linearGradient>
        <linearGradient id={`${id}-monte`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9CBC4" />
          <stop offset="1" stopColor="#A9ABA2" />
        </linearGradient>
        <pattern id={`${id}-rayado`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#FFC21A" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#111210" strokeOpacity=".45" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="400" height="240" fill={`url(#${id}-cielo)`} />
      {/* cordillera lejana con niebla */}
      <path d="M0 120 C60 90 90 100 140 72 S240 40 300 58 S380 70 400 60 V240 H0 Z" fill="#DCDDD7" opacity=".7" />
      {/* la ladera */}
      <path d="M20 230 C70 200 120 150 175 100 S260 40 300 52 S360 90 392 160 L400 240 H0 Z" fill={`url(#${id}-monte)`} />
      <g fill="none" stroke="#5F615A" strokeOpacity=".35" strokeWidth="1">
        <path d="M30 226 C90 206 150 190 220 186 S330 190 392 196" />
        <path d="M44 214 C100 190 150 166 214 158 S330 162 386 176" />
        <path d="M70 200 C120 172 160 140 214 130 S320 132 380 150" />
        <path d="M100 182 C140 150 170 116 220 104 S310 104 368 126" />
        <path d="M134 158 C164 124 190 92 232 80 S300 82 350 102" />
        <path d="M170 128 C196 98 222 70 256 62 S306 70 334 84" />
      </g>
      {PARCELAS.map((parcela, indice) => {
        const lote = lotes[indice];
        if (!lote) {
          return <path key={indice} d={parcela.d} fill="#DCDDD7" stroke="#8A8C85" strokeDasharray="3 3" strokeWidth="1" opacity=".7" />;
        }
        const estado = lote.estado ?? "sinDatos";
        const relleno = estado === "vigilar" ? `url(#${id}-rayado)` : RELLENO[estado];
        const activo = seleccionado === lote.id;
        const contenido = (
          <>
            <path
              d={parcela.d}
              fill={relleno}
              stroke="#111210"
              strokeWidth={activo ? 3 : 1.2}
              strokeDasharray={estado === "sinDatos" ? "4 3" : undefined}
              strokeLinejoin="round"
              opacity={estado === "sinDatos" ? 0.9 : 0.92}
            />
            <text
              x={parcela.etiqueta[0]}
              y={parcela.etiqueta[1]}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill="#111210"
              stroke="#FFFFFF"
              strokeWidth="3"
              paintOrder="stroke"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {lote.nombre.length > 14 ? `${lote.nombre.slice(0, 13)}…` : lote.nombre}
            </text>
          </>
        );
        if (!alSeleccionar) return <g key={lote.id}>{contenido}</g>;
        return (
          <g
            key={lote.id}
            role="button"
            tabIndex={0}
            aria-label={`${lote.nombre}: ${lote.estadoTexto ?? estado}`}
            aria-pressed={activo}
            className="cursor-pointer outline-none [&:focus-visible>path]:stroke-cereza [&:focus-visible>path]:[stroke-width:3.5]"
            onClick={() => alSeleccionar(lote.id)}
            onKeyDown={(evento) => {
              if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                alSeleccionar(lote.id);
              }
            }}
          >
            {contenido}
          </g>
        );
      })}
    </svg>
  );
}
