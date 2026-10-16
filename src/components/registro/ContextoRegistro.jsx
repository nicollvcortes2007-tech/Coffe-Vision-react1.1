import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Wallet, Receipt, Sprout, ScanSearch } from "lucide-react";
import Hoja from "@/components/ui/Hoja";
import { Broca, Roya, Floracion, Canasto, Pergamino } from "@/components/marca/Pictogramas";

const FormLabor = lazy(() => import("./FormLabor"));
const FormFloracion = lazy(() => import("./FormFloracion"));
const FormMuestreoBroca = lazy(() => import("./FormMuestreoBroca"));
const FormMuestreoRoya = lazy(() => import("./FormMuestreoRoya"));
const FormRecoleccion = lazy(() => import("./FormRecoleccion"));
const FormVenta = lazy(() => import("./FormVenta"));
const FormAplicacion = lazy(() => import("./FormAplicacion"));
const FormGasto = lazy(() => import("./FormGasto"));

export const TIPOS_REGISTRO = {
  recoleccion: { titulo: "Recolección", descripcion: "Kilos de cereza por recolector.", Icono: Canasto, Form: FormRecoleccion },
  "muestreo-broca": { titulo: "Muestreo de broca", descripcion: "30 árboles, la rama más cargada de cada uno.", Icono: Broca, Form: FormMuestreoBroca },
  "muestreo-roya": { titulo: "Muestreo de roya", descripcion: "10 árboles × 10 ramas.", Icono: Roya, Form: FormMuestreoRoya },
  floracion: { titulo: "Floración", descripcion: "La fecha que pone en marcha el calendario.", Icono: Floracion, Form: FormFloracion },
  labor: { titulo: "Labor", descripcion: "Abonada, plateo, repase, zoca… y jornales.", Icono: ClipboardList, Form: FormLabor },
  aplicacion: { titulo: "Aplicación", descripcion: "Abono o producto, con registro ICA y carencia.", Icono: Sprout, Form: FormAplicacion },
  venta: { titulo: "Venta de pergamino", descripcion: "Kilos, factor de rendimiento y pago.", Icono: Pergamino, Form: FormVenta },
  gasto: { titulo: "Otro gasto", descripcion: "Transporte, beneficio, análisis de suelo…", Icono: Receipt, Form: FormGasto },
};

const ContextoRegistro = createContext(null);

export function ProveedorRegistro({ children }) {
  const [estado, setEstado] = useState({ abierto: false, tipo: null, opciones: {} });
  const abrir = useCallback((tipo = null, opciones = {}) => setEstado({ abierto: true, tipo, opciones }), []);
  const cerrar = useCallback(() => setEstado((actual) => ({ ...actual, abierto: false })), []);
  const valor = useMemo(() => ({ abrir, cerrar }), [abrir, cerrar]);
  const definicion = estado.tipo ? TIPOS_REGISTRO[estado.tipo] : null;

  return (
    <ContextoRegistro.Provider value={valor}>
      {children}
      <Hoja
        abierta={estado.abierto}
        alCerrar={cerrar}
        titulo={definicion ? definicion.titulo : "¿Qué vas a registrar?"}
        descripcion={definicion ? definicion.descripcion : "Se guarda en este celular, aunque no haya señal."}
      >
        {definicion ? (
          <Suspense fallback={<p className="py-8 text-center text-tierra-media">Abriendo…</p>}>
            <definicion.Form opciones={estado.opciones} alTerminar={cerrar} />
          </Suspense>
        ) : (
          <div className="grid gap-4">
            <ul className="grid grid-cols-2 gap-2.5">
              {Object.entries(TIPOS_REGISTRO).map(([tipo, { titulo, Icono }]) => (
                <li key={tipo}>
                  <button
                    type="button"
                    onClick={() => setEstado({ abierto: true, tipo, opciones: {} })}
                    className="flex min-h-[5.5rem] w-full flex-col items-start justify-between gap-2 rounded-2xl border border-linea bg-pergamino p-3.5 text-left font-bold transition-colors hover:border-tierra active:bg-crema"
                  >
                    <Icono className="h-7 w-7 text-cereza" aria-hidden="true" />
                    <span className="leading-tight">{titulo}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Link to="/finca/diagnostico" onClick={cerrar} className="boton-secundario w-full">
              <ScanSearch className="h-5 w-5" aria-hidden="true" /> Diagnóstico por foto
            </Link>
            <Link to="/finca/costos" onClick={cerrar} className="boton-fantasma w-full">
              <Wallet className="h-5 w-5" aria-hidden="true" /> Ver los costos
            </Link>
          </div>
        )}
      </Hoja>
    </ContextoRegistro.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegistro() {
  const contexto = useContext(ContextoRegistro);
  if (!contexto) return { abrir: () => {}, cerrar: () => {} };
  return contexto;
}
