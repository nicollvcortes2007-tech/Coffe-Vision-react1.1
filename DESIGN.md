# Design System: Coffee+Visión — «Ceniza y Cereza»

Fuente de verdad visual del proyecto. Se compuso el 2026-10-15 y reemplaza a «Pergamino de ladera», que se rechazó por genérica: su crema #F4EDE1 es casi la misma paleta agro de los sitios premiados (Farm Minerals usa #F4EDE6) y su serif con itálica de color repetía el gesto de AiDEN. La investigación completa está en `docs/investigacion/` (informes 05, 06 y 07). De cada referencia se tomó una idea, nunca su paleta, su logotipo, su tipografía comercial ni su código.

## Concepto

El café del Cauca crece sobre ceniza volcánica y madura en rojo y amarillo. La marca se lee como **un instrumento de campo**:

- **Basalto, de noche.** La landing y la finca 3D muestran el relieve real del terreno en grises de ceniza, con curvas de nivel como dato, niebla en los valles y luz rasante de amanecer.
- **Cal, a pleno sol.** La app es clara y de alto contraste (tinta sobre cal: 17,35:1), porque se usa en el lote con el celular. El nombre viene de las fachadas encaladas de Popayán.
- **Cereza y amarillo, solo como señal.** Son los colores del grano maduro y significan algo: actuar y vigilar. Nunca se usan de decoración.

Tres reglas sostienen todo:

1. **Primero el campo.** Registrar en segundos, con el pulgar y sin señal.
2. **Cada número dice de dónde sale.** Las cifras llevan su fuente (Cenicafé, FNC) a un toque.
3. **El territorio es dato, no fondo.** Las curvas de nivel y el relieve salen de mediciones reales (SRTM); no hay curvas decorativas ni ilustraciones de stock.

## Color

Tokens en `src/estilos/app.css` (`@theme`). Contrastes WCAG 2.x calculados con la fórmula de luminancia relativa.

### Cal (app)

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `cal` | `#F6F6F3` | Fondo de la app | — |
| `cal-honda` | `#EBEBE6` | Superficies hundidas, hover | — |
| `lamina` | `#FFFFFF` | Placas (tarjetas) y campos | — |
| `tinta` | `#111210` | Texto y acción primaria | 17,35:1 sobre cal |
| `grafito` | `#4B4D47` | Texto secundario | 7,91:1 sobre cal |
| `grafito-suave` | `#6B6D66` | Marcadores de posición | 4,84:1 sobre cal |
| `linea` | `#DCDDD7` | Bordes de placa (nunca texto) | — |
| `borde` | `#8A8C85` | Borde de campos | 3,4:1 sobre blanco |

### Señal

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `cereza` | `#C3121B` | «Actuar hoy» y destructivas en la app | 5,67:1 sobre cal; blanco encima 6,14:1 |
| `cereza-viva` | `#FF3B2F` | «Actuar» en 3D y CTA de la landing | 5,42:1 sobre basalto |
| `amarillo` | `#FFC21A` | «Vigilar» (siempre con tinta encima y rayado) | tinta encima 11,61:1 |
| `amarillo-texto` | `#7A5600` | Texto de aviso sobre cal | 6,14:1 |
| `roya` | `#FF7A1A` | Solo dentro de fotos e ilustraciones de roya | — |

### Basalto (landing y 3D)

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `basalto` | `#0E0F0C` | Fondo de la landing y del 3D | — |
| `escoria` | `#1A1B18` | Paneles | — |
| `niebla` | `#E9EAE4` | Texto sobre basalto, placas «al día» | 15,89:1 sobre basalto |
| `ceniza` | `#9A9C94` | Texto secundario sobre basalto | 6,92:1 |

### Estados del lote

| Estado | App (Cal) | 3D (Basalto) | Segunda señal |
|---|---|---|---|
| Actuar hoy | placa `cereza` con texto blanco | placa `cereza-viva` | ícono de alerta y palabra |
| Vigilar | placa `amarillo` con tinta | placa `amarillo` | **rayado diagonal**, ícono de ojo |
| Al día | contorno de tinta sobre blanco | placa `niebla` | ícono de visto |
| Sin datos | `niebla` con borde punteado | placa `ceniza` punteada | ícono de niebla |

Con deuteranopía, el rojo cereza y el naranja roya se confunden (ΔE 2,5); por eso la alerta de «vigilar» es amarillo con rayado, y el naranja queda solo en imágenes.

## Tipografía

Tres familias con licencia SIL OFL 1.1, autoalojadas en WOFF2 variable (`src/assets/fuentes/`, subconjunto latin):

| Familia | Origen | Rol |
|---|---|---|
| **Archivo** (wdth 62–125, wght 100–900) | Omnibus-Type, Buenos Aires | `titular-mayor`: Expanded 900 en mayúsculas para la landing y los grandes títulos. `titular`: 108 % y 780 para títulos de interfaz. `numeral`: 112 % y 760 con cifras tabulares |
| **Martian Mono** (wdth 75–112,5, wght 100–800) | Evil Martians | `rotulo` y `lectura`: coordenadas, altitud, etiquetas técnicas, fuentes |
| **Ancizar Sans** (wght 100–1000) | Universidad Nacional de Colombia, 2025 | Texto e interfaz de la app (17 px base) |

