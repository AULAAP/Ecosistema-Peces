
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

export type ViewType = 'dashboard' | 'churches' | 'meetings' | 'whatsapp' | 'meeting-detail' | 'capacitacion' | 'capacitacion-b' | 'clusters' | 'churches-training' | 'plan' | 'progress-training' | 'dashboard-training';

export interface WeeklyPlan {
    weekNumber: number;
    topic: string;
    videoTitle: string;
    videoUrl: string;
    question: string;
    lessonObjective: string;
    isCompleted: boolean;
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
