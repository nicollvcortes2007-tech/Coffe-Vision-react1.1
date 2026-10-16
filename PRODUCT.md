# Product

<!-- impeccable:product-schema 1 -->

Escrito el 2026-10-15 a partir de lo que ya decía el proyecto (landing y código de `main`) y de la investigación de esa fecha. Lo que no está confirmado queda como decisión abierta.

## Platform

web (pensada primero para el celular; funciona sin conexión después de la primera visita)

## Users

Caficultores colombianos, sobre todo pequeños productores del Cauca, y el equipo que administra la plataforma:

- **Caficultor:** registra su finca y sus lotes, las labores, las floraciones, los muestreos de broca y roya, la recolección, las ventas y los costos; consulta el clima, el diagnóstico por foto, las guías y el asistente.
- **Administrador:** gestiona las cuentas, ve el panorama de todas las fincas registradas (alertas, producción, sanidad) y mantiene el catálogo de guías.

Abierto: si el rol de administrador corresponde a un técnico extensionista, a una asociación o al equipo del proyecto.

## Product Purpose

Ayudar al caficultor a decidir mejor con sus propios datos: cuándo actuar contra la broca y la roya, cuánto produce y cuánto le cuesta cada lote, y qué viene según el clima. El nombre promete «visión»: diagnóstico por foto y lectura clara de la finca.

Proyecto formativo del SENA (Tecnólogo en Análisis y Desarrollo de Software), Popayán, Cauca.

## Positioning

Ver `docs/investigacion/` (2026-10-15). Abierto: la frase de posicionamiento definitiva.

## Operating Context

Uso en campo, con sol directo, manos ocupadas y señal débil o nula. Registros cortos y repetidos (muestreos, recolección del día). Unidades del gremio: kilos de café cereza, kilos y cargas de café pergamino seco (c.p.s.), arrobas.

## Capabilities and Constraints

- Aplicación solo de frontend: no tiene servidor. Las cuentas y los datos viven en el navegador (localStorage), con respaldo descargable en JSON.
- La autenticación es local: no es de producción y la interfaz lo dice.
- Datos externos solo de fuentes abiertas que respondan desde el navegador y sin clave.
- Repo público: sin secretos ni código con licencia que prohíba redistribuirlo.

## Brand Commitments

Nombre Coffee+Visión. Identidad visual en `DESIGN.md`.

## Evidence on Hand

No hay usuarios reales, testimonios ni métricas de uso. No se inventan. Las cifras agronómicas de la app citan su fuente (Cenicafé, FNC).

## Product Principles

1. Primero el campo: registrar en segundos, con el pulgar y sin señal.
2. Cada número dice de dónde sale; una alerta dice qué hacer.
3. Las cifras del gremio, en las unidades del gremio.
4. Nada de mentira: si algo es una estimación o una demostración, se dice.

## Accessibility & Inclusion

Contraste AA, objetivos táctiles de 44 px o más, letra grande, lenguaje sencillo, navegación por teclado, movimiento reducido y uso a pleno sol.
