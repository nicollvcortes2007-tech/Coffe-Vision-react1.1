import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  CanvasTexture,
  Vector3,
  Vector2,
  Raycaster,
  RingGeometry,
  MeshBasicMaterial,
  CylinderGeometry,
  SphereGeometry,
  Group,
  LinearFilter,
  SRGBColorSpace,
  DoubleSide,
  GLSL3,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { dentro } from "./terreno.js";

/*
  Escena de la finca en 3D: el relieve real (teselas de elevación), curvas de nivel
  calculadas en el shader, los lotes pintados sobre el terreno según su estado y un
  pin en la casa de la finca. Se renderiza solo cuando algo cambia o se mueve.
*/

const VERTICE = /* glsl */ `
  uniform float uMin;
  uniform float uExageracion;
  uniform float uFormacion;
  out float vAltura;
  out vec3 vNormal;
  out vec2 vUv;
  out vec3 vPos;
  void main() {
    vUv = uv;
    vAltura = position.y / uExageracion + uMin;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec3 p = position;
    p.y *= uFormacion;
    vec4 mundo = modelMatrix * vec4(p, 1.0);
    vPos = mundo.xyz;
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

const FRAGMENTO = /* glsl */ `
  precision highp float;
  uniform float uMin;
  uniform float uMax;
  uniform vec3 uBajo;
  uniform vec3 uAlto;
  uniform vec3 uLinea;
  uniform vec3 uLuz;
  uniform float uIntervalo;
  uniform float uBarrido;
  uniform vec3 uBarridoColor;
  uniform sampler2D uLotes;
  uniform sampler2D uSatelite;
  uniform float uMezcla;
  uniform float uRadio;
  uniform vec3 uBorde;
  uniform vec3 uNiebla;
  uniform float uNieblaValle;
  in float vAltura;
  in vec3 vNormal;
  in vec2 vUv;
  in vec3 vPos;
  out vec4 color;

  float linea(float valor, float intervalo, float grosor) {
    float f = valor / intervalo;
    float d = abs(fract(f - 0.5) - 0.5) / fwidth(f);
    return 1.0 - smoothstep(0.0, grosor, d);
  }
  float azar(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float ruido(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), u.x), mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    float t = clamp((vAltura - uMin) / max(uMax - uMin, 1.0), 0.0, 1.0);
    vec3 n = normalize(vNormal);
    // Luz rasante: el contraste entre laderas al sol y a la sombra es el dibujo.
    float luz = clamp(dot(n, normalize(uLuz)), 0.0, 1.0);
    vec3 tinte = mix(vec3(0.84, 0.88, 0.96), vec3(1.1, 1.0, 0.86), luz);
    vec3 base = mix(uBajo, uAlto, smoothstep(0.0, 1.0, t)) * (0.32 + 1.05 * pow(luz, 1.2)) * tinte;
    vec3 sat = texture(uSatelite, vUv).rgb * (0.62 + 0.55 * luz);
    base = mix(base, sat, uMezcla);

    // Curvas de nivel como dato: cada uIntervalo m y una índice cada 5 intervalos.
    float menor = linea(vAltura, uIntervalo, 1.0);
    float mayor = linea(vAltura, uIntervalo * 5.0, 1.4);
    base = mix(base, uLinea, menor * mix(0.16, 0.22, uMezcla));
    base = mix(base, uLinea, mayor * mix(0.42, 0.5, uMezcla));

    // Niebla del Macizo asentada en los valles, con jirones (ruido estático).
    float valle = 1.0 - smoothstep(0.0, 0.42, t);
    float jirones = 0.55 + 0.45 * ruido(vPos.xz / 140.0) * ruido(vPos.xz / 47.0 + 3.1);
    base = mix(base, uNiebla, valle * jirones * uNieblaValle * (1.0 - uMezcla * 0.6));

    vec4 lote = texture(uLotes, vUv);
    base = mix(base, lote.rgb * (0.78 + 0.3 * luz), lote.a);

    // Barrido de «escaneo» GPS (solo en la entrada).
    float banda = 1.0 - smoothstep(0.0, 22.0, abs(vPos.x - uBarrido));
    base += uBarridoColor * banda * 0.5;

    // Lente: el terreno se recorta en un círculo con un aro fino, como un visor.
    float r = length(vPos.xz);
    float alfa = 1.0 - smoothstep(uRadio - 4.0, uRadio, r);
    float aro = (1.0 - smoothstep(0.0, 2.2, abs(r - (uRadio - 12.0)))) * alfa;
    base = mix(base, uBorde, aro * 0.75);
    if (alfa < 0.01) discard;
    color = vec4(base, alfa);
  }
