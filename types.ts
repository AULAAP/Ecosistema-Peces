
/* --- FILE: types.ts --- */
export enum ContactStatus {
  PENDING = 'pendiente',
  SENT = 'enviado',
  FAILED = 'error'
}

export interface Meeting {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  coordinates?: string;
  zone: string;
  description?: string;
  groupLink?: string; // Enlace del grupo de WhatsApp
}

export interface ChurchLeader {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  churchName: string;
  community: string;
  zone: string;
  meetingId: string;
  status: ContactStatus;
  booksCount: number;
  responsibleEntity: string;
  lastContactDate?: string;
  suggestedVenue?: string; // Nueva propiedad para la sede del Excel
}

export interface ZoneStats {
  zone: string;
  churchCount: number;
}

export type ViewType = 'dashboard' | 'churches' | 'meetings' | 'whatsapp' | 'meeting-detail' | 'capacitacion' | 'capacitacion-b' | 'aulaapp' | 'clusters' | 'churches-training' | 'plan' | 'progress-training' | 'dashboard-training';

export interface WeeklyPlan {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    topics: string[];
    youtubeUrl: string;
    date: string;
    weekNumber: number;
    // Legacy mapping for TopicCard and other components
    topic: string;
    videoTitle: string;
    videoUrl: string;
    question: string;
    lessonObjective: string;
}

export interface TrainingTopic {
    id: string;
    title: string;
    content: string;
    category: 'liderazgo' | 'metodologia' | 'crecimiento';
    videoUrl: string;
}

export interface TrainingChurch {
    id: number;
    name: string;
}

export interface Cluster {
    id: number;
    name: string;
    churchIds: number[];
}
