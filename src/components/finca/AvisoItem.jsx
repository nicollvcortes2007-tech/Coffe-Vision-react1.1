import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import Estado from "@/components/ui/Estado";
import { useRegistro } from "@/components/registro/ContextoRegistro";

/* Un aviso de «Hoy en la finca»: qué hacer, dónde, por qué y de dónde sale la regla. */
export default function AvisoItem({ aviso, mostrarLote = true }) {
  const { abrir } = useRegistro();
  const nivel = aviso.nivel === "info" ? "sinDatos" : aviso.nivel;
  return (
    <li className="grid gap-3 rounded-2xl border border-linea bg-papel p-4 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-5 sm:p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {aviso.nivel === "info" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-niebla px-2.5 py-1 text-sm font-bold text-niebla-oscura">
              <Info className="h-4 w-4" aria-hidden="true" /> Para saber
            </span>
          ) : (
            <Estado tipo={nivel} pequeno />
          )}
          {mostrarLote && aviso.loteNombre && (
            <Link to={`/finca/lotes/${aviso.loteId}`} className="text-sm font-bold text-tierra-media underline-offset-2 hover:underline">
              {aviso.loteNombre}
            </Link>
          )}
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug">{aviso.titulo}</h3>
        <p className="mt-1 text-[0.95rem] text-tierra-media">{aviso.razon}</p>
        {aviso.fuente && (
          <a href={aviso.fuente.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-tierra-media underline decoration-linea underline-offset-2 hover:decoration-tierra-media">
            Fuente: {aviso.fuente.texto}
          </a>
        )}
      </div>
      {aviso.accion && (
        <button
          type="button"
          className={aviso.nivel === "actuar" ? "boton-primario" : "boton-secundario"}
          onClick={() => abrir(aviso.accion.registrar, { loteId: aviso.loteId ?? undefined, tipoLabor: aviso.accion.tipoLabor, motivo: aviso.tipo === "roya" ? "roya" : undefined })}
        >
          {aviso.accion.texto} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
