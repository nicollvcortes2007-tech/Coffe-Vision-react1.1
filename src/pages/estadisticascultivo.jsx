import React from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";
import "@/estilos/estadisticascultivo.css";

const Estadisticas = () => {

    const datosLotes = [
        {
            lote: "Lote El Paraíso",
            variedad: "Castillo",
            edad: "3 años",
            rendimiento: "Óptimo",
            estado: "status-good"
        },
        {
            lote: "Lote La Esperanza",
            variedad: "Caturra",
            edad: "5 años",
            rendimiento: "Mantenimiento",
            estado: "status-alert"
        },
        {
            lote: "Lote Central",
            variedad: "Cenicafé 1",
            edad: "1 año",
            rendimiento: "Crecimiento",
            estado: "status-good"
        }
    ];

    const rendimiento = [
        { mes: "Mes 1", valor: 40 },
        { mes: "Mes 2", valor: 65 },
        { mes: "Mes 3", valor: 85 },
        { mes: "Mes 4", valor: 50 }
    ];

    return (
        <PlantillaPrincipal>

            <Topbar />

            <main className="main-content">

                <header>
                    <section className="content-header">

                        <section className="header-titles">
                            <h1>ESTADÍSTICAS DE CULTIVO</h1>
                            <p className="subtitle">
                                Panel de estadísticas
                            </p>
                        </section>

                        <a
                            href="/Resultados_Lotes_Cosecha_CoffeeVision_Corregido.xlsx"
                            download
                            className="report-download"
                        >
                            Descargar reporte
                        </a>

                    </section>
                </header>


                {/* TARJETAS DE RESUMEN */}

                <section className="summary-cards">

                    <article className="card">

                        <h3>Total Hectáreas</h3>

                        <p className="metric">
                            24.5 ha
                        </p>

                        <span className="trend positive">
                            ↑ 1.2% este mes
                        </span>

                    </article>


                    <article className="card">

                        <h3>Producción Estimada</h3>

                        <p className="metric">
                            1,250 Cargas
                        </p>

                        <span className="trend">
                            Variedad Castillo / Cenicafé
                        </span>

                    </article>


                    <article className="card">

                        <h3>Estado Sanitario</h3>

                        <p className="metric text-green">
                            94% Sano
                        </p>

                        <span className="trend negative">
                            6% Alerta de Roya
                        </span>

                    </article>

                </section>


                {/* DASHBOARD */}

                <section className="dashboard-grid">


                    {/* GRÁFICA */}

                    <article className="chart-container">

                        <h3>
                            Rendimiento de Cosecha
                            (Últimos meses)
                        </h3>

                        <figure className="mock-chart">

                            {rendimiento.map((dato, index) => (

                                <section
                                    key={index}
                                    className="barra"
                                >

                                    <progress
                                        value={dato.valor}
                                        max="100"
                                    ></progress>

                                    <span>
                                        {dato.mes}
                                    </span>

                                </section>

                            ))}

                        </figure>

                    </article>


                    {/* TABLA DE LOTES */}

                    <article className="table-container">

                        <h3>
                            Estado por Lote de Cultivo
                        </h3>

                        <table>

                            <thead>

                                <tr>
                                    <th>Lote</th>
                                    <th>Variedad</th>
                                    <th>Edad</th>
                                    <th>Rendimiento</th>
                                </tr>

                            </thead>


                            <tbody>

                                {datosLotes.map((lote, index) => (

                                    <tr key={index}>

                                        <td>
                                            {lote.lote}
                                        </td>

                                        <td>
                                            {lote.variedad}
                                        </td>

                                        <td>
                                            {lote.edad}
                                        </td>

                                        <td>

                                            <mark
                                                className={lote.estado}
                                            >
                                                {lote.rendimiento}
                                            </mark>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </article>

                </section>

            </main>

        </PlantillaPrincipal>
    );
};

export default Estadisticas;