import { CLASES, UMBRAL_ACEPTAR, UMBRAL_CONFIADO } from "./modelo.js";

/*
  Política de decisión del autor (predict.py): se acepta la clase ganadora solo si
  no es «unsupported», supera su umbral calibrado y la foto pasó nitidez y luz.
  Estado: «confiado» si además supera el umbral de confianza; si no se acepta,
  «incierto» (no se adivina: se pide otra foto o consultar al extensionista).
*/
export function interpretar(probabilidades, calidad) {
  const lista = Array.from(probabilidades, (p, indice) => ({ ...CLASES[indice], indice, probabilidad: p }));
  const ordenadas = [...lista].sort((a, b) => b.probabilidad - a.probabilidad);
  const ganadora = ordenadas[0];
  const aceptada =
    !ganadora.rechazo &&
    !ganadora.desactivada &&
    ganadora.probabilidad >= UMBRAL_ACEPTAR[ganadora.indice] &&
    calidad.aceptable;
  const estado = !aceptada ? "incierto" : ganadora.probabilidad >= UMBRAL_CONFIADO[ganadora.indice] ? "confiado" : "posible";

  let motivo = null;
  if (!calidad.nitida) motivo = "La foto está movida o desenfocada.";
  else if (calidad.luz === "oscura") motivo = "La foto está muy oscura.";
  else if (calidad.luz === "quemada") motivo = "La foto tiene demasiada luz.";
  else if (ganadora.rechazo) motivo = "No parece una hoja de café, o la hoja no llena el cuadro.";
  else if (!aceptada) motivo = "El modelo no está lo bastante seguro.";

  return {
    estado,
    aceptada,
    ganadora,
    top: ordenadas.filter((clase) => !clase.desactivada).slice(0, 3),
    motivo,
    calidad,
  };
}

/*
  Varias hojas del mismo lote: se promedian las probabilidades de las fotos que
  pasaron la calidad (en campo, mirar varias hojas sube el acierto; Mrisho et al.,
  2020, app Nuru). Si ninguna pasó, el resultado es incierto.
*/
export function combinar(resultados) {
  const validas = resultados.filter((resultado) => resultado.calidad.aceptable);
  if (!validas.length) return null;
  const n = validas[0].probabilidades.length;
  const promedio = new Float32Array(n);
  for (const resultado of validas) {
    for (let i = 0; i < n; i += 1) promedio[i] += resultado.probabilidades[i] / validas.length;
  }
  return interpretar(promedio, { aceptable: true, nitida: true, luz: "buena" });
}
