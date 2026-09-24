import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';

import caficultor from '@/assets/imagenes/caficultor.jpg';
import broca from '@/assets/imagenes/Broca.jpg';
import cultivo from '@/assets/imagenes/cosecha.webp';

const tarjetas = [
  {
    titulo: "Cultivos activos",
    dato: "4 Lotes",
    descripcion: "Variedad Castillo y Colombia",
    ancho: "85%",
    eficiencia: "85%"
  },
  {
    titulo: "Alertas Pendientes",
    dato: "2 Activas",
    descripcion: "Requieren revisión en lote",
    ancho: "92%",
    eficiencia: "92%"
  },
  {
    titulo: "Consultas Chat Bot",
    dato: "15 Asesorías",
    descripcion: "Este mes",
    ancho: "78%",
    eficiencia: "78%"
  },
  {
    titulo: "Estado del cultivo",
    dato: "En riesgo",
    descripcion: "Humedad alta detectada",
    ancho: "89%",
    eficiencia: "89%",
    riesgo: true
  }
];

const barras = [
  { alto: "30%", clase: "bg-[#7bc142]" },
  { alto: "80%", clase: "bg-[#7bc142]" },
  { alto: "95%", clase: "bg-[#7bc142]" },
  { alto: "70%", clase: "bg-[#7bc142]" },
  { alto: "50%", clase: "bg-[#7bc142]" }
];

const recomendaciones = [
  "Optimización del abonado",
  "Monitoreo preventivo",
  "Manejo de sombra"
];

const filtros = [
  "Fase",
  "Variedad café",
  "Clima"
];

const registros = [
  {
    subtitulo: "Registro 1:",
    lote: "Lote: El placer",
    alerta: "Alerta de Broca",
    afectacion: "Media",
  }
];
