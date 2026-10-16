import { useId, useState } from "react";
import { Info } from "lucide-react";

/*
  Cifra grande con la unidad del gremio al lado y, a un toque, de dónde sale
  (DESIGN.md: «cada número dice de dónde sale»).
*/
export default function Cifra({ rotulo, valor, unidad, detalle, fuente, tono = "tierra", tamano = "md" }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();
  const tamanos = { sm: "text-2xl", md: "text-[2rem]", lg: "text-[2.6rem]" };
  const tonos = { tierra: "text-tinta", cereza: "text-cereza", hoja: "text-tinta", pinton: "text-amarillo-texto" };
  return (
    <div className="min-w-0">
      <p className="rotulo flex items-center gap-1.5">
        {rotulo}
        {fuente && (
          <button
            type="button"
            className="-m-2 grid h-9 w-9 place-items-center rounded-full text-grafito hover:bg-cal-honda"
            aria-expanded={abierta}
            aria-controls={id}
            aria-label={`De dónde sale: ${rotulo}`}
            onClick={() => setAbierta((valorActual) => !valorActual)}
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </p>
      <p className={`cifra mt-1 font-bold leading-none tracking-tight ${tamanos[tamano]} ${tonos[tono]}`}>
        {valor}
        {unidad && <span className="ml-1.5 text-base font-bold tracking-normal text-grafito">{unidad}</span>}
      </p>
      {detalle && <p className="mt-1.5 text-sm text-grafito">{detalle}</p>}
      {fuente && abierta && (
        <p id={id} className="mt-2 rounded-lg bg-cal-honda/70 px-3 py-2 text-sm text-grafito animate-aparecer">
          {fuente}
        </p>
      )}
    </div>
  );
}