`;


const PARED_VERTICE = /* glsl */ `
  uniform float uFormacion;
  out float vProfundidad;
  out vec3 vNormalP;
  void main() {
    vProfundidad = uv.y;
    vNormalP = normalize(mat3(modelMatrix) * normal);
    vec3 p = position;
    if (p.y > 0.0) p.y *= uFormacion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const PARED_FRAGMENTO = /* glsl */ `
  precision highp float;
  uniform vec3 uCapa1;
  uniform vec3 uCapa2;
  uniform vec3 uCapa3;
  uniform vec3 uCapa4;
  uniform vec3 uLuz;
  in float vProfundidad;
  in vec3 vNormalP;
  out vec4 color;
  void main() {
    // Estratos de un andisol: horizonte A oscuro, la capa de ceniza volcánica,
    // el horizonte B rojizo y la roca.
    float d = vProfundidad;
    vec3 c = mix(uCapa1, uCapa2, smoothstep(0.1, 0.13, d));
    c = mix(c, uCapa3, smoothstep(0.24, 0.28, d));
    c = mix(c, uCapa4, smoothstep(0.62, 0.68, d));
    float vetas = 0.9 + 0.1 * sin(d * 120.0 + sin(d * 31.0) * 2.0);
    float luz = 0.45 + 0.55 * clamp(dot(normalize(vNormalP), normalize(uLuz)), 0.0, 1.0);
    color = vec4(c * vetas * luz, 1.0);
  }
`;

/* Pared cilíndrica bajo el borde del lente: la «muestra» de tierra de la finca. */
function crearPared({ relieve, exageracion, radio, profundidad, color, luz }) {
  const segmentos = 220;
  const posiciones = [];
  const uvs = [];
  const indices = [];
  for (let i = 0; i <= segmentos; i += 1) {
    const a = (i / segmentos) * Math.PI * 2;
    const x = Math.cos(a) * radio;
    const z = Math.sin(a) * radio;
    const { lon, lat } = relieve.aLonLat(x, z);
    const arriba = (relieve.alturaEn(lon, lat) - relieve.minimo) * exageracion;
    posiciones.push(x, arriba, z, x, -profundidad, z);
    uvs.push(i / segmentos, 0, i / segmentos, 1);
    if (i < segmentos) {
      const b = i * 2;
      indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
  }
  const geometria = new BufferGeometry();
  geometria.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
  geometria.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometria.setIndex(indices);
  geometria.computeVertexNormals();
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: PARED_VERTICE,
    fragmentShader: PARED_FRAGMENTO,
    uniforms: {
      uCapa1: { value: color.capa1 },
      uCapa2: { value: color.capa2 },
      uCapa3: { value: color.capa3 },
      uCapa4: { value: color.capa4 },
      uLuz: { value: luz },
      uFormacion: { value: 1 },
    },
    side: DoubleSide,
  });
  return new Mesh(geometria, material);
}

const COLORES_ESTADO = {
  ok: "#E9EAE4",
  vigilar: "#FFC21A",
  actuar: "#FF3B2F",
  sinDatos: "#9A9C94",
};

/* Dirección de la luz: acimut en radianes, sol bajo (rasante). */
function luzDesde(angulo) {
  return new Vector3(Math.cos(angulo) * 0.86, 0.5, Math.sin(angulo) * 0.86);
}

