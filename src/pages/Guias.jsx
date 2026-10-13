import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';

import documento from '@/assets/iconos/documento.png';
import caficultor from '@/assets/imagenes/caficultor.jpg';
import { useState } from 'react';


const guias = [
    {
        titulo: "Germinación y trasplante",
        descripción: "La germinación y el trasplante son las primeras etapas del ciclo productivo del café y constituyen la base para el establecimiento de una plantación sana, uniforme y productiva",
        descripcionGuia: "Esta guía detalla el proceso completo desde la selección de semillas de calidad y su germinación en semilleros, hasta el momento óptimo del trasplante al campo definitivo."
    },

    {
        titulo: "Desarrollo Vegetativo",
        descripción: "El desarrollo vegetativo del café comprende el período desde el establecimiento de la planta en el campo hasta el inicio de la producción. Durante esta etapa se forma la estructura qué determinará la productividad futura del cultivo",
        descripcionGuia: "Esta guía detalla del desarrollo de la planta de café desde el establecimiento de la planta en el campo hasta el inicio de la producción. Aquí se forma la estructura (raíz, tallo, ramas y hojas) que definirá la productividad futura del cultivo."
    },


    {
        titulo: "Floración",
        descripción: "La floración es una de las etapas más importantes del cultivo del café, ya que determina el potencial de producción de la cosecha. Durante esta fase la planta desarrolla flores que posteriormente darán origen a los frutos.",
        descripcionGuia: "Esta guía detalla la fase en la que la planta desarrolla las flores que darán origen a los frutos. Es una de las etapas más importantes del cultivo porque define el potencial de producción de la cosecha"
    },

    {
        titulo: "Formación del grano",
        descripción: "La formación del grano es la etapa que sigue a la floración y fecundación del café. Durante ese período el fruto crece, acumula nutrientes y desarrolla las características químicas que determinarán la calidad de la bebida.",
        descripcionGuia: "Esta guía sigue a la floración y a la fecundación. Durante este período el fruto crece y acumula nutrientes, y se desarrollan las características químicas y físicas que determinarán la calidad de la bebida"
    },

    {
        titulo: "Maduración y cosecha",
        descripción: "La maduración y la cosecha constituyen la etapa final del ciclo productivo del café. Una cosecha realizada en el momento adecuado permite maximizar el rendimiento, mejorar la calidad de taza y aumentar la rentabilidad del cultivo.",
        descripcionGuia: "Esta guía detalla la etapa en la que los frutos alcanzan su punto óptimo de desarrollo y color para ser recolectados. La recolección selectiva de cerezas maduras, realizada en el momento justo."
    },
];

function Guias() {

    const [busqueda, setBusqueda] = useState("");
    const [guiaSeleccionada, setGuiaSeleccionada] = useState(null);

    const guiasFiltradas = guias.filter((guia) =>
        guia.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );



    return (
        <PlantillaPrincipal role="caficultor">
            <Topbar
                eyebrow="Aprendizaje"
                title="Guías de buenas prácticas"
                notiflo="/notificaciones"
                perfilto="/perfil"
                caficultor={caficultor}
                nombre="Caficultor"
                rol="Finca El Paraiso"
            />

            <section className="flex min-h-screen">


                {/* Contenido */}
                <main className="flex-1  p-6 pr-8">



                    {/* nav */}
                    <section className="mb-7 flex items-center gap-5 rounded-xl border border-[#e5ddc8] bg-white p-4">
                        <article className="flex max-w-[280px] flex-1 items-center gap-2 rounded-full bg-[#e5ddc8] px-4 py-2.5">
                            <input
                                type="text"
                                placeholder="Buscar.."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="flex-1 border-none bg-transparent text-base text-[#4a2f1c] outline-none"
                            />
                        </article>
                    </section>



                    {/* Guias la cartica */}
                    <section className="grid grid-cols-1 gap-6  sm:grid-cols-2 lg:grid-cols-3">
                        {guiasFiltradas.length === 0 ? (
                            <p className="col-span-full py-10 text-center text-lg text-[#4a2f1c]">
                                No se encontraron guías para "{busqueda}"
                            </p>
                        ) : (
                            guiasFiltradas.map((guia) =>
                                <article key={guia.titulo} className="flex flex-col border border-green-300 shadow-sm hover:shadow-md transition-shadow rounded-xl  bg-white p-5">
                                    <section className="mb-3.5 flex items-center justify-between">
                                        <button
                                            onClick={() => setGuiaSeleccionada(guia)}
                                            className="flex items-center gap-2 rounded-full bg-[#a26443] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#8a5233]"
                                        >
                                            <img src={documento} alt="Doc" className="h-4 w-4" />
                                            Ver guía
                                        </button>
                                    </section>
                                    <h3 className="mb-2 text-[20px] font-bold text-[#6b3a1f]">{guia.titulo}</h3>
                                    <p className="mb-4 flex-1  leading-relaxed text-[#4a2f1c]">{guia.descripción}</p>
                                    <button className="self-start text-[14px] rounded-md bg-[#6b7c2b] px-3.5 py-2.5 font-semibold text-white hover:bg-[#5c6a24]">
                                        Descargar documento
                                    </button>
                                </article>
                            ))}
                    </section>

                </main>


            </section>



            {/* La pantallita de la descrición de la guia */}
            {guiaSeleccionada && (
                <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <section className="w-full max-w-lg rounded-2xl bg-white p-6">
                        <article className="mb-4 flex items-center gap-3">
                            <img src={documento} alt="Doc" className="h-10 w-10" />
                            <h2 className="text-xl font-bold text-[#6b3a1f]">{guiaSeleccionada.titulo}</h2>
                        </article>

                        <p className="mb-4 leading-relaxed text-[#4a2f1c]">
                            {guiaSeleccionada.descripcionGuia}
                        </p>

                        {/* Espacio reservado para el video explicativo */}
                        <article className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-[#f5f0e8]">
                            <p className="text-sm text-[#4a2f1c]">
                                Video explicativo próximamente
                            </p>
                        </article>

                        <button
                            onClick={() => setGuiaSeleccionada(null)}
                            className="w-full rounded-md bg-[#6b7c2b] py-2.5 font-semibold text-white hover:bg-[#5c6a24]"
                        >
                            Cerrar
                        </button>
                    </section>
                </section>
            )}

        </PlantillaPrincipal>
    )
}

export default Guias;