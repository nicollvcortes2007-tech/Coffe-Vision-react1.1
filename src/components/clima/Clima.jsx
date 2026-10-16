import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudLightning, Droplets, RefreshCw, WifiOff } from "lucide-react";
import { describirTiempo } from "@/datos/clima";
import { fDia, hoyISO, num } from "@/utilidades/formato";

const ICONOS = { sol: Sun, solNube: CloudSun, nube: Cloud, niebla: CloudFog, llovizna: CloudDrizzle, lluvia: CloudRain, tormenta: CloudLightning };

export function IconoTiempo({ codigo, className = "h-6 w-6" }) {
  const Icono = ICONOS[describirTiempo(codigo).icono] ?? Cloud;
  return <Icono className={className} aria-hidden="true" />;
}

export function Atribucion({ datos, alActualizar }) {
  if (!datos) return null;
  const hora = new Date(datos.guardado).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-grafito">
      {datos.origen === "sin-conexion" && (
        <span className="inline-flex items-center gap-1 font-bold text-amarillo-texto">
          <WifiOff className="h-4 w-4" aria-hidden="true" /> Sin señal: último pronóstico guardado
        </span>
      )}
      <span>Actualizado el {hora}.</span>
      <span>
        Datos del clima:{" "}
        <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline">
          Open-Meteo.com
        </a>{" "}
        (CC BY 4.0)
      </span>
      {alActualizar && (
        <button type="button" onClick={alActualizar} className="inline-flex min-h-10 items-center gap-1 font-bold text-tinta underline-offset-2 hover:underline">
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Actualizar
        </button>
      )}
    </p>
  );
}

/* Hoy y los próximos días, en una franja que se desplaza con el dedo. */
export function FranjaDias({ dias }) {
  const hoy = hoyISO();
  const proximos = dias.filter((dia) => dia.fecha >= hoy).slice(0, 7);
  return (
    <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1" aria-label="Pronóstico de los próximos días">
      {proximos.map((dia) => (
        <li key={dia.fecha} className={`min-w-[5.6rem] snap-start rounded-lg border px-3 py-3 text-center ${dia.fecha === hoy ? "border-tinta bg-cal" : "border-linea bg-lamina"}`}>
          <p className="text-sm font-bold capitalize">{dia.fecha === hoy ? "Hoy" : fDia(dia.fecha)}</p>
          <IconoTiempo codigo={dia.codigo} className="mx-auto my-1.5 h-7 w-7 text-grafito" />
          <p className="cifra text-[0.95rem] font-bold">
            {Math.round(dia.max)}° <span className="font-normal text-grafito">{Math.round(dia.min)}°</span>
          </p>
          <p className={`cifra mt-1 inline-flex items-center gap-0.5 text-sm ${dia.lluvia >= 10 ? "font-bold text-ceniza-honda" : "text-grafito"}`}>
            <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
            {num(dia.lluvia)} mm
          </p>
          <span className="sr-only">{describirTiempo(dia.codigo).texto}, probabilidad de lluvia {dia.probLluvia} %</span>
        </li>
      ))}
    </ul>
  );
}
