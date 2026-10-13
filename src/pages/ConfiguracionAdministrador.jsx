import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';

import caficultor from '@/assets/imagenes/caficultor.jpg';



import usuario from '@/assets/iconos/usuario.png';
const pestanas = ["Datos del administrador", "Seguridad", "Métricas del chat bot"];

const datos_administrador = [
    { id: "nombres", label: "Nombres y Apellidos", tipo: "text" },
    { id: "direccion", label: "Dirección del administrador", tipo: "text" },
    { id: "correo", label: "Correo Electrónico", tipo: "email" },
    { id: "finca", label: "Nombre de la finca", tipo: "text" },
];

function ConfiguracionAdministrador() {
    return (
        <PlantillaPrincipal role="administrador">
            <Topbar
                eyebrow="Configuración"
                title="Configuración del administrador"
                notiflo="/admin/notificaciones"
                perfilto="/admin/perfil"
                caficultor={caficultor}
                nombre="Administrador"
                rol="Administrador"
            />

            {/* contenido (Se quita la otra parte de configuración por redundancia de informacion) */}
            <main className="min-h-screen px-6 py-8 text-[#333] sm:px-10 ">
                <section className="w-full ">

                    {/* Pestañas de la barra superior */}
                    <nav className="mb-8 flex flex-wrap  gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-[#eee]">
                        {pestanas.map((p, i) => (
                            <button
                                key={p}
                                type="button"
                                className={`cursor-pointer rounded-lg px-4 py-2 text-base font-medium transition-colors ${i === 0
                                    ? "bg-[#6b7c2b] text-white shadow-sm"
                                    : "text-[#777] hover:bg-[#f2f0e9] hover:text-[#333]"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </nav>

                    {/* Pestaña: datos del administrador */}
                    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#eee] sm:p-8">
                        <section className="mb-6 flex items-start gap-3">

                            <article>
                                <h2 className="text-xl font-semibold text-[#7a1f1f]">
                                    Información del Administrador y Finca
                                </h2>
                                <p className="mt-0.5 text-sm text-[#888]">
                                    Actualice sus datos personales y de contacto
                                </p>
                            </article>
                        </section>

                        <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {datos_administrador.map((campo) => (
                                <section key={campo.id} className="flex flex-col gap-2">
                                    <label htmlFor={campo.id} className="text-lg font-semibold text-[#333]">
                                        {campo.label}
                                    </label>
                                    <input
                                        id={campo.id}
                                        type={campo.tipo}
                                        className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-sm transition-colors placeholder:text-[#aaa] focus:border-[#4a7c2f] focus:outline-none focus:ring-2 focus:ring-[#4a7c2f]/20"
                                    />
                                </section>
                            ))}
                        </form>

                        <article className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="cursor-pointer rounded-lg bg-[#6b7c2b] px-6 py-2.5 text-l font-semibold text-white transition-colors hover:bg-[#3d6826]"
                            >
                                Guardar cambios
                            </button>
                        </article>
                    </section>

                    {/* Tarjeta: cambiar contraseña */}
                    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#eee] sm:p-8">
                        <article className="mb-6 flex items-start gap-3">
                            
                            <article>
                                <h2 className="text-xl font-semibold text-[#7a1f1f]">
                                    Cambiar Contraseña
                                </h2>
                                <p className="mt-0.5 text-sm text-[#888]">
                                    Actualice su contraseña periódicamente para mantener su cuenta segura.
                                </p>
                            </article>
                        </article>

                        <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <article className="flex flex-col gap-2 sm:col-span-2">
                                <label htmlFor="current-pass" className="text-lg font-semibold text-[#333]">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    id="current-pass"
                                    placeholder="Ingrese su contraseña actual"
                                    required
                                    className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-l transition-colors placeholder:text-[#aaa] focus:border-[#4a7c2f] focus:outline-none focus:ring-2 focus:ring-[#4a7c2f]/20"
                                />
                            </article>

                            <article className="flex flex-col gap-2">
                                <label htmlFor="new-pass" className="text-lg font-semibold text-[#333]">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="new-pass"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-l transition-colors placeholder:text-[#aaa] focus:border-[#4a7c2f] focus:outline-none focus:ring-2 focus:ring-[#4a7c2f]/20"
                                />
                            </article>

                            <article className="flex flex-col gap-2">
                                <label htmlFor="confirm-pass" className="text-lg font-semibold text-[#333]">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirm-pass"
                                    placeholder="Repita la nueva contraseña"
                                    required
                                    className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-l transition-colors placeholder:text-[#aaa] focus:border-[#4a7c2f] focus:outline-none focus:ring-2 focus:ring-[#4a7c2f]/20"
                                />
                            </article>

                            <p className="flex items-start gap-2 text-xs text-[#888] sm:col-span-2">
                                
                                La contraseña debe tener al menos 8 caracteres, incluir un número y una letra mayúscula.
                            </p>

                            <article className="flex justify-end sm:col-span-2">
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-lg bg-[#6b7c2b] px-6 py-2.5 text-l font-semibold text-white transition-colors hover:bg-[#3d6826]"
                                >
                                    Actualizar contraseña
                                </button>
                            </article>
                        </form>
                    </section>

                    {/* Pestaña eliminación de cuenta */}
                    <section className="rounded-2xl border border-[#f0c9c7] bg-[#fdf6f5] p-6 shadow-sm sm:p-8">
                        <article className="mb-6 flex items-start gap-3">
                            
                            <article>
                                <h2 className="text-xl font-semibold text-[#a94442]">
                                    Eliminación de cuenta
                                </h2>
                                <p className="mt-0.5 text-sm text-[#888]">
                                    Esta acción es irreversible y borrará los datos de la finca y el administrador.
                                </p>
                            </article>
                        </article>

                        <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <section className="flex flex-col gap-2">
                                <label htmlFor="motivo" className="text-lg font-semibold text-[#333]">
                                    Motivo de cancelación (Opcional)
                                </label>
                                <select
                                    id="motivo"
                                    className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-l transition-colors focus:border-[#a94442] focus:outline-none focus:ring-2 focus:ring-[#a94442]/20"
                                >
                                    <option value="motivo">Seleccione un motivo</option>
                                    <option value="no-uso">Ya no utilizo el sistema</option>
                                    <option value="finca">Cambié de finca o administración</option>
                                    <option value="otro">Otro motivo</option>
                                </select>
                            </section>

                            <article className="flex flex-col gap-2">
                                <label htmlFor="pass-confirm" className="text-lg font-semibold text-[#333]">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    id="pass-confirm"
                                    placeholder="Ingrese su contraseña"
                                    required
                                    className="h-12 w-full rounded-lg border border-[#d5d0c4] bg-white px-3 text-l transition-colors placeholder:text-[#aaa] focus:border-[#a94442] focus:outline-none focus:ring-2 focus:ring-[#a94442]/20"
                                />
                            </article>

                            <article className="flex items-center gap-3 sm:col-span-2">
                                <input
                                    type="checkbox"
                                    id="check-riesgo"
                                    required
                                    className="h-4 w-4 cursor-pointer accent-[#d9534f]"
                                />
                                <label htmlFor="check-riesgo" className="cursor-pointer text-sm text-[#555]">
                                    Confirmo que deseo eliminar permanentemente los registros e historial de esta cuenta.
                                </label>
                            </article>

                            <section className="flex justify-end sm:col-span-2">
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-lg bg-[#d9534f] px-6 py-2.5 text-l font-semibold text-white transition-colors hover:bg-[#c9302c]"
                                >
                                    Eliminar cuenta definitivamente
                                </button>
                            </section>
                        </form>
                    </section>

                </section>
            </main>
        </PlantillaPrincipal>
    );
}

export default ConfiguracionAdministrador;
