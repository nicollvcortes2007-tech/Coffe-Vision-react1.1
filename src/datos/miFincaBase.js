/*
  Datos de una finca: la finca, sus lotes y, por colección, solo los registros de
  esos lotes. Lo usan las vistas del caficultor y el panorama del administrador.
*/
export function filtrarFinca(datos, fincaId) {
  const finca = datos.fincas.find((item) => item.id === fincaId) ?? null;
  const lotes = datos.lotes.filter((lote) => lote.fincaId === fincaId && !lote.archivado);
  const idsLotes = new Set(datos.lotes.filter((lote) => lote.fincaId === fincaId).map((lote) => lote.id));
  const deLotes = (lista) => lista.filter((item) => idsLotes.has(item.loteId));
  const deFinca = (lista) => lista.filter((item) => item.fincaId === fincaId || idsLotes.has(item.loteId));
  return {
    finca,
    lotes,
    labores: deLotes(datos.labores),
    floraciones: deLotes(datos.floraciones),
    muestreos: deLotes(datos.muestreos),
    recolecciones: deLotes(datos.recolecciones),
    aplicaciones: deLotes(datos.aplicaciones),
    diagnosticos: deFinca(datos.diagnosticos),
    ventas: deFinca(datos.ventas),
    gastos: deFinca(datos.gastos),
    trabajadores: datos.trabajadores.filter((item) => item.fincaId === fincaId),
    precios: datos.precios,
  };
}
