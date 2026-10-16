import { useId } from "react";

/* Etiqueta + control + ayuda + error, siempre en el mismo orden y bien asociados. */
export default function Campo({ etiqueta, ayuda, error, children, className = "", opcional = false }) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const descritoPor = [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") || undefined;
  const control = typeof children === "function" ? children({ id, "aria-describedby": descritoPor, "aria-invalid": error ? true : undefined }) : children;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.95rem] font-bold text-tinta">
        {etiqueta}
        {opcional && <span className="ml-1.5 font-normal text-grafito">(opcional)</span>}
      </label>
      {control}
      {ayuda && !error && (
        <p id={idAyuda} className="text-sm text-grafito">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} role="alert" className="text-sm font-bold text-cereza">
          {error}
        </p>
      )}
    </div>
  );
}
