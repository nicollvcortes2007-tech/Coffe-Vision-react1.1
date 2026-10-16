/*
  Contrato del modelo de hojas de café EfficientNet-B1 (ConnorLee08, Apache-2.0):
  https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2/tree/main/models/b1
  Archivo: public/ia/hoja-cafe-b1.tflite (SHA-256 28c5d1cf…8c75, verificado contra
  provenance.json). Entrada float32 RGB 0..255 NHWC [1,224,224,3]; salida: 8
  probabilidades ya calibradas (temperatura 0,729 incluida en el export).
  Umbrales tomados tal cual de models/b1/model-config.json y brightness-config.json.
*/

export const URL_MODELO = "/ia/hoja-cafe-b1.tflite";
export const URL_RUNTIME = "/ia/litert/";
export const LADO = 224;
export const LADO_CORTO = 256;

export const CLASES = [
  {
    id: "cercospora",
    nombre: "Mancha de hierro",
    cientifico: "Cercospora coffeicola",
    guia: "mancha-de-hierro",
  },
  { id: "healthy", nombre: "Hoja sana", cientifico: null, guia: null },
  { id: "miner", nombre: "Minador de la hoja", cientifico: "Leucoptera coffeella", guia: "minador" },
  { id: "phoma", nombre: "Mancha por Phoma", cientifico: "Phoma spp.", guia: "phoma" },
  { id: "rust", nombre: "Roya del cafeto", cientifico: "Hemileia vastatrix", guia: "roya" },
  { id: "red_spider_mite", nombre: "Arañita roja", cientifico: "Oligonychus yothersi", guia: null, desactivada: true },
  { id: "weevil_damage", nombre: "Daño de coco (gorgojo)", cientifico: "Compsus / Epicaerus", guia: "coco" },
  { id: "unsupported", nombre: "No parece una hoja de café", cientifico: null, guia: null, rechazo: true },
];

// models/b1/model-config.json → calibration (la última posición es «unsupported», que nunca se acepta).
export const UMBRAL_ACEPTAR = [0.835, 0.4, 0.5, 0.635, 0.4, 1.01, 0.4, 1.01];
export const UMBRAL_CONFIADO = [0.97, 0.6, 0.825, 0.87, 0.4, 1.01, 0.4, 1.01];
export const MIN_VARIANZA_BORDES = 1.520114853217684;

// brightness-config.json
export const LUZ = {
  minimo: 40.334103954081634,
  maximo: 199.99709024234693,
  fraccionBrillosMaxima: 0.09255420918367346,
  brillo: 250,
};

export const ENTRENAMIENTO = {
  imagenes: 13085,
  fuentes: "BRACOL (Brasil), RoCoLe (Ecuador), CoffeeLeaf-CO (Santander, Colombia), AgML Arabica (Kenia) y otros, todos CC BY 4.0",
  exactitudInterna: 0.9327,
  aceptadasRoyaHuila: { aceptadas: 22, total: 847 },
};
