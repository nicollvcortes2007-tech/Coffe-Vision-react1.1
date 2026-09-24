import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";

export default function RegistrarLabor() {
  const [guardado, setGuardado] = useState(false);

  function guardarLabor(event) {
    event.preventDefault();
    setGuardado(true);
    event.currentTarget.reset();
  }

  return (
    <PlantillaPrincipal role="caficultor">
      <Topbar
        eyebrow="Bitácora de la finca"
        title="Registrar labor"
        notifTo="/notificaciones"
        perfilTo="/perfil"
        nombre="Caficultor"
        rol="Finca El Paraíso"
      />
      <section className="w-full rounded-xl border border-line bg-white p-6 shadow-panel sm:p-8">
        <h2 className="text-2xl font-bold">Nueva labor agrícola</h2>
        <p className="mt-2 text-muted">Agrega una actividad a la bitácora de tu finca.</p>
        {guardado && (
          <p role="status" className="mt-5 rounded-lg bg-green-soft p-3 font-semibold text-green-deep">
            La labor quedó registrada.
          </p>
        )}
        <form onSubmit={guardarLabor} className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 font-semibold sm:col-span-2">
            Tipo de labor
            <select required className="rounded-lg border border-line bg-white p-3 font-normal">
              <option value="">Selecciona una labor</option>
              <option>Control de plagas</option>
              <option>Fertilización</option>
              <option>Poda</option>
              <option>Cosecha</option>
              <option>Riego</option>
            </select>
          </label>
          <label className="grid gap-2 font-semibold">
            Lote
            <input required placeholder="Ej. Lote 2" className="rounded-lg border border-line p-3 font-normal" />
          </label>
          <label className="grid gap-2 font-semibold">
            Fecha
            <input required type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="rounded-lg border border-line p-3 font-normal" />
          </label>
          <label className="grid gap-2 font-semibold sm:col-span-2">
            Observaciones
            <textarea rows="4" placeholder="Describe el trabajo realizado..." className="rounded-lg border border-line p-3 font-normal" />
          </label>
          <button type="submit" className="rounded-lg bg-green px-5 py-3 font-bold text-white hover:bg-green-deep sm:col-span-2">
            Guardar labor
          </button>
        </form>
      </section>
    </PlantillaPrincipal>
  );
}
