import { useEffect, useRef } from "react";
import { cargarRelieveHorneado } from "./terreno.js";
import { dibujarRelieve2D } from "./relieve2d.js";

const PALETA = { bajo: "#1C1D19", alto: "#A9ABA2", linea: "#E9EAE4", estados: { ok: "#E9EAE4", vigilar: "#FFC21A", actuar: "#FF3B2F", sinDatos: "#9A9C94" } };

/* El relieve horneado visto desde arriba, en 2D: sombreado, curvas y lotes. Sin WebGL. */
export default function RelieveFijo({ url, lat, lon, extension, lotes = [], className = "" }) {
  const lienzo = useRef(null);
  useEffect(() => {
    const control = new AbortController();
    cargarRelieveHorneado({ url, lat, lon, extension, senal: control.signal })
      .then((relieve) => {
        const nodo = lienzo.current;
        if (!nodo) return;
        nodo.width = 720;
        nodo.height = 720;
        dibujarRelieve2D(nodo, relieve, lotes, PALETA);
      })
      .catch(() => {});
    return () => control.abort();
  }, [url, lat, lon, extension, lotes]);
  return <canvas ref={lienzo} className={className} aria-hidden="true" />;
}
