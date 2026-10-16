import { Link } from "react-router-dom";
import { Thermometer, Droplets, CloudRain, Wind } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Cifra from "@/components/ui/Cifra";
import Barras from "@/components/ui/Barras";
import AvisoItem from "@/components/finca/AvisoItem";
import { FranjaDias, Atribucion, IconoTiempo } from "@/components/clima/Clima";
import { useFinca } from "@/datos/useFinca";
import { describirTiempo } from "@/datos/clima";
import { FUENTES } from "@/datos/agronomia";
import { num, fCorta, hoyISO, ent } from "@/utilidades/formato";

export default function Clima() {
  const { finca, avisos, clima } = useFinca();
  const avisosClima = avisos.filter((aviso) => aviso.tipo === "clima");
  const dias = clima.datos?.clima?.dias ?? [];
  const hoy = hoyISO();
  const pasados = dias.filter((d) => d.fecha < hoy).slice(-30);
  const lluvia30 = pasados.reduce((s, d) => s + d.lluvia, 0);
  const et030 = pasados.reduce((s, d) => s + (d.et0 ?? 0), 0);
  const actual = clima.datos?.clima?.actual;

  if (!Number.isFinite(finca?.lat)) {
    return (
      <>
        <EncabezadoPagina titulo="Clima" />
        <Vacio titulo="La finca no está ubicada" texto="Ubícala con el GPS desde «Mi cuenta» para ver el pronóstico." accion={<Link to="/finca/perfil" className="boton-primario">Ir a Mi cuenta</Link>} />
      </>
    );
  }

  return (
    <>
      <EncabezadoPagina rotulo={finca.nombre} titulo="Clima" bajada={`Pronóstico para las coordenadas de la finca${clima.datos?.clima?.elevacion ? ` (celda a ${ent(clima.datos.clima.elevacion)} m)` : ""}.`} />
      {!clima.datos ? (
        <p className="text-tierra-media">{clima.cargando ? "Cargando el pronóstico…" : `No se pudo cargar el clima: ${clima.error}`}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-6">
            <Seccion titulo="Ahora y los próximos 7 días">
              {actual && (
                <div className="mb-5 flex flex-wrap items-center gap-x-8 gap-y-3">
                  <p className="flex items-center gap-3">
                    <IconoTiempo codigo={actual.codigo} className="h-12 w-12 text-tierra-media" />
                    <span>
                      <span className="cifra titular block text-5xl">{Math.round(actual.temperatura)}°</span>
                      <span className="text-tierra-media">{describirTiempo(actual.codigo).texto}</span>
                    </span>
                  </p>
                  <ul className="grid gap-1 text-[0.95rem]">
                    <li className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-tierra-media" aria-hidden="true" /> Humedad {actual.humedad} %
                    </li>
                    <li className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-tierra-media" aria-hidden="true" /> Lluvia ahora {num(actual.lluvia)} mm
                    </li>
                  </ul>
                </div>
              )}
              <FranjaDias dias={dias} />
              <Atribucion datos={clima.datos} alActualizar={clima.actualizar} />
            </Seccion>
            <Seccion titulo="Lluvia de los últimos 30 días" bajada="Milímetros por día. Más de 10 mm después de un verano suele traer floración a los 7 a 10 días.">
              <Barras titulo="Lluvia diaria de los últimos 30 días" datos={pasados.map((d) => ({ etiqueta: fCorta(d.fecha).replace(".", ""), valor: Math.round(d.lluvia) }))} formato={(v) => `${v}`} umbral={10} etiquetaUmbral="10 mm" color="#4F6461" colorSobre="#2E5B3A" alto={120} />
              <a href={FUENTES.floracionLluvia.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-tierra-media underline">
                Fuente: {FUENTES.floracionLluvia.texto}
              </a>
            </Seccion>
          </div>
          <div className="grid content-start gap-6">
            <div className="papel grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-1 xl:grid-cols-2">
              <Cifra rotulo="Lluvia en 30 días" valor={ent(lluvia30)} unidad="mm" detalle={`${pasados.filter((d) => d.lluvia >= 1).length} días con lluvia`} />
              <Cifra
                rotulo="Balance de agua"
                valor={ent(lluvia30 - et030)}
                unidad="mm"
                tono={lluvia30 - et030 < 0 ? "cereza" : "hoja"}
                detalle={`Lluvia menos evaporación (${ent(et030)} mm)`}
                fuente="Lluvia − evapotranspiración de referencia (ET0 FAO) de Open-Meteo. Es una aproximación simple, no el índice de déficit hídrico de Cenicafé."
              />
              <Cifra rotulo="Temperatura media" valor={num(pasados.reduce((s, d) => s + (d.max + d.min) / 2, 0) / Math.max(pasados.length, 1))} unidad="°C" detalle="Óptimo para el café: 18 a 22 °C" fuente={FUENTES.clima.texto} />
              <Cifra rotulo="Humedad media" valor={ent(pasados.reduce((s, d) => s + (d.humedad ?? 0), 0) / Math.max(pasados.length, 1))} unidad="%" detalle="Beauveria funciona mejor con más de 70 %" fuente={FUENTES.broca.texto} />
            </div>
            {avisosClima.length > 0 && (
              <section aria-label="Avisos del clima">
                <ul className="grid gap-3">
                  {avisosClima.map((aviso) => (
                    <AvisoItem key={aviso.id} aviso={aviso} />
                  ))}
                </ul>
              </section>
            )}
            <Seccion titulo="Para la recomendación oficial">
              <p className="text-[0.95rem] text-tierra-media">Cenicafé publica boletines agroclimáticos, balance hídrico y vuelos de broca por zona en su Plataforma Agroclimática.</p>
              <a href="https://agroclima.cenicafe.org/" target="_blank" rel="noreferrer" className="boton-secundario mt-3">
                <Wind className="h-5 w-5" aria-hidden="true" /> Abrir Agroclima de Cenicafé
              </a>
              <p className="mt-3 flex items-center gap-2 text-sm text-tierra-media">
                <Thermometer className="h-4 w-4" aria-hidden="true" /> Las coordenadas salen redondeadas a ~1 km y sin tu nombre.
              </p>
            </Seccion>
          </div>
        </div>
      )}
    </>
  );
}
