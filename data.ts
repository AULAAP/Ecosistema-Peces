import { WeeklyPlan, TrainingChurch, Cluster } from './types';

export const weeklyPlanData: WeeklyPlan[] = [
    {
        weekNumber: 1,
        topic: "Fundamentos del Ecosistema",
        videoTitle: "Introducción al Liderazgo Peces",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        question: "¿Cómo visualizas el crecimiento de tu zona en los próximos 6 meses?",
        lessonObjective: "Comprender la estructura y los valores fundamentales del ecosistema.",
        isCompleted: false
    },
    {
        weekNumber: 2,
        topic: "Gestión de Equipos",
        videoTitle: "Dinámicas de Grupo Efectivas",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        question: "¿Qué cualidades buscas en un nuevo líder de iglesia?",
        lessonObjective: "Aprender técnicas para motivar y coordinar equipos de trabajo.",
        isCompleted: false
    }
];

export const churchesData: TrainingChurch[] = [
    { id: 1, name: "Iglesia Central" },
    { id: 2, name: "Templo Betania" },
    { id: 3, name: "Misión Esperanza" }
];

export const clustersData: Cluster[] = [
    { id: 1, name: "Zona Norte", churchIds: [1, 2] },
    { id: 2, name: "Zona Sur", churchIds: [3] }
];
