import { useState } from "react";
import Sidebar from "@/components/navegacion/Sidebar";
import Topbar from "@/components/navegacion/Topbar";

export default function GestionPlagas() {
  // Estados para manejar el formulario, la previsualización y el historial
  const [registros, setRegistros] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [formData, setFormData] = useState({
    nombreTecnico: "",
    categoria: "plaga",
    descripcion: "",
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id === "nombre-tecnico" ? "nombreTecnico" : id]: value,
    });
  };

  // Manejar la carga y previsualización de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar datos en la tabla dinámicamente
  const guardarDatos = (e) => {
    e.preventDefault();
    const nuevoRegistro = {
      fecha: new Date().toLocaleDateString(),
      nombre: formData.nombreTecnico,
      categoria: formData.categoria,
      estado: "Entrenando...",
      // Lógica para asignar colores al badge según la categoría seleccionada
      badgeColor:
        formData.categoria === "plaga"
          ? "bg-[#ffe5ec] text-[#d90429]" // Rojo
          : formData.categoria === "enfermedad"
          ? "bg-[#fff3bf] text-[#b58404]" // Amarillo
          : "bg-[#e7f5ff] text-[#1c7ed6]", // Azul
    };

    setRegistros([nuevoRegistro, ...registros]);

    // Limpiar formulario
    setFormData({ nombreTecnico: "", categoria: "plaga", descripcion: "" });
    setImagenPreview(null);
    e.target.reset();
  };

  return (
    <main className="flex min-h-screen bg-page font-sans text-ink">
      
      {/* Barra lateral unificada */}
      <Sidebar role="administrador" />

      {/* Contenido Principal */}
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-10 py-8">
        
        {/* Cabecera Superior compartida */}
        <Topbar
          eyebrow="PLATAFORMA DE ENTRENAMIENTO IA"
          title="Gestión técnica de patógenos y plagas"
          notifTo="#notificaciones"
          perfilTo="#perfil"
          avatar="https://ui-avatars.com/api/?name=Yordi+Fernández&background=4e2a15&color=fff"
          nombre="Yordi Fernández"
          rol="Administrador"
        />

        {/* Barra de Estado */}
        <section className="flex w-full items-center gap-3 rounded-xl bg-green-soft px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-green shadow-[0_0_8px_#689f38]"></span>
          <span className="text-sm font-bold text-green">Servidor IA Activo</span>
        </section>

        {/* Grid de Formulario e Historial */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          
          {/* Columna Izquierda: Formulario */}
          <article className="rounded-xl border border-line border-l-4 border-l-green bg-surface p-8 shadow-sm">
            <header className="mb-6">
              <h2 className="mb-1 text-2xl font-semibold text-ink">Actualizar Base de Datos</h2>
              <p className="text-sm text-muted">Ingrese muestras para reentrenar la red neuronal</p>
            </header>

            <form id="ia-form" onSubmit={guardarDatos} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                Nombre Técnico / Científico
                <input
                  type="text"
                  id="nombre-tecnico"
                  placeholder="Ej: Hemileia vastatrix (Roya)"
                  value={formData.nombreTecnico}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-line bg-surface p-3 font-normal outline-none transition-colors focus:border-green"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                Categoría de riesgo
                <select
                  id="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="rounded-lg border border-line bg-surface p-3 font-normal outline-none transition-colors focus:border-green"
                >
                  <option value="plaga">Plaga (Insectos/Artrópodos)</option>
                  <option value="enfermedad">Enfermedad (Hongos/Bacterias)</option>
                  <option value="deficiencia">Deficiencia Nutricional</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
                Descripción detallada para IA
                <textarea
                  id="descripcion-tecnica"
                  rows="3"
                  placeholder="Describa patrones visuales, coloración y síntomas clave..."
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-line bg-surface p-3 font-normal outline-none transition-colors focus:border-green"
                ></textarea>
              </label>

              {/* Zona Drag & Drop / Input Archivo */}
              <aside className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c5d6af] bg-[#f6f8f3] p-8 text-center transition-colors hover:border-green">
                <label htmlFor="imagen-plaga" className="flex cursor-pointer flex-col items-center gap-3">
                  <i className="fa-solid fa-camera text-3xl text-green"></i>
                  <strong className="text-base text-ink">Muestras visuales IA</strong>
                  <small className="text-sm font-normal text-muted">Suelte una imagen aquí o haga clic para examinar</small>
                </label>
                <input
                  type="file"
                  id="imagen-plaga"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {/* Previsualización dinámica de la imagen */}
                {imagenPreview && (
                  <figure className="mt-4 w-full">
                    <img
                      src={imagenPreview}
                      alt="Vista previa"
                      className="mx-auto max-h-40 max-w-full rounded-lg border-2 border-green object-contain"
                    />
                  </figure>
                )}
              </aside>

              <footer className="mt-4 flex">
                <button type="submit" className="w-full rounded-lg bg-green px-6 py-3 text-base font-semibold text-surface transition-colors hover:bg-green-deep">
                  Actualizar modelo de IA
                </button>
              </footer>
            </form>
          </article>

          {/* Columna Derecha: Historial Dinámico */}
          <article className="rounded-xl border border-line bg-surface p-8 shadow-sm">
            <header className="mb-6">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-green">HISTORIAL</span>
              <p className="text-sm text-ink">Registros recientes enviados al pipeline de entrenamiento</p>
            </header>

            <figure className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border-b-2 border-line bg-page px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Fecha</th>
                    <th className="border-b-2 border-line bg-page px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Patógeno</th>
                    <th className="border-b-2 border-line bg-page px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Tipo</th>
                    <th className="border-b-2 border-line bg-page px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Estado IA</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="border-b border-line px-4 py-12 text-center text-sm text-muted">
                        Aún no hay registros enviados.
                      </td>
                    </tr>
                  ) : (
                    registros.map((registro, index) => (
                      <tr key={index}>
                        <td className="border-b border-line px-4 py-4 text-sm text-muted">{registro.fecha}</td>
                        <td className="border-b border-line px-4 py-4 text-sm font-semibold text-ink">{registro.nombre}</td>
                        <td className="border-b border-line px-4 py-4">
                          <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase ${registro.badgeColor}`}>
                            {registro.categoria}
                          </span>
                        </td>
                        <td className="border-b border-line px-4 py-4">
                          <span className="rounded-full bg-green-soft px-3 py-1 text-xs font-bold text-[#1b4332]">
                            {registro.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </figure>
          </article>

        </section>
      </section>
    </main>
  );
}
