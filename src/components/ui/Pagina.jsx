import { useEffect } from "react";

/* Encabezado de página: título en Fraunces, bajada y acciones. Fija el título de la pestaña. */
export function EncabezadoPagina({ titulo, bajada, rotulo, acciones, children }) {
  useEffect(() => {
    document.title = `${titulo} · Coffee+Visión`;
  }, [titulo]);
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {rotulo && <p className="rotulo mb-2">{rotulo}</p>}
        <h1 className="titular text-[2.1rem] sm:text-[2.6rem]">{titulo}</h1>
        {bajada && <p className="mt-2 max-w-2xl text-grafito">{bajada}</p>}
        {children}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </header>
  );
}

export function Seccion({ titulo, bajada, acciones, children, className = "" }) {
  return (
    <section className={`placa p-5 sm:p-6 ${className}`}>
      {(titulo || acciones) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {titulo && <h2 className="titular text-[1.45rem]">{titulo}</h2>}
            {bajada && <p className="mt-1 text-[0.95rem] text-grafito">{bajada}</p>}
          </div>
          {acciones}
        </header>
      )}
      {children}
    </section>
  );
}

export function Vacio({ Icono, titulo, texto, accion }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-borde/60 bg-lamina/60 px-6 py-10 text-center">
      {Icono && <Icono className="mb-3 h-10 w-10 text-grafito" aria-hidden="true" strokeWidth={1.5} />}
      <p className="titular text-xl">{titulo}</p>
      {texto && <p className="mt-1.5 max-w-sm text-[0.95rem] text-grafito">{texto}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}
