import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';


import caficultor from '@/assets/imagenes/caficultor.jpg';



const guias = [
    {
        titulo: "Germinación y trasplante",
        descripción: "La germinación y el trasplante son las primeras etapas del ciclo productivo del café y constituyen la base para el establecimiento de una plantación sana, uniforme y productiva"
    },


    {
        titulo: "Desarrollo Vegetativo",
        descripción: "El desarrollo vegetativo del café comprende el período desde el establecimiento de la planta en el campo hasta el inicio de la producción. Durante esta etapa se forma la estructura qué determinará la productividad futura del cultivo"
    },


    {
        titulo: "Floración",
        descripción: "La floración es una de las etapas más importantes del cultivo del café, ya que determina el potencial de producción de la cosecha. Durante esta fase la planta desarrolla flores que posteriormente darán origen a los frutos."
    },


    {
        titulo: "Formación del grano",
        descripción: "La formación del grano es la etapa que sigue a la floración y fecundación del café. Durante ese período el fruto crece, acumula nutrientes y desarrolla las características químicas que determinarán la calidad de la bebida."
    },

    {
        titulo: "Maduración y cosecha",
        descripción: "La maduración y la cosecha constituyen la etapa final del ciclo productivo del café. Una cosecha realizada en el momento adecuado permite maximizar el rendimiento, mejorar la calidad de taza y aumentar la rentabilidad del cultivo."
    },
];

function Guias() {
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
                <main className="flex-1 bg-[#FBF9F2] p-6 pr-8">
                    <header className="mb-6">
                        <h1 className="text-[45px] font-bold text-[#6b3a1f]">Guías</h1>
                        <p className="mb-5 mt-0.5 font-semibold text-[#6b3a1f]">Información para tu cultivo</p>
                    </header>


                    {/* nav */}
                    <section className="mb-7 flex items-center gap-5 rounded-xl border border-[#e5ddc8] bg-white p-4">
                        <article className="flex max-w-[280px] flex-1 items-center gap-2 rounded-full bg-[#e5ddc8] px-4 py-2.5">
                            <input
                                type="text"
                                placeholder="Buscar.."
                                className="flex-1 border-none bg-transparent text-base text-[#4a2f1c] outline-none"
                            />
                        </article>
                    </section>



                    {/* Guias la cartica */}
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {guias.map((guia) => (
                            <article key={guia.titulo} className="flex flex-col rounded-xl border border-[#e5ddc8] bg-white p-5">
                                <section className="mb-3.5 flex items-center justify-between">
                                    <article className="rounded-full bg-[#a26443] px-2.5 py-1 text-[11px] font-semibold text-white">
                                        documento
                                    </article>
                                </section>
                                <h3 className="mb-2 text-[25px] font-bold text-[#6b3a1f]">{guia.titulo}</h3>
                                <p className="mb-4 flex-1 text-lg leading-relaxed text-[#4a2f1c]">{guia.descripción}</p>
                                <button className="self-start rounded-md bg-[#6b7c2b] px-3.5 py-2.5 font-semibold text-white hover:bg-[#5c6a24]">
                                    Descargar documento
                                </button>
                            </article>
                        ))}
                    </section>

                </main>


            </section>

        </PlantillaPrincipal>
    )
}

export default Guias;