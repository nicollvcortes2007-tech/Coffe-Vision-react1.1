import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PlantillaAuth from "@/plantillas/PlantillaAuth";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", rol: "" });

  const actualizar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    if (form.rol === "administrador") {
      navigate("/dashboard/administrador");
      return;
    }
    navigate("/dashboard/caficultor");
  };

  return (
    <PlantillaAuth titulo="Bienvenido de nuevo" subtitulo="Ingresa tus credenciales para acceder a tu finca digital">
      <form onSubmit={enviar} className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Correo Electrónico
          <input
            type="email"
            required
            placeholder="ejemplo@correo.com"
            value={form.email}
            onChange={actualizar("email")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Contraseña
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={actualizar("password")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-coffee">
          Tipo de usuario
          <select
            required
            value={form.rol}
            onChange={actualizar("rol")}
            className="min-h-[46px] rounded-lg border border-line px-3 font-normal text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
          >
            <option value="" disabled>Selecciona tu rol</option>
            <option value="caficultor">Caficultor</option>
            <option value="administrador">Administrador</option>
          </select>
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="h-4 w-4" /> Recordarme
          </label>
          <Link to="#" className="font-semibold text-green hover:text-green-deep">¿Olvidaste tu contraseña?</Link>
        </div>

        <button type="submit" className="mt-1 min-h-[46px] rounded-lg bg-green font-bold text-white hover:bg-green-deep">
          Iniciar sesión
        </button>

        <footer className="text-center text-sm text-muted">
          <p>¿Aún no tienes cuenta? <Link to="/registro" className="font-semibold text-green">Regístrate aquí</Link></p>
        </footer>
      </form>
    </PlantillaAuth>
  );
}

export default Login;
