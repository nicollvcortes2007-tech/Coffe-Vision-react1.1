# Design System: Coffee+Visión — «Pergamino de ladera»

Fuente de verdad visual del proyecto. Se compuso el 2026-10-15 a partir de la investigación de referencias (`docs/investigacion/`): 15 plataformas (vgpu en detalle) y 10 referencias del dominio cafetero. Se compone, no se clona: de cada referencia se tomó una idea concreta, nunca su paleta, su logotipo ni su código.

## Overview

La app es un **cuaderno de campo en papel pergamino**: titulares serif con voz editorial, cifras grandes y claras, y una ladera que se lee como mapa. Es clara a propósito: se usa a pleno sol, en un celular de gama media y con señal débil. «Pergamino» es literalmente el estado del grano que vende el caficultor (café pergamino seco) y la cereza es el color de acción.

Tres ideas sostienen todo:

1. **Primero el campo.** Registrar en segundos, con el pulgar y sin señal.
2. **Cada número dice de dónde sale.** Cifras del gremio (kg de cereza, @ y cargas de c.p.s.) con su fuente (Cenicafé, FNC) a un toque.
3. **El estado se lee como la maduración del grano.** Hoja = al día, pintón = vigilar, cereza = actuar hoy, niebla = sin datos.

## Colors

Tokens en `src/estilos/app.css` (`@theme`). Contrastes WCAG 2.x calculados.

### Primary

| Token | Hex | Uso |
|---|---|---|
| `cereza` | `#A3261B` | Acción primaria y «actuar hoy». Blanco encima: 7,4:1 |
| `cereza-oscura` | `#7E1C13` | Hover y presionado de la acción |
| `cereza-viva` | `#C8372D` | Solo gráficos y 3D (4,47:1: no para texto pequeño) |
| `cereza-tenue` | `#F6DFD9` | Fondo de avisos de «actuar hoy» |

### Secondary

| Token | Hex | Uso |
|---|---|---|
| `hoja` | `#2E5B3A` | Estado «al día» y acción secundaria positiva. Blanco encima: 7,85:1 |
| `hoja-clara` | `#7FA36B` | Rellenos de gráfico |
| `hoja-tenue` | `#E2EBDC` | Fondo de estados «al día» |
| `pinton` | `#C98F2E` | Relleno de «vigilar» (texto encima en `tierra`) |
| `pinton-texto` | `#8A5A12` | Texto de aviso (5,08:1) |
| `pinton-tenue` | `#F5E6C8` | Fondo de avisos de «vigilar» |
| `niebla` | `#DDE4E2` | Clima y «sin datos» |

### Neutral

| Token | Hex | Uso |
|---|---|---|
| `pergamino` | `#F4EDE1` | Fondo de la app |
| `papel` | `#FBF7F0` | Tarjetas y superficies |
| `crema` | `#EBE1CF` | Superficie hundida, hover |
| `tierra` | `#2B1E16` | Texto principal (13,9:1 sobre pergamino) |
| `tierra-media` | `#5E4B3C` | Texto secundario (7,1:1) |
| `borde-campo` | `#8C7A68` | Borde de campos de formulario (3,86:1, mínimo no textual 3:1) |
| `linea` | `#E2D6C3` | Separadores decorativos |
| `tostado` | `#1E1510` | Únicas secciones oscuras: pie y una banda de la landing |

### Named Rules

- **El estado nunca va solo en color.** Color + ícono + palabra; en mapas, además, tramado.
- **Nada de gris claro sobre crema.** El texto mínimo es `tierra-media`.
- **El rojo significa «madura» y «alerta».** Por eso siempre lleva ícono y texto.
- **Sin paletas ajenas.** Ni el verde y café planos de la versión anterior ni los de marcas de café.

## Typography

- **Fraunces** (OFL, eje óptico) para titulares de 24 px o más: `.titular`, peso 560, interletra −1,5 %. Nunca en la interfaz pequeña.
- **Atkinson Hyperlegible Next** (OFL) para interfaz, cuerpo y cifras. Diseñada para lectores con baja visión.
- Autoalojadas en `src/assets/fuentes/` (subconjunto latin, ~200 KB en total), cacheadas por el service worker. Nada desde CDN.

### Hierarchy

| Rol | Tamaño | Notas |
|---|---|---|
| Titular de landing | `clamp(2.6rem, 7vw, 5.4rem)` | Fraunces, remate en itálica |
| Título de página | 2–2,5 rem | Fraunces |
| Cifra grande | 2–3 rem | Atkinson, `tabular-nums`, unidad del gremio al lado en tamaño menor |
| Cuerpo | 17 px (1,0625 rem), interlineado 1,55 | Mínimo 16 px en toda la app |
| Rótulo | 13 px, mayúsculas, tracking 8 % | `.rotulo`, color `tierra-media` |

