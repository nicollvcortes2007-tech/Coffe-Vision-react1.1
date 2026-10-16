import { useId } from "react";
import { num } from "@/utilidades/formato";

/*
  Barras verticales en SVG, sin librerías. Los datos también van en una tabla oculta
  para lectores de pantalla. Una línea opcional marca un umbral (por ejemplo, 2 %).
*/
export default function Barras({ datos, alto = 160, formato = num, umbral, etiquetaUmbral, color = "#4B4D47", colorSobre = "#C3121B", titulo }) {
  const id = useId();
  const maximo = Math.max(...datos.map((d) => d.valor), umbral ?? 0, 1) * 1.12;
  const ancho = Math.max(datos.length * 44, 240);
  const barra = 26;
  const paso = ancho / Math.max(datos.length, 1);
  const y = (valor) => alto - (valor / maximo) * alto;
  return (
    <figure className="relative m-0">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${ancho} ${alto + 34}`} className="h-auto w-full min-w-[18rem]" role="img" aria-labelledby={`${id}-t`}>
          <title id={`${id}-t`}>{titulo}</title>
          <line x1="0" x2={ancho} y1={alto} y2={alto} stroke="#DCDDD7" />
          {datos.map((d, i) => {
            const x = i * paso + (paso - barra) / 2;
            const sobre = umbral !== undefined && d.valor >= umbral;
            return (
              <g key={`${d.etiqueta}-${i}`}>
                <rect x={x} y={y(d.valor)} width={barra} height={Math.max(alto - y(d.valor), d.valor > 0 ? 2 : 0)} rx="2" fill={d.color ?? (sobre ? colorSobre : color)} />
                {d.valor > 0 && (
                  <text x={x + barra / 2} y={y(d.valor) - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111210" style={{ fontFamily: "var(--font-mono)" }}>
                    {formato(d.valor)}
                  </text>
                )}
                <text x={x + barra / 2} y={alto + 20} textAnchor="middle" fontSize="11" fill="#4B4D47" style={{ fontFamily: "var(--font-sans)" }}>
                  {d.etiqueta}
                </text>
              </g>
            );
          })}
          {umbral !== undefined && (
            <g>
              <line x1="0" x2={ancho} y1={y(umbral)} y2={y(umbral)} stroke="#C3121B" strokeDasharray="5 4" strokeWidth="1.5" />
              <text x={ancho - 4} y={y(umbral) - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="#C3121B" style={{ fontFamily: "var(--font-mono)" }}>
                {etiquetaUmbral}
              </text>
            </g>
          )}
        </svg>
      </div>
      {/* Las tablas no se dejan encoger a 1 px: el envoltorio oculto es el que recorta. */}
      <div className="sr-only top-0 left-0">
        <table>
          <caption>{titulo}</caption>
          <tbody>
            {datos.map((d, i) => (
              <tr key={i}>
                <th scope="row">{d.etiqueta}</th>
                <td>{formato(d.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/* Barra horizontal de proporción (para la estructura de costos). */
export function Proporcion({ etiqueta, valor, referencia, texto }) {
  return (
    <div className="grid gap-1">
      <div className="flex items-baseline justify-between gap-3 text-[0.95rem]">
        <span className="font-bold">{etiqueta}</span>
        <span className="cifra text-grafito">{texto}</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-cal-honda">
        <div className="h-full rounded-full bg-grafito" style={{ width: `${Math.min(100, valor)}%` }} />
        {referencia !== undefined && <div className="absolute top-0 h-full w-0.5 bg-cereza" style={{ left: `${Math.min(100, referencia)}%` }} title={`Referencia nacional: ${referencia} %`} />}
      </div>
    </div>
  );
}
