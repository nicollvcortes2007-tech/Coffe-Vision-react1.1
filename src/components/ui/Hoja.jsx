import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/*
  Hoja que sube desde abajo en el celular y se centra en escritorio. Usa <dialog>
  nativo: atrapa el foco, cierra con Escape y devuelve el foco al abrir/cerrar.
*/
export default function Hoja({ abierta, alCerrar, titulo, descripcion, children, ancho = "max-w-xl" }) {
  const ref = useRef(null);
  const idTitulo = useId();
  const idDescripcion = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierta && !dialogo.open) dialogo.showModal();
    if (!abierta && dialogo.open) dialogo.close();
  }, [abierta]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      aria-describedby={descripcion ? idDescripcion : undefined}
      onClose={alCerrar}
      onCancel={(evento) => {
        evento.preventDefault();
        alCerrar();
      }}
      onMouseDown={(evento) => {
        if (evento.target === ref.current) alCerrar();
      }}
      className={`m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-lg bg-lamina p-0 text-tinta shadow-levantado backdrop:bg-tinta/45 backdrop:backdrop-blur-[2px] sm:m-auto sm:rounded-lg ${ancho} sm:w-[calc(100%-2rem)]`}
    >
      {abierta && (
        <div className="flex max-h-[92dvh] flex-col animate-aparecer">
          <header className="flex items-start gap-3 border-b border-linea px-5 pt-5 pb-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <h2 id={idTitulo} className="titular text-[1.6rem]">
                {titulo}
              </h2>
              {descripcion && (
                <p id={idDescripcion} className="mt-1 text-[0.95rem] text-grafito">
                  {descripcion}
                </p>
              )}
            </div>
            <button type="button" onClick={alCerrar} className="boton-fantasma -mr-2 h-12 w-12 px-0" aria-label="Cerrar">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
          <div className="overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}
