import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stamp, Undo2, X, CircleAlert } from "lucide-react";

/*
  Avisos apilados abajo, por encima de la barra del celular. Un registro guardado
  muestra el sello «Registrado»; un borrado ofrece «Deshacer» durante 6 s
  (DESIGN.md → Motion). Se anuncian por una región aria-live.
*/

const ContextoAvisos = createContext(null);
const DURACION = 6000;

export function ProveedorAvisos({ children }) {
  const [avisos, setAvisos] = useState([]);
  const temporizadores = useRef(new Map());

  const quitar = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
  }, []);

  const avisar = useCallback(
    (aviso) => {
      const id = crypto.randomUUID();
      setAvisos((actuales) => [...actuales.slice(-2), { id, tipo: "info", ...aviso }]);
      temporizadores.current.set(id, setTimeout(() => quitar(id), aviso.duracion ?? DURACION));
      return id;
    },
    [quitar],
  );

  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((temporizador) => clearTimeout(temporizador));
  }, []);

  const valor = useMemo(
    () => ({
      registrado: (texto, detalle) => avisar({ tipo: "registrado", texto, detalle }),
      error: (texto) => avisar({ tipo: "error", texto }),
      info: (texto) => avisar({ tipo: "info", texto }),
      conDeshacer: (texto, alDeshacer) => avisar({ tipo: "deshacer", texto, alDeshacer }),
    }),
    [avisar],
  );

  return (
    <ContextoAvisos.Provider value={valor}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:left-auto lg:right-6 lg:items-end"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            role={aviso.tipo === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-tostado px-4 py-3 text-papel shadow-levantado animate-aparecer"
          >
            {aviso.tipo === "registrado" && (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-pinton text-pinton animate-sello">
                <Stamp className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            {aviso.tipo === "error" && <CircleAlert className="h-5 w-5 shrink-0 text-cereza-tenue" aria-hidden="true" />}
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug">{aviso.texto}</p>
              {aviso.detalle && <p className="text-sm text-papel/75">{aviso.detalle}</p>}
            </div>
            {aviso.tipo === "deshacer" && (
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-papel/12 px-3 font-bold text-pinton hover:bg-papel/20"
                onClick={() => {
                  aviso.alDeshacer?.();
                  quitar(aviso.id);
                }}
              >
                <Undo2 className="h-4 w-4" aria-hidden="true" />
                Deshacer
              </button>
            )}
            <button type="button" onClick={() => quitar(aviso.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-papel/70 hover:bg-papel/10" aria-label="Cerrar aviso">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ContextoAvisos.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAvisos() {
  const contexto = useContext(ContextoAvisos);
  if (!contexto) throw new Error("useAvisos debe usarse dentro de ProveedorAvisos");
  return contexto;
}
