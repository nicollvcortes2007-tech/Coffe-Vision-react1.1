import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';
import caficultor from '@/assets/imagenes/caficultor.jpg';
import broca from '@/assets/imagenes/Broca.jpg';
import cultivo from '@/assets/imagenes/cultivo.jpg';

const tarjetas = [
    { titulo: "Cultivos activos", dato: "4 Lotes", descripcion: "Variedad Castillo y Colombia", ancho: "85%", eficiencia: "85%" },
    { titulo: "Alertas Pendientes", dato: "2 Activas", descripcion: "Requieren revisión en lote", ancho: "92%", eficiencia: "92%" },
    { titulo: "Consultas Chat Bot", dato: "15 Asesorías", descripcion: "Este mes", ancho: "78%", eficiencia: "78%" },
    { titulo: "Estado del cultivo", dato: "En riesgo", descripcion: "Humedad alta detectada", ancho: "89%", eficiencia: "89%", riesgo: true },
];

const barras = [
    { alto: "30%", clase: "bg-[#7bc142]" },
    { alto: "80%", clase: "bg-[#7bc142]" },
    { alto: "95%", clase: "bg-[#7bc142]" },
    { alto: "70%", clase: "bg-[#7bc142]" },
    { alto: "50%", clase: "bg-[#7bc142]" },
];

const recomendaciones = ["Optimización del abonado", "Monitoreo preventivo", "Manejo de sombrío"];

const filtros = ["Fase", "Variedad Café", "Clima"];

const registros = [
    {
        subtitulo: "Registro 1:",
        lote: "Lote: El placer",
        alerta: "Alerta de Broca",
        afectacion: "Media",
        img: broca,
        alt: "Broca en fruto de café",
    },
    {
        subtitulo: "Registro 2:",
        lote: "Lote: La estancia",
        alerta: "Diagnóstico: Sano",
        afectacion: "Monitoreo diario",
        img: cultivo,
        alt: "Cultivo de café sano",
    },
];

const notificaciones = [
    { titulo: "ALERTA DE PLAGA:", texto: "Las lluvias recientes aumentan el riesgo de Minador en la zona. Revise el envés de las hojas." },
    { titulo: "RECORDATORIO:", texto: "Mañana corresponde el registro de control de malezas en la Bitácora Digital." },
];

function Recomendaciones() {
    return (
        <PlantillaPrincipal role="caficultor">
            <Topbar
                eyebrow="Recomendaciones"
                title="Recomendaciones técnicas"
                notiflo="/notificaciones"
                perfilto="/perfil"
                caficultor={caficultor}
                nombre="Caficultor"
                rol="Finca El Paraiso"
            />
            <main className="min-h-screen bg-[#f7f3ea] p-6 pr-9 text-[#333]">
                <h1 className="mb-6 text-[45px] font-bold text-[#7a1f1f]">Recomendaciones</h1>

                {/* Tarjetas */}
                <section className="mb-6 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
                    {tarjetas.map((t) => (
                        <article
                            key={t.titulo}
                            className="rounded-xl bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-105"
                        >
                            <h3 className="mb-2.5 text-[22px] text-[#888]">{t.titulo}</h3>
                            <p className={`mb-2 font-bold ${t.riesgo ? "text-[#d89c00]" : ""}`}>{t.dato}</p>
                            <p className="mb-2.5 text-base text-[#555]">{t.descripcion}</p>
                            <section className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#e0e0e0]">
                                <section className="h-full bg-[#4a2f1f]" style={{ width: t.ancho }}></section>
                            </section>
                            <p className="text-base text-[#888]">Eficiencia {t.eficiencia}</p>
                        </article>
                    ))}
                </section>

                {/* Fila 1 */}
                <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-[2fr,1fr]">

                    {/* Evolución de plagas */}
                    <article className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h3 className="mb-4 text-[26px]">Evolución semanal de plagas y enfermedades</h3>
                        <section className="mb-4 flex h-[150px] items-end gap-3 border-b-2 border-l-2 border-[#ccc] p-2.5">
                            {barras.map((b, i) => (
                                <section key={i} className={`w-[45px] rounded-t ${b.clase}`} style={{ height: b.alto }}></section>
                            ))}
                        </section>
                        <section className="ml-[5%]">
                            <h4 className="mb-2.5 text-[25px] text-[#7a1f1f]">Recomendaciones</h4>
                            {recomendaciones.map((r) => (
                                <p key={r} className="border-b border-[#eee] py-2 text-lg">{r}</p>
                            ))}
                        </section>
                    </article>

                    {/* Filtros */}
                    <article className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h3 className="mb-4 text-[26px]">Filtros de recomendaciones técnicas</h3>
                        {filtros.map((f) => (
                            <section key={f} className="mb-3 rounded-lg border border-[#eddccf] bg-[#faf6ec] p-3">
                                <p className="text-xl">{f}</p>
                            </section>
                        ))}
                    </article>
                </section>

                {/* Fila 2 */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr,1fr]">
                    {/* Historial */}
                    <article className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h2 className="mb-[18px] text-[22px] font-bold text-[#6b1d12]">Historial de detección de plagas</h2>
                        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {registros.map((r) => (
                                <section key={r.subtitulo} className="flex flex-col gap-1">
                                    <h4 className="mb-1 text-[15px] font-semibold text-[#444]">{r.subtitulo}</h4>
                                    <h3 className="text-xl font-extrabold text-[#222]">{r.lote}</h3>
                                    <p className="text-sm text-[#666]">{r.alerta}</p>
                                    <p className="mt-0.5 text-lg font-bold">{r.afectacion}</p>
                                    <img
                                        src={r.img}
                                        alt={r.alt}
                                        className="mt-2 h-[100px] w-full rounded-lg object-cover shadow-[0_2px_5px_rgba(0,0,0,0.1)]"
                                    />
                                </section>
                            ))}
                        </section>
                    </article>

                    {/* Notificaciones */}
                    <article className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h2 className="mb-[18px] text-[22px] font-bold text-[#6b1d12]">Notificaciones automáticas recientes</h2>
                        {notificaciones.map((n) => (
                            <section key={n.titulo} className="mb-4 last:mb-0">
                                <strong className="mb-1 block text-xl uppercase tracking-wide text-[#6b1d12]">{n.titulo}</strong>
                                <p className="text-lg text-[#444]">{n.texto}</p>
                            </section>
                        ))}
                    </article>
                </section>
            </main>
        </PlantillaPrincipal>
    );
}

export default Recomendaciones;