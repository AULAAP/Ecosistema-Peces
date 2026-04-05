
/* --- FILE: constants.tsx --- */
import { ChurchLeader, Meeting, TrainingTopic } from './types';

export const INITIAL_MEETINGS: Meeting[] = [];
export const INITIAL_CHURCHES: ChurchLeader[] = [];
export const ZONES = [
  'Santo Domingo Norte',
  'Santo Domingo Este',
  'Distrito Nacional',
  'Zona Norte',
  'Zona Sur',
  'Zona Este'
];

export const INITIAL_WEEKLY_PLANS = [
  {
    id: '1',
    title: 'Fundamentos del Crecimiento',
    description: 'Estrategias básicas para la expansión del reino en comunidades locales.',
    isCompleted: false,
    topics: ['Visión 2026', 'Discipulado 1 a 1', 'Grupos Pequeños'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    date: '2026-03-10'
  },
  {
    id: '2',
    title: 'Liderazgo Territorial',
    description: 'Cómo gestionar múltiples iglesias y líderes de zona.',
    isCompleted: false,
    topics: ['Gestión de Crisis', 'Mentoreo de Pastores', 'Logística de Eventos'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    date: '2026-03-17'
  }
];

export const TRAINING_TOPICS: TrainingTopic[] = [
  {
    id: 't1',
    title: 'El ADN del Líder',
    content: 'Exploramos las cualidades espirituales y emocionales de un líder efectivo.',
    category: 'liderazgo',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 't2',
    title: 'Metodología de Peces',
    content: 'Paso a paso de cómo implementar el sistema de pesca en tu zona.',
    category: 'metodologia',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];
