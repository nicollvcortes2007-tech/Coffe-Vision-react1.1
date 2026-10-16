import { normalizar } from "./formato.js";

/*
  Búsqueda local en las guías, sin dependencias: sin tildes, por prefijo y con más
  peso en el título y las palabras clave. Funciona sin conexión.
*/
const VACIAS = new Set(["el", "la", "los", "las", "de", "del", "en", "y", "o", "a", "un", "una", "que", "como", "cómo", "para", "por", "con", "mi", "mis", "es", "se", "lo", "al", "cuando", "cuanto", "cual", "hay", "tengo", "hago", "debo", "me"]);

export function terminos(texto) {
  return normalizar(texto)
    .split(/[^a-z0-9ñ]+/)
    .filter((t) => t.length > 1 && !VACIAS.has(t));
}

function indice(guia) {
  return {
    titulo: terminos(guia.titulo),
    palabras: guia.palabras.flatMap(terminos),
    texto: terminos([guia.resumen, ...guia.secciones.flatMap((s) => [s.titulo, ...s.puntos])].join(" ")),
  };
}

const cache = new WeakMap();

export function buscarGuias(guias, consulta) {
  const buscados = terminos(consulta);
  if (!buscados.length) return [];
  return guias
    .map((guia) => {
      if (!cache.has(guia)) cache.set(guia, indice(guia));
      const ind = cache.get(guia);
      let puntaje = 0;
      for (const termino of buscados) {
        const coincide = (lista) => lista.some((palabra) => palabra.startsWith(termino) || (termino.length > 4 && palabra.startsWith(termino.slice(0, -1))));
        if (coincide(ind.titulo)) puntaje += 5;
        if (coincide(ind.palabras)) puntaje += 3;
        if (coincide(ind.texto)) puntaje += 1;
      }
      return { guia, puntaje };
    })
    .filter((r) => r.puntaje > 0)
    .sort((a, b) => b.puntaje - a.puntaje);
}

/* El párrafo de la guía que mejor responde a la consulta. */
export function mejorPunto(guia, consulta) {
  const buscados = terminos(consulta);
  let mejor = null;
  for (const seccion of guia.secciones) {
    for (const punto of seccion.puntos) {
      const palabras = terminos(punto);
      const puntaje = buscados.filter((t) => palabras.some((p) => p.startsWith(t))).length;
      if (!mejor || puntaje > mejor.puntaje) mejor = { puntaje, punto, seccion: seccion.titulo };
    }
  }
  return mejor;
}
