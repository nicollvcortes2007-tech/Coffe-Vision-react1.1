import Finca3D from "@/components/finca3d/Finca3D";

/* La ladera en 3D: el relieve real de la finca con sus lotes (ver finca3d/). */
export default function LaderaViva({ finca, lotes, alSeleccionar, respaldo, className = "aspect-[4/3] w-full rounded-md bg-basalto", ...resto }) {
  return <Finca3D finca={finca} lotes={lotes} alSeleccionar={alSeleccionar} respaldo={respaldo} className={className} {...resto} />;
}
