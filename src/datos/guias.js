/*
  Guías de campo escritas por el equipo con palabras propias, a partir de las
  publicaciones de Cenicafé y la FNC (docs/investigacion/02-dominio-cafetero.md).
  Las publicaciones de Cenicafé tienen licencia CC BY-NC-ND: no se copia su texto;
  se citan los datos y se enlaza al documento original.
*/

const CENICAFE_MANUAL_T2 = { texto: "Benavides et al., Manual del cafetero colombiano t. 2 (Cenicafé, 2013)", url: "https://biblioteca.cenicafe.org/bitstream/10778/4340/1/cenbook-0026_24.pdf" };
const BOLETIN_20 = { texto: "Cenicafé, Boletín fitosanitario 20 (3.er trimestre de 2026)", url: "https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484" };
const ENFERMEDADES = "Gil, Castro y Cadena (eds.), Enfermedades del cafeto en Colombia (Cenicafé, 2003)";

export const CATEGORIAS_GUIA = [
  { id: "plagas", nombre: "Plagas" },
  { id: "enfermedades", nombre: "Enfermedades" },
  { id: "cultivo", nombre: "Cultivo" },
  { id: "cosecha", nombre: "Cosecha y beneficio" },
];

export const GUIAS = [
  {
    id: "muestreo-broca",
    categoria: "plagas",
    titulo: "Cómo muestrear la broca",
    resumen: "30 árboles por lote, la rama más cargada de cada uno, y una cuenta sencilla.",
    palabras: ["broca", "muestreo", "infestacion", "porcentaje", "frutos brocados", "posiciones", "zigzag"],
    secciones: [
      {
        titulo: "Cuándo",
        puntos: [
          "Desde unos 120 días después de la floración principal: antes de eso la broca no pone huevos en el fruto.",
          "Una vez al mes durante el período crítico y después de cada recolección.",
          "En años secos (El Niño) la infestación puede multiplicarse por cinco en 30 días: no deje pasar el mes.",
        ],
      },
      {
        titulo: "Cómo",
        puntos: [
          "Recorra el lote en zigzag o en cruz y elija 30 árboles.",
          "En cada árbol tome la rama con más frutos (entre 30 y 100) y cuente todos los frutos y los brocados (los que tienen el huequito en la corona).",
          "Porcentaje de infestación = frutos brocados ÷ frutos contados × 100.",
        ],
      },
      {
        titulo: "Qué decidir",
        puntos: [
          "Menos de 2 %: no aplique nada. Siga con la recolección oportuna y el repase.",
          "2 % o más: recoja 100 frutos brocados, ábralos y mire dónde está la broca. A: empezando a perforar. B: en el canal. C: dentro de la almendra. D: con huevos o larvas.",
          "Solo si más de la mitad está en A o B tiene sentido aplicar Beauveria o un insecticida: en C y D ningún producto la alcanza.",
          "5 % o más es nivel de daño económico: la recolección y el repase deben ser rigurosos.",
        ],
      },
    ],
    fuentes: [CENICAFE_MANUAL_T2, BOLETIN_20],
  },
  {
    id: "manejo-broca",
    categoria: "plagas",
    titulo: "Manejo integrado de la broca",
    resumen: "La recolección y el repase (Re-Re) hacen la mayor parte del trabajo.",
    palabras: ["broca", "re-re", "repase", "recoleccion", "beauveria", "hongo", "control biologico", "beneficiadero", "zoca"],
    secciones: [
      {
        titulo: "Recolección oportuna y repase",
        puntos: [
          "Recoja los frutos maduros a tiempo y, de 2 a 3 semanas después de la última recolección, haga el repase: frutos maduros, sobremaduros y secos, del árbol y del suelo.",
          "Tras un pase deben quedar menos de 5 frutos por árbol y menos de 5 en el suelo. Un solo fruto brocado puede infestar cientos de frutos en seis meses.",
          "En pruebas de Cenicafé, la recolección oportuna con repase bajó la infestación de 70 % a menos de 6 % en un ciclo.",
        ],
      },
      {
        titulo: "En el beneficio",
        puntos: [
          "Amarre los costales en el cafetal y pese dos veces al día.",
          "Cubra la tolva con plástico con pegante y solarice la pasilla y los flotes durante 48 horas.",
        ],
      },
      {
        titulo: "Control biológico con Beauveria",
        puntos: [
          "Solo cuando la infestación pasa del 2 % y la broca está en A o B, en el período crítico.",
          "Concentración mínima de 2 × 10¹⁰ conidias por litro; unos 50 mL de mezcla por árbol.",
          "Necesita humedad relativa mayor de 70 %: aplique temprano o al final de la tarde, sin sol directo.",
        ],
      },
      {
        titulo: "Al zoquear",
        puntos: ["Haga cosecha sanitaria antes de cortar: sin ella quedan millones de brocas por hectárea renovada.", "En zonas con cosecha principal en el primer semestre, no renueve después de septiembre."],
      },
    ],
    fuentes: [CENICAFE_MANUAL_T2, { texto: "Cenicafé, Avance Técnico 493 (2018): Beauveria bassiana", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/1103/1/AVT_493.pdf" }],
  },
  {
    id: "roya",
    categoria: "enfermedades",
    titulo: "Roya: muestreo y calendario",
    resumen: "Polvillo naranja por el envés de la hoja. Se mide con 10 árboles y se actúa sobre el 5 %.",
    palabras: ["roya", "hemileia", "polvillo naranja", "fungicida", "muestreo", "susceptible", "caturra"],
    secciones: [
      {
        titulo: "Cómo reconocerla",
        puntos: ["Manchas amarillas por el haz y polvillo naranja por el envés de la hoja.", "Cuando las lesiones cubren más del 30 % de la hoja, la hoja puede caer."],
      },
      {
        titulo: "Muestreo",
        puntos: [
          "Recorra todo el lote y elija 10 árboles al azar. En cada uno revise 10 ramas de la zona productiva con más de 10 hojas.",
          "Por árbol: hojas con roya ÷ hojas revisadas × 100. El dato del lote es el promedio de los 10 árboles.",
          "Muestree a los 90, 135, 180 y 225 días de la floración principal.",
        ],
      },
      {
        titulo: "Qué decidir",
        puntos: [
          "Cenicafé recomienda aplicación preventiva de fungicida cuando la incidencia supera el 5 %, sin importar la variedad.",
          "En variedades susceptibles (Caturra, Típica, Borbón, Geisha) el control es obligatorio: la primera aplicación va a los 60 días de la floración principal. Aplicar tarde rinde mucho menos.",
          "El producto y la dosis los define el extensionista y la etiqueta. El portafolio vigente está en el Boletín fitosanitario de Cenicafé.",
        ],
      },
      {
        titulo: "Clima",
        puntos: ["La roya crece entre 16 y 28 °C y necesita agua sobre la hoja para germinar.", "Una lluvia de más de 5 mm entre las 5 de la tarde y las 3 de la mañana deja la hoja mojada 6 horas o más.", "Bajo sombra la enfermedad es menos severa."],
      },
    ],
    fuentes: [BOLETIN_20, { texto: "Rivillas, Avance Técnico 495 (Cenicafé, 2018)", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/1105/1/AT0495.pdf" }, { texto: `${ENFERMEDADES}, cap. Roya`, url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/993/22/20.%20Roya%20anaranjada.pdf" }],
  },
  {
    id: "mancha-de-hierro",
    categoria: "enfermedades",
    titulo: "Mancha de hierro",
    resumen: "Manchas redondas con centro gris y anillo pardo. Casi siempre habla de nutrición.",
    palabras: ["mancha de hierro", "cercospora", "manchas", "media cara", "guayaba", "nutricion"],
    secciones: [
      {
        titulo: "Cómo reconocerla",
        puntos: ["En las hojas: manchas redondas de 1 a 3 mm con el centro blanco grisáceo y un anillo pardo rojizo; se juntan y la hoja cae.", "En los frutos: lesiones que dan granos «media cara» y «guayaba», que terminan como pasilla."],
      },
      {
        titulo: "Por qué aparece",
        puntos: ["Se asocia a deficiencias de fertilización, plena exposición al sol y suelos compactos.", "En almácigos sin cobertizo puede tumbar casi todas las hojas."],
      },
      {
        titulo: "Manejo",
        puntos: ["Corrija la nutrición con base en un análisis de suelo.", "Almácigo con sombra y sustrato de suelo y pulpa descompuesta (3 a 1)."],
      },
    ],
    fuentes: [{ texto: `${ENFERMEDADES}, cap. 18`, url: "https://biblioteca.cenicafe.org/bitstream/10778/993/20/18.%20Mancha%20de%20hierro.pdf" }],
  },
  {
    id: "minador",
    categoria: "plagas",
    titulo: "Minador de la hoja",
    resumen: "Galerías color café dentro de la hoja. Los insecticidas fuertes lo empeoran.",
    palabras: ["minador", "leucoptera", "minas", "galerias", "hojas secas"],
    secciones: [
      {
        titulo: "Cómo reconocerlo",
        puntos: ["Minas o galerías irregulares dentro de la hoja que se secan y se ven color café, con un corte en media luna por donde sale la larva."],
      },
      {
        titulo: "Cuándo preocuparse",
        puntos: [
          "Es más común por debajo de 1.300 m, en verano, en años El Niño y en lotes de menos de 18 meses, aunque en el Cauca ya se reporta entre 1.500 y 1.700 m.",
          "Muestreo: 30 árboles y 3 ramas del tercio medio. Si más del 30 % de las hojas tiene minas activas, la situación es crítica; si no, revise cada 8 días.",
        ],
      },
      {
        titulo: "Manejo",
        puntos: ["Conserve sus enemigos naturales dejando arvenses nobles con flor.", "Evite los insecticidas de amplio espectro (piretroides, organofosforados): disparan la plaga."],
      },
    ],
    fuentes: [CENICAFE_MANUAL_T2, BOLETIN_20],
  },
  {
    id: "phoma",
    categoria: "enfermedades",
    titulo: "Muerte descendente (Phoma)",
    resumen: "Brotes que se ennegrecen de la punta hacia abajo, en zonas con viento frío.",
    palabras: ["phoma", "muerte descendente", "brotes negros", "viento frio", "boro"],
    secciones: [
      {
        titulo: "Cómo reconocerla",
        puntos: ["Manchas oscuras en hojas y brotes tiernos, y el brote se seca desde la punta hacia abajo hasta el tejido leñoso.", "Los síntomas salen de 4 a 9 días después de la infección.", "Se diferencia de la falta de boro en que esta no produce necrosis."],
      },
      {
        titulo: "Manejo",
        puntos: ["Proteja el lote de las corrientes de aire frío con barreras vivas o sombra.", "Pode los brotes afectados y consulte con el extensionista si hace falta fungicida."],
      },
    ],
    fuentes: [{ texto: `${ENFERMEDADES}, cap. 14`, url: "https://biblioteca.cenicafe.org/bitstream/10778/993/16/14.%20Muerte%20descendente.pdf" }],
  },
  {
    id: "coco",
    categoria: "plagas",
    titulo: "Daño de «coco» (gorgojos de la hoja)",
    resumen: "Hojas comidas por el borde. Información limitada: consulte al extensionista.",
    palabras: ["coco", "gorgojo", "compsus", "epicaerus", "hojas comidas", "mordeduras"],
    secciones: [
      {
        titulo: "Lo que sabemos",
        puntos: [
          "El conjunto de fotos CoffeeLeaf-CO, tomado en cafetales de Santander, llama «coco» al daño que dejan gorgojos de los géneros Compsus y Epicaerus cuando se comen las hojas.",
          "El diagnóstico por foto lo reconoce porque está en ese conjunto, pero no encontramos una guía de manejo de Cenicafé con fuente verificable.",
        ],
      },
      {
        titulo: "Qué hacer",
        puntos: ["Confirme en campo si hay gorgojos en el árbol o en el suelo.", "Pida la recomendación al extensionista del Comité de Cafeteros antes de aplicar cualquier producto."],
      },
    ],
    fuentes: [{ texto: "CoffeeLeaf-CO / DECAFIA v2 (UIS, Zenodo, 2026), CC BY 4.0", url: "https://zenodo.org/records/22756170" }],
  },
  {
    id: "ojo-de-gallo",
    categoria: "enfermedades",
    titulo: "Gotera u ojo de gallo",
    resumen: "Huecos redondos en la hoja donde hay mucha sombra y humedad.",
    palabras: ["ojo de gallo", "gotera", "mycena", "huecos", "sombra densa"],
    secciones: [
      {
        titulo: "Cómo reconocerla",
        puntos: ["Lesiones redondas de 6 a 10 mm, gris claro con el centro casi blanco; el tejido se cae y deja un hueco.", "Puede haber decenas de lesiones por hoja y también aparece en los frutos."],
      },
      {
        titulo: "Manejo",
        puntos: ["Es un problema de sombra densa, poca luz y mucha lluvia.", "Regule la sombra y airee el cafetal. Cenicafé no recomendaba control químico en Colombia."],
      },
    ],
    fuentes: [{ texto: `${ENFERMEDADES}, cap. 16`, url: "https://biblioteca.cenicafe.org/bitstream/10778/993/18/16.%20Gotera.pdf" }],
  },
  {
    id: "llaga-macana",
    categoria: "enfermedades",
    titulo: "Llaga macana",
    resumen: "Árboles que se marchitan uno a uno. Entra por las heridas.",
    palabras: ["llaga macana", "ceratocystis", "marchitez", "heridas", "corteza"],
    secciones: [
      {
        titulo: "Cómo reconocerla",
        puntos: ["Árboles salteados en el lote que se ponen amarillos, se marchitan y se secan; en las zocas, no brotan.", "Al raspar la corteza se ven lesiones pardo oscuras endurecidas en la madera."],
      },
      {
        titulo: "Manejo",
        puntos: ["Evite herir los árboles con la guadaña o el machete.", "Zoquee y pode en época seca y proteja el corte enseguida.", "Desinfecte las herramientas, por ejemplo con hipoclorito de sodio al 5 %."],
      },
    ],
    fuentes: [{ texto: `${ENFERMEDADES}, cap. 13`, url: "https://biblioteca.cenicafe.org/bitstream/10778/993/15/13.%20Llaga%20macana.pdf" }],
  },
  {
    id: "floracion",
    categoria: "cultivo",
    titulo: "La floración y el calendario",
    resumen: "Anotar la fecha de cada floración es lo que más rinde en este cuaderno.",
    palabras: ["floracion", "flor", "calendario", "cosecha", "mitaca", "32 semanas", "lluvia"],
    secciones: [
      {
        titulo: "Qué la dispara",
        puntos: ["Un verano de más de 10 días seguido de una lluvia de más de 10 mm: la flor abre de 7 a 10 días después.", "En la zona sur (Cauca, Nariño, Huila) la floración principal suele ser en septiembre y octubre, y entre el 90 y el 95 % de la cosecha cae en el primer semestre."],
      },
      {
        titulo: "Del día de la flor a la cosecha",
        puntos: [
          "Días 0 a 50: el fruto crece despacio.",
          "Días 50 a 120: crece rápido; la semilla es gelatinosa.",
          "Días 120 a 180: se llena la almendra. Entre los días 50 y 180 el fruto pide más agua y abono.",
          "Días 180 a 224: madura. El pico de la cosecha llega unas 32 semanas después de la flor.",
        ],
      },
      {
        titulo: "Cómo registrarla",
        puntos: ["Anote cada floración por lote, con su fecha y si fue buena o escasa, y marque cuál es la principal.", "Con esa fecha la app calcula la primera aplicación contra la roya, los muestreos y la cosecha."],
      },
    ],
    fuentes: [{ texto: "Cenicafé, Avance Técnico 441 (2014)", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/489/1/avt0441.pdf" }, { texto: "Ramírez et al., Manual del cafetero t. 1 (Cenicafé, 2013)", url: "https://biblioteca.cenicafe.org/bitstream/10778/4322/1/cenbook-0026_10.pdf" }],
  },
  {
    id: "fertilizacion",
    categoria: "cultivo",
    titulo: "Fertilización por análisis de suelo",
    resumen: "Cuánto y cuándo abonar, con el criterio base de Cenicafé.",
    palabras: ["fertilizacion", "abono", "abonar", "analisis de suelo", "nitrogeno", "potasio", "cal", "encalado"],
    secciones: [
      {
        titulo: "El análisis de suelo",
        puntos: ["Tome la muestra 3 o 4 meses después de la última abonada o encalada, con el suelo ni muy húmedo ni muy seco.", "Un pH entre 5,0 y 5,5 es el adecuado; por debajo de 5,0 o con aluminio alto, toca encalar."],
      },
      {
        titulo: "Cuánto (criterio base en producción)",
        puntos: [
          "Por hectárea y por año: 300 kg de nitrógeno (N), 260 de potasio (K₂O) y unos 50 de fósforo (P₂O₅), magnesio (MgO) y azufre (S), en cafetales de 7.500 a 10.000 árboles con poca sombra.",
          "Con más sombra o menos árboles se abona menos: con 45 a 55 % de sombra, la mitad; con más de 55 %, no se abona.",
          "Kilos de producto = kilos de nutriente × 100 ÷ porcentaje del producto. Ejemplo: 300 kg de N con un 20-4-18 son 1.500 kg del producto al año.",
          "En levante: unos 60 g de N por planta en los primeros 18 meses.",
        ],
      },
      {
        titulo: "Cuándo",
        puntos: ["Al empezar las lluvias, normalmente en dos aplicaciones al año.", "En la zona sur, entre mediados de octubre y mediados de noviembre queda antes de la mayor demanda del fruto."],
      },
    ],
    fuentes: [{ texto: "Sadeghian, Avance Técnico 424 (Cenicafé, 2012)", url: "https://biblioteca.cenicafe.org/bitstream/10778/1107/3/avt0424.pdf" }, { texto: "Sadeghian, Avance Técnico 497 (Cenicafé, 2018)", url: "https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/download/167/133" }],
  },
  {
    id: "renovacion",
    categoria: "cultivo",
    titulo: "Densidad y renovación",
    resumen: "Cuántos árboles caben por hectárea y cuándo renovar.",
    palabras: ["densidad", "arboles por hectarea", "renovacion", "zoca", "siembra", "tres bolillo", "distancia"],
    secciones: [
      {
        titulo: "Densidad",
        puntos: [
          "Árboles por hectárea = 10.000 ÷ (distancia entre surcos × distancia entre plantas, en metros). En tres bolillo, multiplique por 1,154.",
          "En la zona sur, Cenicafé recomienda unos 8.000 árboles por hectárea de Castillo, 5.000 de Tabi y hasta 10.000 de Cenicafé 1.",
        ],
      },
      {
        titulo: "Renovación",
        puntos: [
          "Para que la producción no suba y baje, renueve por quintas partes: el 80 % en producción y el 20 % renovado cada año.",
          "Renueve a las 4 o 5 cosechas. La zoca se corta a 30 cm del suelo, dejando 1 o 2 brotes por sitio.",
          "Donde la cosecha principal es en el primer semestre, renueve en el segundo, con cosecha sanitaria antes.",
        ],
      },
    ],
    fuentes: [{ texto: "Rendón (Cenicafé, 2020), Administración de sistemas de producción de café a libre exposición solar", url: "https://biblioteca.cenicafe.org/bitstream/10778/4229/3/Cap2.pdf" }],
  },
  {
    id: "recoleccion-y-beneficio",
    categoria: "cosecha",
    titulo: "Recolección y beneficio",
    resumen: "De la rama al pergamino seco sin perder calidad.",
    palabras: ["recoleccion", "cosecha", "verdes", "mediverdes", "despulpar", "fermentacion", "lavado", "secado", "humedad"],
    secciones: [
      {
        titulo: "Recolección",
        puntos: ["Una buena recolección lleva más de 80 % de frutos maduros y menos de 2,5 % de verdes (con el Mediverdes, hasta 6 verdes por recipiente).", "Donde hay dos cosechas puede haber más de 20 pases al año, cada 14 a 24 días."],
      },
      {
        titulo: "Beneficio",
        puntos: [
          "Despulpe el mismo día: más de 6 horas de espera causa defectos.",
          "Fermentación natural de unas 12 a 16 horas; pasar de 18 horas o mezclar cafés de días distintos da vinagre y negros.",
          "Secado al sol: de 5 a 20 días según el clima, en capa de no más de 2,5 a 3 cm, revolviendo al menos 4 veces al día. En secador, aire por debajo de 50 °C.",
          "El pergamino se vende con 10 % a 12 % de humedad.",
        ],
      },
    ],
    fuentes: [{ texto: "Peñuela y Sanz (Cenicafé, 2021)", url: "https://biblioteca.cenicafe.org/bitstream/10778/4289/1/189-218.pdf" }, { texto: "Puerta, Avance Técnico 276 (Cenicafé, 2000)", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/561/1/avt0276.pdf" }],
  },
  {
    id: "unidades-y-precio",
    categoria: "cosecha",
    titulo: "Unidades, factor de rendimiento y precio",
    resumen: "Arrobas, cargas, factor 94 y cómo se calcula lo que le pagan.",
    palabras: ["arroba", "carga", "kilos", "pergamino", "factor de rendimiento", "fr", "precio", "pasilla", "excelso", "conversion"],
    secciones: [
      {
        titulo: "Unidades",
        puntos: ["1 arroba = 12,5 kg y 1 carga = 125 kg de café pergamino seco.", "Unos 5 kg de cereza dan 1 kg de pergamino seco (factor 0,20), y 1 kg de pergamino da 0,8 kg de café verde."],
      },
      {
        titulo: "Factor de rendimiento",
        puntos: [
          "Es cuántos kilos de pergamino seco se necesitan para sacar un saco de 70 kg de café excelso. Desde el 1 de abril de 2024 la base es 94.",
          "Entre más bajo el factor, mejor el café y mejor el precio. Con factor 100 la carga vale menos que con 94.",
          "Excelso por carga = 125 × 70 ÷ factor. Lo que no es excelso se paga como pasilla.",
        ],
      },
      {
        titulo: "El precio",
        puntos: ["La FNC publica cada día el precio interno de referencia por carga con factor 94, a partir de la bolsa de Nueva York y la tasa de cambio.", "La cooperativa descuenta el acopio, y hay descuentos por defectos de taza."],
      },
    ],
    fuentes: [{ texto: "Cenicafé, Avance Técnico 370 (2008)", url: "https://biblioteca.cenicafe.org/jspui/bitstream/10778/358/1/avt0370.pdf" }, { texto: "FNC, precio interno de referencia", url: "https://federaciondecafeteros.org/wp-content/uploads/2026/03/precio_cafe.pdf" }],
  },
];

export const guia = (id) => GUIAS.find((item) => item.id === id) ?? null;