Sin serif y sin itálicas de acento. La única itálica permitida es la del nombre científico (convención botánica).

## Forma

- Radio de 6 px para placas, botones y campos (`--radius-placa`); 3 px para etiquetas y chips. Nada de pastillas ni tarjetas muy redondeadas.
- Placas planas: borde `linea` de 1 px y sin sombra. La sombra `levantado` queda para hojas y avisos flotantes.
- Botones de 48 px de alto. Primario en tinta; `boton-cereza` solo para lo que no se puede deshacer.
- Foco visible: contorno de 3 px en tinta (amarillo sobre basalto). Campos con anillo amarillo al enfocar.

## La finca en 3D

`src/components/finca3d/` (three.js 0.186, WebGL2):

- **Relieve real**: teselas Terrarium de AWS (SRTM, 30 m) a z13, recortadas en un círculo como una muestra de suelo. La pared muestra un andisol: horizonte A, la capa de ceniza volcánica, el horizonte B rojizo y la roca.
- **Shader propio**: gradiente de basalto a ceniza, luz rasante con laderas al sol cálidas y sombras frías, curvas cada 10 m e índice cada 50 m, niebla en los valles con jirones estáticos y la capa satelital opcional (Sentinel-2 de EOX).
- **Lotes como placas** pintadas en una textura: sólidas, con rayado en «vigilar» y punteado en «sin datos».
- **Exageración** `k = clamp(0,12 · ancho / desnivel, 1,2, 3)`, siempre visible en la lectura («relieve ×1,7»).
- **Render a demanda**: solo se dibuja cuando algo se mueve. Maneja la pérdida de contexto WebGL y, sin WebGL2, dibuja el mismo relieve en 2D.
- **Interacción**: tocar un lote abre su ficha (altitud, pendiente, hacia dónde mira, GPS); brújula, vista cenital y vuelta a la vista inicial. En la landing, la rueda desplaza la página y el dedo no queda atrapado (botón «mover la finca»).
- **Sin señal**: el service worker guarda las teselas en `cv-relieve-v1`; la landing usa un relieve horneado (`public/finca-demo/relieve-160.png`, 50 KB).

## Landing

Recorrido de noche sobre la finca de ejemplo («La Esperanza», ficticia, en una vereda real de Timbío):

1. **Portada**: «SEMBRADO EN CENIZA.» en Archivo Expanded detrás de la loma, que tapa la parte baja de las letras. Lectura de coordenadas y altitud bajo el cursor, leyenda que también es el menú de capas (estado, broca, roya).
2. **Capítulos** (el 3D queda fijo y la cámara vuela): lotes, broca, roya y cosecha, con las cifras reales de la semilla y su fuente. La luz se mueve con el scroll como un amanecer. Botón «Saltar el recorrido».
3. **Debajo, ceniza**: corte del suelo.
4. **¿Cuánto vale tu carga?**: bloque amarillo con la calculadora del factor de rendimiento (tabla FNC) y dígitos de rodillo.
5. **Voltea la hoja**: diagnóstico por foto, rotulado como ejemplo ilustrado.
6. **Lo de hoy, primero**: la app en el celular.
7. Cifras con fuente, índice de módulos, qué es y qué no es, fuentes y pie con la marca.

## Movimiento

- Curva `--ease-instrumento` (lenta-rápida-lenta) para vuelos y dígitos; `--ease-salida` para apariciones (420–700 ms).
- Nada gira solo. La entrada del 3D forma el relieve desde plano y barre una línea de escaneo una sola vez.
- Con `prefers-reduced-motion`: sin vuelos, sin formación, sin barrido; las transiciones duran 1 ms.

## Marca

- **Isotipo**: la cereza vista como un lente sobre el terreno. Sus curvas de nivel dibujan la loma y el punto amarillo es la casa de la finca. Sobre basalto o niebla.
- **Logotipo**: «COFFEE+VISIÓN» en Archivo Expanded 900 con el «+» en cereza.
- No usar «Café de Cauca» como sello ni lema: es una denominación de origen protegida. Tampoco iconografía del Eje Cafetero (el Paisaje Cultural Cafetero no incluye al Cauca) ni motivos de tejidos misak o nasa.

## Qué evitar (separación de AiDEN)

| AiDEN o la primera propuesta | Coffee+Visión |
|---|---|
| DM Sans, Instrument Serif, Fraunces, Atkinson; itálicas de color | Archivo, Martian Mono y Ancizar Sans; sin itálicas |
| Forest, moss, lime, paper; crema pergamino | Basalto, niebla, cereza y amarillo; Cal fría |
| Escenas vivas con WebGPU; preloader de partículas | Relieve real (DEM) en WebGL2; la escena aparece al cargar |
| Navegación por capítulos con cápsula; vidrio líquido | Leyenda del mapa como menú; paneles opacos sin desenfoque |
| Curvas de nivel finas de fondo | Curvas solo como dato sobre el relieve real |