function rayas(ctx, color) {
  const lienzo = document.createElement("canvas");
  lienzo.width = 14;
  lienzo.height = 14;
  const c = lienzo.getContext("2d");
  c.fillStyle = color;
  c.fillRect(0, 0, 14, 14);
  c.strokeStyle = "rgba(14,15,12,0.55)";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(-2, 16);
  c.lineTo(16, -2);
  c.moveTo(-9, 9);
  c.lineTo(9, -9);
  c.moveTo(5, 23);
  c.lineTo(23, 5);
  c.stroke();
  return ctx.createPattern(lienzo, "repeat");
}

function dibujarLotes({ lienzo, relieve, lotes, colores, seleccionado }) {
  const ctx = lienzo.getContext("2d");
  const lado = lienzo.width;
  ctx.clearRect(0, 0, lado, lado);
  const { limites } = relieve;
  const aPx = ([lon, lat]) => [((lon - limites.oeste) / (limites.este - limites.oeste)) * lado, ((limites.norte - lat) / (limites.norte - limites.sur)) * lado];
  const metrosPorPx = relieve.extension / lado;
  ctx.lineJoin = "round";
  for (const lote of lotes) {
    const geo = lote.geometria;
    if (!geo) continue;
    const color = lote.color ?? colores[lote.estado] ?? colores.sinDatos;
    const activo = lote.id === seleccionado;
    ctx.beginPath();
    if (geo.tipo === "poligono") {
      geo.puntos.forEach((p, i) => {
        const [x, y] = aPx(p);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.closePath();
    } else {
      const [x, y] = aPx(geo.punto);
      const radio = Math.max(10, Math.sqrt(((lote.areaHa || 0.5) * 10000) / Math.PI) / metrosPorPx);
      ctx.arc(x, y, radio, 0, Math.PI * 2);
    }
    ctx.globalAlpha = activo ? 1 : 0.9;
    ctx.fillStyle = lote.rayado ?? lote.estado === "vigilar" ? rayas(ctx, color) : color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.setLineDash(lote.estado === "sinDatos" && !lote.color ? [10, 8] : []);
    ctx.lineWidth = activo ? 9 : 3;
    ctx.strokeStyle = activo ? "#FFFFFF" : "rgba(14,15,12,0.7)";
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function crearEscena({ lienzo, relieve, lotes: lotesIniciales, colores = {}, exageracion: exageracionPedida, alSeleccionar, alMover, alApuntar, alPerderContexto, reducirMovimiento = false, entrada = true, girar = false, nieblaValle = 0.55, angulo = 0.62, zoomRueda = true, distancia = 1 }) {
  let lotes = lotesIniciales;
  const paleta = {
    bajo: "#1C1D19",
    alto: "#A9ABA2",
    linea: "#E9EAE4",
    barrido: "#FFC21A",
    niebla: "#C9CBC4",
    borde: "#E9EAE4",
    ...colores,
    estados: { ...COLORES_ESTADO, ...(colores.estados ?? {}) },
  };
  // El relieve se exagera para que el desnivel ocupe ~20 % del lado del modelo.
  const exageracion = exageracionPedida ?? Math.min(3, Math.max(1.2, (relieve.extension * 0.12) / Math.max(relieve.maximo - relieve.minimo, 20)));
  const renderer = new WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;

  const escena = new Scene();
  const camara = new PerspectiveCamera(38, 1, 5, 20000);
  const ext = relieve.extension;

  // Terreno
  const geometria = new PlaneGeometry(ext, ext, relieve.lado - 1, relieve.lado - 1);
  geometria.rotateX(-Math.PI / 2);
  const posiciones = geometria.attributes.position;
  for (let i = 0; i < posiciones.count; i += 1) posiciones.setY(i, (relieve.alturas[i] - relieve.minimo) * exageracion);
  geometria.computeVertexNormals();

  const lienzoLotes = document.createElement("canvas");
  lienzoLotes.width = 1024;
  lienzoLotes.height = 1024;
  let seleccionado = null;
  dibujarLotes({ lienzo: lienzoLotes, relieve, lotes, colores: paleta.estados, seleccionado });
  const texturaLotes = new CanvasTexture(lienzoLotes);
  texturaLotes.minFilter = LinearFilter;
  texturaLotes.colorSpace = "";
  texturaLotes.flipY = true;

  // El shader escribe el color tal cual (sin conversión de salida): se pasan los
  // componentes sRGB del hex directamente.
  const color = (hex) => {
    const limpio = hex.replace("#", "");
    return new Vector3(parseInt(limpio.slice(0, 2), 16) / 255, parseInt(limpio.slice(2, 4), 16) / 255, parseInt(limpio.slice(4, 6), 16) / 255);
  };
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    uniforms: {
      uMin: { value: relieve.minimo },
      uMax: { value: relieve.maximo },
      uExageracion: { value: exageracion },
      uFormacion: { value: entrada && !reducirMovimiento ? 0 : 1 },
      uBajo: { value: color(paleta.bajo) },
      uAlto: { value: color(paleta.alto) },
      uLinea: { value: color(paleta.linea) },
      uLuz: { value: luzDesde(angulo) },
      uIntervalo: { value: 10 },
      uNiebla: { value: color(paleta.niebla) },
      uNieblaValle: { value: nieblaValle },
      uBarrido: { value: -ext },
      uBarridoColor: { value: color(paleta.barrido) },
      uLotes: { value: texturaLotes },
      uSatelite: { value: null },
      uMezcla: { value: 0 },
      uRadio: { value: ext / 2 },
      uBorde: { value: color(paleta.borde) },
    },
    transparent: true,
  });
  const terreno = new Mesh(geometria, material);
  escena.add(terreno);
  const pared = crearPared({
    relieve,
    exageracion,
    radio: ext / 2 - 3,
    profundidad: ext * 0.07,
    luz: material.uniforms.uLuz.value,
    color: { capa1: color(paleta.capa1 ?? "#1B1916"), capa2: color(paleta.capa2 ?? "#8F9088"), capa3: color(paleta.capa3 ?? "#6E3B24"), capa4: color(paleta.capa4 ?? "#2A2B27") },
  });
  escena.add(pared);

  // Pin GPS en la casa de la finca
  const centro = relieve.aLocal(relieve.centro.lon, relieve.centro.lat);
  const yCentro = (relieve.alturaEn(relieve.centro.lon, relieve.centro.lat) - relieve.minimo) * exageracion;
  const pin = new Group();
  const palo = new Mesh(new CylinderGeometry(1.2, 1.2, 70, 8), new MeshBasicMaterial({ color: paleta.pin ?? "#E9EAE4" }));
  palo.position.y = 35;
  const cabeza = new Mesh(new SphereGeometry(7, 20, 16), new MeshBasicMaterial({ color: paleta.pinCabeza ?? "#FFC21A" }));
  cabeza.position.y = 72;
  const anillo = new Mesh(new RingGeometry(9, 12, 48), new MeshBasicMaterial({ color: paleta.pinCabeza ?? "#FFC21A", transparent: true, opacity: 0.9, side: DoubleSide }));
  anillo.rotation.x = -Math.PI / 2;
  anillo.position.y = 1.5;
  pin.add(palo, cabeza, anillo);
  pin.position.set(centro.x, yCentro, centro.z);
  escena.add(pin);

  // Cámara y controles
  const relieveAlto = (relieve.maximo - relieve.minimo) * exageracion;
  const objetivo = new Vector3(0, relieveAlto * 0.25, 0);
  const poseFinal = new Vector3(ext * 0.62 * distancia, relieveAlto + ext * 0.62 * distancia, ext * 0.98 * distancia);
  const poseInicial = new Vector3(ext * 0.05, ext * 1.25, ext * 0.15);
  camara.position.copy(entrada && !reducirMovimiento ? poseInicial : poseFinal);
  camara.lookAt(objetivo);
  const controles = new OrbitControls(camara, lienzo);
  controles.target.copy(objetivo);
  controles.enableDamping = true;
  controles.dampingFactor = 0.08;
  controles.minDistance = ext * 0.25;
  controles.maxDistance = ext * 1.6 * Math.max(1, distancia);
  controles.maxPolarAngle = Math.PI * 0.46;
  controles.enablePan = true;
  controles.screenSpacePanning = false;
  controles.touches = { ONE: 0, TWO: 2 }; // un dedo gira; dos dedos acercan y desplazan
  // En la landing la rueda del mouse desplaza la página, no acerca el terreno.
  controles.enableZoom = zoomRueda;

  let autorrotar = girar && !reducirMovimiento;
  let inicioRotacion = performance.now() + (entrada ? 2600 : 0);
  controles.autoRotate = autorrotar;
  controles.autoRotateSpeed = -0.9;
  const detenerGiro = () => {
    autorrotar = false;
    controles.autoRotate = false;
  };
  lienzo.addEventListener("pointerdown", detenerGiro);

  let ancho = 1;
  let alto = 1;
  const ajustar = () => {
    const caja = lienzo.getBoundingClientRect();
    ancho = Math.max(1, caja.width);
    alto = Math.max(1, caja.height);
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    aplicarDesplazamiento();
    pedir();
  };

  // Encuadre: corre la escena (fracciones del ancho y del alto) sin mover la cámara.
  // x > 0 la lleva a la derecha; y > 0, hacia arriba.
  const desplazamiento = { x: 0, y: 0, objetivoX: 0, objetivoY: 0 };
  function aplicarDesplazamiento() {
    if (Math.abs(desplazamiento.x) > 0.0005 || Math.abs(desplazamiento.y) > 0.0005) camara.setViewOffset(ancho, alto, -ancho * desplazamiento.x, alto * desplazamiento.y, ancho, alto);
    else camara.clearViewOffset();
    camara.updateProjectionMatrix();
  }

  // Vuelo de cámara entre poses (se interrumpe si la persona toma el control).
  let vuelo = null;
  // Destino de la entrada animada: si alguien pide otra pose mientras entra, la
  // entrada termina en esa pose en lugar de la vista inicial.
  const destinoEntrada = { pos: poseFinal.clone(), foco: objetivo.clone() };
  const volar = (posicion, foco, duracion = 1400) => {
    if (inicioEntrada !== null) {
      destinoEntrada.pos.copy(posicion);
      destinoEntrada.foco.copy(foco);
      pedir();
      return;
    }
    if (reducirMovimiento || duracion <= 0) {
      camara.position.copy(posicion);
      controles.target.copy(foco);
      controles.update();
      pedir();
      return;
    }
    vuelo = { desdePos: camara.position.clone(), desdeFoco: controles.target.clone(), hastaPos: posicion.clone(), hastaFoco: foco.clone(), inicio: performance.now(), duracion };
    pedir();
  };

  // Bucle a demanda
  let cuadro = 0;
  let animando = false;
  let inicioEntrada = null;
  let vivo = true;
  const DURACION_ENTRADA = 2600;
  const suave = (x) => 1 - (1 - x) ** 3;

  const proyectar = () => {
    if (!alMover) return;
    const puntos = lotes
      .filter((l) => l.geometria)
      .map((l) => {
        const [lon, lat] = l.geometria.tipo === "punto" ? l.geometria.punto : l.geometria.puntos.reduce(([a, b], [x, y]) => [a + x / l.geometria.puntos.length, b + y / l.geometria.puntos.length], [0, 0]);
        const local = relieve.aLocal(lon, lat);
        const y = (relieve.alturaEn(lon, lat) - relieve.minimo) * exageracion + 22;
        const v = new Vector3(local.x, y, local.z).project(camara);
        return { id: l.id, x: ((v.x + 1) / 2) * ancho, y: ((1 - v.y) / 2) * alto, visible: v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 };
      });
    const casa = new Vector3(pin.position.x, pin.position.y + 95, pin.position.z).project(camara);
    alMover({ lotes: puntos, casa: { x: ((casa.x + 1) / 2) * ancho, y: ((1 - casa.y) / 2) * alto }, acimut: controles.getAzimuthalAngle() });
  };

  const tic = (ahora) => {
    if (!vivo) return;
    cuadro = 0;
    let seguir = false;
    if (inicioEntrada !== null) {
      const p = Math.min(1, (ahora - inicioEntrada) / DURACION_ENTRADA);
      camara.position.lerpVectors(poseInicial, destinoEntrada.pos, suave(p));
      controles.target.lerpVectors(objetivo, destinoEntrada.foco, suave(p));
      const formacion = suave(Math.min(1, p / 0.45));
      material.uniforms.uFormacion.value = formacion;
      pared.material.uniforms.uFormacion.value = formacion;
      pin.scale.setScalar(Math.max(0.001, formacion));
      material.uniforms.uBarrido.value = -ext / 2 + ext * 1.2 * p;
      if (p >= 1) {
        inicioEntrada = null;
        material.uniforms.uBarrido.value = ext * 2;
      } else seguir = true;
    }
    if (vuelo) {
      const p = Math.min(1, (ahora - vuelo.inicio) / vuelo.duracion);
      const k = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
      camara.position.lerpVectors(vuelo.desdePos, vuelo.hastaPos, k);
      controles.target.lerpVectors(vuelo.desdeFoco, vuelo.hastaFoco, k);
      if (p >= 1) vuelo = null;
      else seguir = true;
    }
    const dx = desplazamiento.objetivoX - desplazamiento.x;
    const dy = desplazamiento.objetivoY - desplazamiento.y;
    if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
      const paso = reducirMovimiento ? 1 : 0.1;
      desplazamiento.x += dx * paso;
      desplazamiento.y += dy * paso;
      aplicarDesplazamiento();
      seguir = true;
    } else if (dx !== 0 || dy !== 0) {
      desplazamiento.x = desplazamiento.objetivoX;
      desplazamiento.y = desplazamiento.objetivoY;
      aplicarDesplazamiento();
    }
    if (autorrotar) {
      if (ahora - inicioRotacion > 9000) {
        autorrotar = false;
        controles.autoRotate = false;
      } else seguir = true;
    }
    seguir = controles.update() || seguir || animando;
    renderer.render(escena, camara);
    proyectar();
    if (seguir) cuadro = requestAnimationFrame(tic);
  };
  const pedir = () => {
    if (!cuadro && vivo) cuadro = requestAnimationFrame(tic);
  };
  controles.addEventListener("change", pedir);
  controles.addEventListener("start", () => {
    animando = true;
    vuelo = null;
    pedir();
  });
  controles.addEventListener("end", () => {
    animando = false;
  });

  // Tocar un lote
  const rayo = new Raycaster();
  const puntero = new Vector2();
  let abajo = null;
  const alBajar = (evento) => {
    abajo = { x: evento.clientX, y: evento.clientY };
  };
  const alSubir = (evento) => {
    if (!abajo || Math.hypot(evento.clientX - abajo.x, evento.clientY - abajo.y) > 6) return;
    const caja = lienzo.getBoundingClientRect();
    puntero.set(((evento.clientX - caja.left) / caja.width) * 2 - 1, -((evento.clientY - caja.top) / caja.height) * 2 + 1);
    rayo.setFromCamera(puntero, camara);
    const golpe = rayo.intersectObject(terreno)[0];
    if (!golpe || Math.hypot(golpe.point.x, golpe.point.z) > ext / 2) return;
    const { lon, lat } = relieve.aLonLat(golpe.point.x, golpe.point.z);
    const altura = Math.round(golpe.point.y / exageracion + relieve.minimo);
    const lote =
      lotes.find((l) => l.geometria?.tipo === "poligono" && dentro([lon, lat], l.geometria.puntos)) ??
      lotes
        .filter((l) => l.geometria?.tipo === "punto")
        .map((l) => ({ l, d: Math.hypot((l.geometria.punto[0] - lon) * 111320, (l.geometria.punto[1] - lat) * 111320) }))
        .filter(({ l, d }) => d < Math.max(45, Math.sqrt(((l.areaHa || 0.5) * 10000) / Math.PI)))
        .sort((a, b) => a.d - b.d)[0]?.l;
    seleccionar(lote?.id ?? null);
    const d = 12;
    const este = relieve.alturaEn(lon + d / 111320 / Math.cos((lat * Math.PI) / 180), lat) - relieve.alturaEn(lon - d / 111320 / Math.cos((lat * Math.PI) / 180), lat);
    const norte = relieve.alturaEn(lon, lat + d / 111320) - relieve.alturaEn(lon, lat - d / 111320);
    const pendiente = Math.round((Math.atan(Math.hypot(este, norte) / (2 * d)) * 180) / Math.PI);
    const rumbos = ["norte", "nororiente", "oriente", "suroriente", "sur", "suroccidente", "occidente", "noroccidente"];
    const orientacion = rumbos[Math.round(((Math.atan2(-este, -norte) * 180) / Math.PI + 360) % 360 / 45) % 8];
    alSeleccionar?.({ loteId: lote?.id ?? null, lon, lat, altura, pendiente, orientacion });
  };
  lienzo.addEventListener("pointerdown", alBajar);
  lienzo.addEventListener("pointerup", alSubir);

  // Lectura en vivo bajo el cursor (una consulta por cuadro como máximo).
  let pendienteApuntar = null;
  let cuadroApuntar = 0;
  const apuntar = () => {
    cuadroApuntar = 0;
    if (!pendienteApuntar || !vivo) return;
    const caja = lienzo.getBoundingClientRect();
    puntero.set(((pendienteApuntar.x - caja.left) / caja.width) * 2 - 1, -((pendienteApuntar.y - caja.top) / caja.height) * 2 + 1);
    rayo.setFromCamera(puntero, camara);
    const golpe = rayo.intersectObject(terreno)[0];
    if (!golpe || Math.hypot(golpe.point.x, golpe.point.z) > ext / 2) {
      alApuntar(null);
      return;
    }
    const { lon, lat } = relieve.aLonLat(golpe.point.x, golpe.point.z);
    alApuntar({ lon, lat, altura: Math.round(golpe.point.y / exageracion + relieve.minimo) });
  };
  const alMoverPuntero = (evento) => {
    if (evento.pointerType !== "mouse") return;
    pendienteApuntar = { x: evento.clientX, y: evento.clientY };
    if (!cuadroApuntar) cuadroApuntar = requestAnimationFrame(apuntar);
  };
  const alSalirPuntero = () => {
    pendienteApuntar = null;
    alApuntar?.(null);
  };
  if (alApuntar) {
    lienzo.addEventListener("pointermove", alMoverPuntero);
    lienzo.addEventListener("pointerleave", alSalirPuntero);
  }

  const seleccionar = (id) => {
    seleccionado = id;
    dibujarLotes({ lienzo: lienzoLotes, relieve, lotes, colores: paleta.estados, seleccionado });
    texturaLotes.needsUpdate = true;
    pedir();
  };

  const alPerder = (evento) => {
    evento.preventDefault();
    vivo = false;
    alPerderContexto?.();
  };
  lienzo.addEventListener("webglcontextlost", alPerder);

  const observador = new ResizeObserver(ajustar);
  observador.observe(lienzo);
  ajustar();
  if (entrada && !reducirMovimiento) inicioEntrada = performance.now();
  pedir();

  let texturaSatelite = null;
  let mezclaObjetivo = 0;
  const animarMezcla = () => {
    const actual = material.uniforms.uMezcla.value;
    const siguiente = reducirMovimiento ? mezclaObjetivo : actual + (mezclaObjetivo - actual) * 0.18;
    material.uniforms.uMezcla.value = Math.abs(siguiente - mezclaObjetivo) < 0.01 ? mezclaObjetivo : siguiente;
    renderer.render(escena, camara);
    if (material.uniforms.uMezcla.value !== mezclaObjetivo) requestAnimationFrame(animarMezcla);
  };

  return {
    exageracion,
    seleccionar,
    actualizarLotes(nuevos) {
      lotes = nuevos;
      dibujarLotes({ lienzo: lienzoLotes, relieve, lotes, colores: paleta.estados, seleccionado });
      texturaLotes.needsUpdate = true;
      pedir();
    },
    ponerLuz(nuevoAngulo) {
      material.uniforms.uLuz.value.copy(luzDesde(nuevoAngulo));
      pedir();
    },
    ponerSatelite(lienzoSatelite) {
      texturaSatelite?.dispose();
      texturaSatelite = new CanvasTexture(lienzoSatelite);
      texturaSatelite.colorSpace = "";
      texturaSatelite.minFilter = LinearFilter;
      material.uniforms.uSatelite.value = texturaSatelite;
      pedir();
    },
    mezclarSatelite(activo) {
      mezclaObjetivo = activo ? 1 : 0;
      requestAnimationFrame(animarMezcla);
    },
    verDesdeArriba() {
      camara.position.set(objetivo.x, ext * 1.2, objetivo.z + 1);
      controles.update();
      pedir();
    },
    alNorte() {
      const distancia = camara.position.distanceTo(controles.target);
      const altura = camara.position.y - controles.target.y;
      const horizontal = Math.sqrt(Math.max(distancia ** 2 - altura ** 2, 1));
      camara.position.set(controles.target.x, camara.position.y, controles.target.z + horizontal);
      controles.update();
      pedir();
    },
    reiniciarVista() {
      volar(poseFinal, objetivo);
    },
    /* Acerca la cámara a la casa: la finca completa, más cerca que la vista inicial. */
    enfocarFinca(duracion) {
      const foco = new Vector3(pin.position.x, pin.position.y * 0.6, pin.position.z);
      volar(new Vector3(foco.x + ext * 0.4, foco.y + ext * 0.44, foco.z + ext * 0.62), foco, duracion);
    },
    /* Acerca la cámara a un lote (sin id, vuelve a la vista inicial). */
    enfocarLote(id, duracion) {
      const lote = lotes.find((l) => l.id === id && l.geometria);
      if (!lote) {
        volar(poseFinal, objetivo, duracion);
        return;
      }
      const g = lote.geometria;
      const [lon, lat] = g.tipo === "punto" ? g.punto : g.puntos.reduce(([a, b], [x, y]) => [a + x / g.puntos.length, b + y / g.puntos.length], [0, 0]);
      const local = relieve.aLocal(lon, lat);
      const y = (relieve.alturaEn(lon, lat) - relieve.minimo) * exageracion;
      const foco = new Vector3(local.x, y, local.z);
      volar(new Vector3(local.x + ext * 0.3, y + ext * 0.36, local.z + ext * 0.46), foco, duracion);
    },
    /* Corre el encuadre: (0, 0) centrado; (0,2, 0) deja libre el 20 % izquierdo. */
    encuadrar(x = 0, y = 0, inmediato = false) {
      desplazamiento.objetivoX = x;
      desplazamiento.objetivoY = y;
      if (inmediato) {
        desplazamiento.x = x;
        desplazamiento.y = y;
        aplicarDesplazamiento();
      }
      pedir();
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      lienzo.removeEventListener("pointerdown", alBajar);
      lienzo.removeEventListener("pointerup", alSubir);
      lienzo.removeEventListener("pointerdown", detenerGiro);
      lienzo.removeEventListener("pointermove", alMoverPuntero);
      lienzo.removeEventListener("pointerleave", alSalirPuntero);
      cancelAnimationFrame(cuadroApuntar);
      lienzo.removeEventListener("webglcontextlost", alPerder);
      controles.dispose();
      geometria.dispose();
      material.dispose();
      pared.geometry.dispose();
      pared.material.dispose();
      texturaLotes.dispose();
      texturaSatelite?.dispose();
      pin.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      renderer.dispose();
    },
  };
}

/* ¿Hay WebGL2 en este equipo? */
export function hayWebGL2() {
  try {
    const contexto = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    contexto?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(contexto);
  } catch {
    return false;
  }
}