Las cifras usan formato es-CO («1.250 kg», «$ 2.300.000»).

## Motion

- Curva `--ease-campo` (`cubic-bezier(0.22, 1, 0.36, 1)`); entradas de 320 ms (`animate-aparecer`).
- **Sello** (`animate-sello`): cuando se guarda un registro de campo aparece un sello «Registrado», como en un cuaderno. Menos de 450 ms.
- Borrar siempre ofrece **deshacer** durante unos segundos en vez de una confirmación modal (excepto en acciones de administración irreversibles).
- Con `prefers-reduced-motion` no hay animaciones ni lluvia; la ladera se pinta en un solo cuadro.
- Ninguna información depende de una animación.

## Layout

- Celular primero. En la app, **barra inferior** con cuatro destinos y un botón central **Registrar** (al alcance del pulgar). En escritorio (≥ 1024 px), barra lateral fija.
- Objetivos táctiles de **48 × 48 px** para acciones primarias y 8 px de separación.
- Ancho de lectura de 68 caracteres en guías.
- La ficha de un lote mantiene siempre el mismo orden: estado → cifras → próximas acciones → línea de tiempo.
- Lo no disponible se deshabilita con una razón visible; no se oculta.

## La ladera (vgpu)

Pieza 3D opcional y diferida (vgpu 0.6.0, MIT, versión fijada):

- Terreno de rejilla de alturas con forma de ladera; los lotes son zonas coloreadas por estado; surcos en curva de nivel; niebla por altura; matas instanciadas con color de maduración.
- Solo se descarga si hay `navigator.gpu`, no hay ahorro de datos y la conexión no es 2G/3G. Se monta al entrar en pantalla y limpia con `stop()`/`dispose()`.
- **Respaldo de primera clase**: si `init()` falla (`VGPU-RING1-UNSUPPORTED`) o se pierde el dispositivo, se muestra la ladera en SVG (curvas de nivel + lotes), que es también la vista accesible.
- El lienzo lleva `aria-hidden`; toda su información existe en la lista de lotes.
- Diferencia con AiDEN: aquí la protagonista es **el territorio** (la ladera y sus lotes), no la planta.

## Elevation & Depth

Dos niveles: `shadow-papel` (tarjetas) y `shadow-levantado` (hojas y menús). El fondo lleva grano de papel muy sutil (`.grano-papel`) solo en encabezados grandes. Nada de vidrio sobre datos.

## Shapes

Radio de 14 px (`--radius-campo`) en tarjetas; 12 px en campos y botones; píldoras solo para estados.

## Brand

- Nombre: **Coffee+Visión**. Logotipo tipográfico en Fraunces con el «+» en cereza; isotipo de una cereza partida con curvas de nivel (SVG propio en `src/components/marca/`).
- Íconos: Lucide (ISC). Pictogramas propios del café (cereza, broca, roya, pergamino, floración, ladera) en `src/components/marca/Pictogramas.jsx`. Sin emojis en la interfaz.
- Proyecto formativo del SENA: se dice con orgullo en la landing, sin inventar clientes, cifras de uso ni testimonios.

## Components

- **Hoy en la finca:** lista ordenada de lo que pide acción, cada ítem con lote, razón (con su regla y fuente) y botón de acción.
- **Ficha de lote:** pares etiqueta-valor con «Fuente: …» a un toque; línea de tiempo de labores, floraciones, muestreos, recolecciones y aplicaciones.
- **Contador de campo:** para el muestreo de broca, botones grandes «+ sano» / «+ brocado» que se usan sin mirar la pantalla.
- **Estado:** píldora con ícono + palabra en los cuatro tonos de maduración.
- **Cifra:** número grande + unidad del gremio + línea de fuente.
- **Sello «Registrado»** al guardar; **deshacer** al borrar.

### Navigation

- Pública: landing de una sola página con capítulos; acceso y registro; privacidad.
- Caficultor: Hoy · Lotes · Registrar · Cosecha · Más (Clima, Diagnóstico, Costos, Guías, Asistente, Perfil).
- Administrador: Panorama · Fincas · Cuentas · Guías · Datos.

## Do's and Don'ts

### Do:

- Escribir en lenguaje sencillo (nivel de 6.º grado) y en las unidades del gremio.
- Decir de dónde sale cada cifra y cuándo se actualizó el clima.
- Marcar las estimaciones como estimaciones y la autenticación local como local.
- Verificar en 375, 768 y 1440 px, sin errores en consola.

### Don't:

- No usar Font Awesome, emojis ni imágenes de stock genéricas.
- No poner texto gris claro sobre crema ni texto pequeño en `cereza-viva`.
- No hacer la ladera 3D obligatoria ni la vista por defecto en el celular.
- No inventar usuarios, testimonios ni métricas de uso.
