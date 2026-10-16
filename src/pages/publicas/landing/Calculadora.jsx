import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { precioCargaPorFR, FR_BASE, FUENTES } from "@/datos/agronomia";
import { cop, fLarga, num } from "@/utilidades/formato";

/* Cifra con dígitos de rodillo (0–9) que giran al cambiar; el valor real va en texto. */
function Rodillo({ texto, className = "" }) {
  const caracteres = [...texto];
  return (
    <span className={`inline-flex overflow-hidden leading-none ${className}`} aria-hidden="true">
      {caracteres.map((c, i) => {
        const clave = caracteres.length - i;
        if (!/\d/.test(c)) {
          return (
            <span key={`s${clave}`} className="inline-block">
              {c === " " ? " " : c}
            </span>
          );
        }
        return (
          <span key={`d${clave}`} className="inline-block h-[1em] overflow-hidden">
            <span className="block transition-transform duration-700 ease-[var(--ease-instrumento)]" style={{ transform: `translateY(-${Number(c)}em)` }}>
              {"0123456789".split("").map((d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/*
  ¿Cuánto vale tu carga? El precio de la FNC se publica para un factor de rendimiento
  de 94; con la tabla del día se calcula el valor de la carga para otro factor.
*/
export default function Calculadora({ precio }) {
  const [fr, setFr] = useState(FR_BASE);
  const [cargas, setCargas] = useState(10);
  const idFr = useId();
  const idCargas = useId();
  const porCarga = precioCargaPorFR(precio.precioCarga, fr, precio.pasillaKg);
  const total = porCarga * cargas;
  const diferencia = (porCarga - precio.precioCarga) * cargas;
  const ajustarCargas = (valor) => setCargas(Math.min(999, Math.max(1, Math.round(valor) || 1)));

  return (
    <section id="calculadora" className="bg-amarillo text-tinta">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-28">
        <div>
          <p className="font-mono text-[0.75rem] tracking-[0.06em] uppercase">05 · Precio</p>
          <h2 className="titular-mayor mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)]">¿Cuánto vale tu carga?</h2>
          <p className="mt-5 max-w-md text-lg">
            La FNC publica el precio para un factor de rendimiento de 94. Si el café rinde peor (más pasilla, más grano brocado), el factor sube y la carga vale menos. Mueve el factor y mira.
          </p>
          <a href={FUENTES.fr.url} target="_blank" rel="noreferrer" className="mt-6 block max-w-md font-mono text-[0.6875rem] leading-relaxed underline decoration-tinta/40 underline-offset-2">
            Precio base: {cop(precio.precioCarga)} por carga, {fLarga(precio.fecha)}. Fuente: {FUENTES.fr.texto}
          </a>
        </div>

        <div className="rounded-[var(--radius-placa)] bg-tinta p-5 text-niebla sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={idFr} className="font-mono text-[0.6875rem] tracking-[0.05em] text-ceniza uppercase">
                Factor de rendimiento
              </label>
              <p className="numeral mt-2 text-[2.6rem] text-amarillo">{num(fr)}</p>
              <input id={idFr} type="range" min="88" max="100" step="0.5" value={fr} onChange={(e) => setFr(Number(e.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-amarillo" aria-valuetext={`Factor ${num(fr)}`} />
              <div className="mt-1 flex justify-between font-mono text-[0.625rem] text-ceniza">
                <span>88 · mejor</span>
                <span>100 · peor</span>
              </div>
            </div>
            <div>
              <label htmlFor={idCargas} className="font-mono text-[0.6875rem] tracking-[0.05em] text-ceniza uppercase">
                Cargas de pergamino seco
              </label>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" onClick={() => ajustarCargas(cargas - 1)} className="grid h-12 w-12 place-items-center rounded-[4px] bg-escoria-clara hover:bg-escoria" aria-label="Una carga menos">
                  <Minus className="h-5 w-5" aria-hidden="true" />
                </button>
                <input
                  id={idCargas}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="999"
                  value={cargas}
                  onChange={(e) => ajustarCargas(Number(e.target.value))}
                  className="numeral h-12 w-full min-w-0 rounded-[4px] border-[1.5px] border-niebla/25 bg-transparent text-center text-[1.6rem] text-niebla outline-none focus:border-amarillo"
                />
                <button type="button" onClick={() => ajustarCargas(cargas + 1)} className="grid h-12 w-12 place-items-center rounded-[4px] bg-escoria-clara hover:bg-escoria" aria-label="Una carga más">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 font-mono text-[0.625rem] text-ceniza">1 carga = 125 kg de café pergamino seco</p>
            </div>
          </div>

          <div className="mt-8 border-t border-niebla/15 pt-6">
            <p className="font-mono text-[0.6875rem] tracking-[0.05em] text-ceniza uppercase">Valor de {cargas === 1 ? "la carga" : `las ${cargas} cargas`}</p>
            <p className="numeral mt-2 text-[clamp(2.2rem,6.4vw,4.4rem)] text-niebla">
              <Rodillo texto={cop(total)} />
            </p>
            <p className="sr-only" aria-live="polite">
              {cop(total)} por {cargas} cargas con factor {num(fr)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] bg-niebla/12">
              <div className="bg-tinta p-3">
                <p className="font-mono text-[0.625rem] tracking-[0.05em] text-ceniza uppercase">Por carga</p>
                <p className="numeral mt-1 text-xl">{cop(porCarga)}</p>
              </div>
              <div className="bg-tinta p-3">
                <p className="font-mono text-[0.625rem] tracking-[0.05em] text-ceniza uppercase">Frente al factor 94</p>
                <p className={`numeral mt-1 text-xl ${diferencia < -0.5 ? "text-cereza-viva" : diferencia > 0.5 ? "text-amarillo" : "text-niebla"}`}>
                  {Math.abs(diferencia) < 0.5 ? "Igual" : `${diferencia > 0 ? "+" : "−"}${cop(Math.abs(diferencia))}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
