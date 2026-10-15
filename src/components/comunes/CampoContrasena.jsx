import { useState } from "react";

export default function CampoContrasena({
  id,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  minLength,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <section className="grid gap-1.5 text-sm font-semibold text-coffee">
      <label htmlFor={id}>{label}</label>
      <span className="relative block">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="min-h-[46px] w-full rounded-lg border border-line px-3 pr-12 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
        />
        <button
          type="button"
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          onClick={() => setVisible((actual) => !actual)}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted transition-colors hover:text-coffee focus-visible:outline focus-visible:outline-2 focus-visible:outline-green"
        >
          <i className={`fa-regular ${visible ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
        </button>
      </span>
    </section>
  );
}
