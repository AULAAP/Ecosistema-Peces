
import type { Church, Cluster } from './types';

// Helper to clean YouTube URLs, removing list parameters etc.
const cleanYouTubeUrl = (url: string): string => {
  try {
    if (!url) return '';
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      // For youtu.be links, the ID is the pathname
      return `https://www.youtube.com/watch?v=${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
  } catch (e) {
    // a non-valid URL might be passed, just return the original
    return url;
  }
  return url; // fallback to original if parsing fails
};

export const weeklyPlanData = [
  // --- MES 1 ---
  {
    weekNumber: 1,
    topic: '7 Maneras de dar la bienvenida',
    videoTitle: '7 Maneras de dar la bienvenida a niños y adolescentes a la clase de escuela dominical',
    question: '¿Cuál consideras que es la forma de bienvenida que mejor resultado daría en tu escuela dominical?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/U-BzQNmEq3Q')
  },
  {
    weekNumber: 2,
    topic: 'La Ventana 4/14',
    videoTitle: 'La Ventana 4/14',
    question: '¿Por qué es importante ministrar a los niños entre 4 y 14 años?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/4faqtFvXlNE')
  },
  {
    weekNumber: 3,
    topic: 'Josué',
    videoTitle: 'Josué',
    question: '¿Cuáles son los riesgos de no ministrar a la próxima generación de creyentes?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/HNP2TB94ER4')
  },
  {
    weekNumber: 4,
    topic: 'Mensaje para Maestros',
    videoTitle: 'Un Mensaje Para Los Maestros de Niños en la Iglesia',
    question: 'Durante la pandemia, Sixto Porras dio un mensaje para los maestros. ¿Cuáles de estos principios aplican para hoy en día?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/c-Y1x4spZQU')
  },

  // --- MES 2 ---
  {
    weekNumber: 5,
    topic: 'El mejor provecho 1',
    videoTitle: 'El mejor provecho 1',
    question: '¿En qué consiste el Mundo de Abby, cuál es su propósito y cómo puedo apoyar a su expansión?',
    lessonObjective: 'Los maestros conocen acerca del Mundo de Abby.',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=DDINvnQPUIo')
  },
  {
    weekNumber: 6,
    topic: 'Enseñar Versículos',
    videoTitle: '7 Maneras de enseñar versículos de la Palabra de Dios a los niños',
    question: '¿Cuál ha sido la forma más creativa en que te han enseñado un verso de la Biblia?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/7DnRtZgH-Ks')
  },
  {
    weekNumber: 7,
    topic: 'Errores a Evitar',
    videoTitle: 'Los errores que debes evitar como maestro',
    question: '¿Cuáles son los errores que más se cometen entre los líderes de escuela dominical que conoces? Elige uno y explícalo.',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/M3MsUeHi984')
  },
  {
    weekNumber: 8,
    topic: 'Organizar la Escuela Dominical',
    videoTitle: '6 Formas de organizar la Escuela Dominical',
    question: '¿Cuál fue la forma de organizar la escuela que más te gustó? ¿Por qué?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/Z1-uPV3ECoA')
  },

  // --- MES 3 ---
  {
    weekNumber: 9,
    topic: 'Retos al Equipar',
    videoTitle: 'Los retos de la Iglesia al equipar a los niños',
    question: '¿Qué retos tiene tu iglesia para discipular a los niños?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/jtpt0Ljal7w')
  },
  {
    weekNumber: 10,
    topic: 'Niños Agentes de Cambio',
    videoTitle: 'Los niños como agentes de cambio',
    question: '¿Cómo puede el Señor usar a los niños en tu comunidad?',
    lessonObjective: 'La iglesia integra a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/bhxcljj_ock')
  },
  {
    weekNumber: 11,
    topic: 'Es tiempo de despertar',
    videoTitle: 'Es tiempo de despertar',
    question: '¿Por qué es tiempo de despertar?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=DTqxzYUMb7k')
  },
  {
    weekNumber: 12,
    topic: 'Todos juntos inteligentes',
    videoTitle: 'Todos juntos somos más inteligentes',
    question: '¿Cuál fue el trabajo de cada insecto? ¿Quién fue el líder? ¿En qué se parece al trabajo con los niños?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=3j0D7AQmLok')
  },

  // --- MES 4 ---
  {
    weekNumber: 13,
    topic: 'El mejor provecho 2',
    videoTitle: 'El mejor provecho 2',
    question: '¿Cuál es el propósito educativo del Mundo de Abby? ¿Cuáles son las características de los niños de 3 a 9 años?',
    lessonObjective: 'Los maestros incrementan su conocimiento del Mundo de Abby.',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=DDINvnQPUIo')
  },
  {
    weekNumber: 14,
    topic: 'Ayudar a otros a crecer',
    videoTitle: 'Ayudar a otros a crecer',
    question: '¿Cómo puede tu iglesia motivar a los adolescentes a discipular a otros?',
    lessonObjective: 'La iglesia integra a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/xJksYNqC-ig')
  },
  {
    weekNumber: 15,
    topic: 'El mejor provecho 3',
    videoTitle: 'El mejor provecho 3',
    question: 'Da dos ejemplos de cómo puedes actuar como mediador. ¿Cómo sacar el mejor provecho del Mundo de Abby?',
    lessonObjective: 'El maestro como mediador de conocimientos.',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=KWIfQMtnttU')
  },
  {
    weekNumber: 16,
    topic: 'Liderazgo y Equipo',
    videoTitle: 'Liderazgo y Trabajo en Equipo',
    question: '¿Qué aprendiste de este video sobre el liderazgo y el trabajo en equipo?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/jW5KN4Kvpw0')
  },

  // --- MES 5 ---
  {
    weekNumber: 17,
    topic: 'Para Principiantes',
    videoTitle: 'Para principiantes en la Escuela Dominical de niños',
    question: 'Si tuvieras que dar un consejo para un nuevo maestro de escuela dominical. ¿Qué consejo le darías?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/1n4Xhlwsuhw')
  },
  {
    weekNumber: 18,
    topic: 'El mejor provecho 4',
    videoTitle: 'El mejor provecho 4',
    question: '¿Cuáles estrategias de evaluación y apoyo puedes utilizar en el discipulado del Mundo de Abby?',
    lessonObjective: 'Los maestros se equipan en diversas estrategias.',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=DDINvnQPUIo')
  },
  {
    weekNumber: 19,
    topic: 'Juventud Globalizada',
    videoTitle: 'Juventud Globalizada',
    question: '¿Qué oportunidades ves en que los jóvenes de hoy sean diferentes?',
    lessonObjective: 'La iglesia integra a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/BRcyVxJ0L6M')
  },
  {
    weekNumber: 20,
    topic: 'La maestra Thompson',
    videoTitle: 'La maestra Thompson',
    question: 'Menciona tres cualidades de la señorita Thompson que tú puedes imitar.',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=d5uipo2DXho')
  },

  // --- MES 6 ---
  {
    weekNumber: 21,
    topic: 'Me has perdido',
    videoTitle: 'Me has perdido',
    question: '¿Por qué crees que algunos jóvenes se van de las iglesias?',
    lessonObjective: 'La iglesia discipula a los niños',
    videoUrl: cleanYouTubeUrl('https://youtu.be/4r8H4j3SYW4')
  },
  {
    weekNumber: 22,
    topic: '9 Tipos de Inteligencias',
    videoTitle: '9 Tipos de Inteligencias',
    question: '¿Cuál es el tipo de inteligencia que más identificas en los niños? ¿Cómo aprovecharlo?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/rxlZgY0icEQ')
  },
  {
    weekNumber: 23,
    topic: 'No te rindas',
    videoTitle: 'No te rindas',
    question: 'En este video hay un mensaje del Señor para ti. ¿Qué es lo que más te gustó?',
    lessonObjective: 'La iglesia equipa a sus maestros',
    videoUrl: cleanYouTubeUrl('https://youtu.be/Q-SEaqvjNms')
  },
  {
    weekNumber: 24,
    topic: 'Dengue',
    videoTitle: 'Dengue y Prevención',
    question: '¿Cómo puede la iglesia ser un lugar seguro y saludable para los niños?',
    lessonObjective: 'La iglesia protege a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=mAUNQcyCNd0')
  },

  // --- MES 7 ---
  {
    weekNumber: 25,
    topic: 'El poder del maestro',
    videoTitle: 'El poder del maestro',
    question: '¿Qué es lo que más te gustó del video sobre el poder del maestro?',
    lessonObjective: 'La iglesia protege a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=BoVuU7mtHuc')
  },
  {
    weekNumber: 26,
    topic: 'Silencio en el aula',
    videoTitle: '3 Estrategias para Conseguir SILENCIO en el aula',
    question: '¿Qué es lo que más te gustó de estas estrategias para conseguir silencio?',
    lessonObjective: 'La iglesia protege a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=abUONR_5Ors')
  },
  {
    weekNumber: 27,
    topic: 'Control de grupo',
    videoTitle: 'Estrategias para grupos ruidosos - control de grupo',
    question: '¿Qué es lo que más te gustó de estas estrategias de control de grupo?',
    lessonObjective: 'La iglesia protege a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=9CX7e8flY6U')
  },
  {
    weekNumber: 28,
    topic: 'Canciones para Silencio',
    videoTitle: 'Canciones para hacer Silencio',
    question: '¿Qué es lo que más te gustó de estas canciones para hacer silencio?',
    lessonObjective: 'La iglesia protege a los niños',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=vtxOdLPWTHs')
  },

  // --- TEMAS ADICIONALES RESTAURADOS ---
  {
    weekNumber: 29,
    topic: 'Disciplina con Amor',
    videoTitle: 'Cómo aplicar disciplina en el aula',
    question: '¿Qué estrategia de disciplina positiva puedes implementar con un alumno difícil?',
    lessonObjective: 'Gestionar el comportamiento en el aula con principios bíblicos.',
    videoUrl: cleanYouTubeUrl('https://youtu.be/M3MsUeHi984')
  },
  {
    weekNumber: 30,
    topic: 'El Arte de Contar Historias',
    videoTitle: 'Tips para narrar historias bíblicas',
    question: '¿Qué elemento sorpresa puedes añadir a tu lección esta semana para captar mejor la atención?',
    lessonObjective: 'Comunicar el evangelio de forma cautivadora y memorable.',
    videoUrl: cleanYouTubeUrl('https://youtu.be/Z1-uPV3ECoA')
  },
  {
    weekNumber: 31,
    topic: 'Dinámicas y Juegos',
    videoTitle: 'El juego como herramienta de aprendizaje',
    question: '¿Cómo puedes asegurar que tus juegos tengan un propósito bíblico intencional?',
    lessonObjective: 'Utilizar el juego como un vehículo efectivo de aprendizaje bíblico.',
    videoUrl: cleanYouTubeUrl('https://youtu.be/U-BzQNmEq3Q')
  },
  {
    weekNumber: 32,
    topic: 'Involucrando a los Padres',
    videoTitle: 'Trabajando en equipo con la familia',
    question: '¿Qué idea sencilla podrías enviar a los padres esta semana para reforzar la lección en casa?',
    lessonObjective: 'Establecer una alianza sólida entre la iglesia y el hogar.',
    videoUrl: cleanYouTubeUrl('https://youtu.be/jtpt0Ljal7w')
  },
  {
    weekNumber: 33,
    topic: 'Evaluación del Ministerio',
    videoTitle: 'Evaluando nuestro servicio',
    question: 'Si le preguntaras a tus alumnos qué es lo que más les gusta de la clase, ¿qué dirían?',
    lessonObjective: 'Medir el impacto y buscar la mejora continua en el ministerio.',
    videoUrl: cleanYouTubeUrl('https://youtu.be/Q-SEaqvjNms')
  },
  {
    weekNumber: 34,
    topic: 'Herramientas Digitales',
    videoTitle: 'Cómo acceder a For children?',
    question: '¿Cómo podemos aprovechar las herramientas digitales para potenciar el ministerio?',
    lessonObjective: 'Integrar recursos tecnológicos en la capacitación y enseñanza.',
    videoUrl: cleanYouTubeUrl('https://www.youtube.com/watch?v=BtWjqu5Hw_U')
  }
];

export const churchesData: Church[] = [
  { id: 1, name: 'Iglesia Central' },
  { id: 2, name: 'Misión del Norte' },
  { id: 3, name: 'Comunidad de Fe' },
  { id: 4, name: 'Templo Betania' },
  { id: 5, name: 'Asamblea del Sur' },
  { id: 6, name: 'Iglesia del Este' },
  { id: 7, name: 'Centro Cristiano Oeste' },
  { id: 8, name: 'Iglesia La Roca' },
  { id: 9, name: 'Misión Buenas Nuevas' },
  { id: 10, name: 'Comunidad Emanuel' },
];

export const clustersData: Cluster[] = [
    { id: 1, name: 'Cluster Central', churchIds: [1, 3, 8] },
    { id: 2, name: 'Misión Costa', churchIds: [2, 5, 6, 7] },
    { id: 3, name: 'Alianza del Evangelio', churchIds: [4, 9, 10] },
];
