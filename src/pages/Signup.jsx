import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PlantillaAuth from "@/plantillas/PlantillaAuth";

const CAMPOS = [
  { id: "nombre", label: "Nombre Completo", type: "text", placeholder: "Tu nombre" },
  { id: "email", label: "Correo Electrónico", type: "email", placeholder: "ejemplo@correo.com" },
  { id: "telefono", label: "Teléfono", type: "tel", placeholder: "+57 300 123 4567" },
];

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const actualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("¡Ups! Las contraseñas no coinciden. Por favor, verifícalas.");
      return;
    }
    setError("");
    if (form.rol === "administrador") {
      navigate("/dashboard/administrador");
      return;
    }
    navigate("/dashboard/caficultor");
  };

  return (
    <PlantillaAuth titulo="Crear Cuenta" subtitulo="Completa tus datos para comenzar con CoffeeTech">
      <form onSubmit={enviar} className="grid gap-4">
        {CAMPOS.map((campo) => (
          <label key={campo.id} className="grid gap-1.5 text-sm font-semibold text-coffee">
            {campo.label}
            <input
              type={campo.type}
              required
              placeholder={campo.placeholder}
              value={form[campo.id] || ""}
              onChange={actualizar(campo.id)}
              className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
            />
          </label>
        ))}

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Tipo de Usuario
          <select
            required
            value={form.rol || ""}
            onChange={actualizar("rol")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="caficultor">Caficultor</option>
            <option value="administrador">Administrador</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Nombre de la Finca
          <input
            type="text"
            required
            placeholder="Ej: Finca El Paraíso"
            value={form.finca || ""}
            onChange={actualizar("finca")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Ubicación
          <input
            type="text"
            required
            placeholder="Huila, Colombia"
            value={form.ubicacion || ""}
            onChange={actualizar("ubicacion")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Contraseña
          <input
            type="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            value={form.password || ""}
            onChange={actualizar("password")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Confirmar Contraseña
          <input
            type="password"
            required
            placeholder="Repite tu contraseña"
            value={form.confirmPassword || ""}
            onChange={actualizar("confirmPassword")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        {error && <p className="text-sm font-semibold text-danger">{error}</p>}

        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" required className="mt-1 h-4 w-4" />
          Acepto los términos y condiciones y la política de privacidad
        </label>

        <button type="submit" className="mt-1 min-h-[46px] rounded-lg bg-green font-bold text-white hover:bg-green-deep">
          Crear Cuenta
        </button>

        <footer className="text-center text-sm text-muted">
          <p>¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-green">Inicia Sesión</Link></p>
        </footer>
      </form>
    </PlantillaAuth>
  );
}

export default Signup;
