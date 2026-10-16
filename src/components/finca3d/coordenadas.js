/* Coordenadas como las lee un GPS de campo: 2°22′13″ N · 76°43′12″ O */
export function gms(lat, lon) {
  const parte = (valor, positivo, negativo) => {
    const abs = Math.abs(valor);
    let g = Math.floor(abs);
    let m = Math.floor((abs - g) * 60);
    let s = Math.round(((abs - g) * 60 - m) * 60);
    if (s === 60) {
      s = 0;
      m += 1;
    }
    if (m === 60) {
      m = 0;
      g += 1;
    }
    return `${g}°${String(m).padStart(2, "0")}′${String(s).padStart(2, "0")}″ ${valor >= 0 ? positivo : negativo}`;
  };
  return `${parte(lat, "N", "S")} · ${parte(lon, "E", "O")}`;
}
