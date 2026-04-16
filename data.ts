
import { GoogleGenAI } from "@google/genai";
import { ChurchLeader, Meeting } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * GENERADOR DE PLANTILLAS - MOTOR DE REGLAS ESTRICTAS
 * Esta función es el corazón de la comunicación. Solo permite datos verificados.
 */
export const generateWhatsAppTemplate = async (meeting: Meeting, tone: string = 'pastoral y formal'): Promise<string> => {
  try {
    const prompt = `Actúa como un coordinador logístico de "Ecosistema Peces". 
    Tu tarea es redactar una plantilla de invitación para WhatsApp para una reunión de líderes.
    
    REGLAS INNEGOCIABLES DE SEGURIDAD Y PRECISIÓN:
    1. PROHIBIDO INVENTAR: No menciones comida, promesas de refrigerios, transporte, parqueos ni detalles de la agenda que no estén aquí.
    2. EXCLUSIÓN DE DATOS: No incluyas cantidad de libros, entidad responsable, ni la zona territorial en el mensaje.
    3. FUENTE ÚNICA: Usa estrictamente los datos del contexto.
    4. ETIQUETAS PERMITIDAS:
       - {{nombre_completo}}: Líder.
       - {{nombre_iglesia}}: Congregación.
       - {{comunidad}}: Sector.
       - {{reunion_asignada}}: Grupo de reunión.
       - {{fecha}}: Día del evento.
       - {{hora}}: Hora del evento.
       - {{sede}}: Ubicación exacta.

    DATOS DEL EVENTO:
    - Grupo: ${meeting.name}
    - Fecha: ${meeting.date || '[Pendiente]'}
    - Hora: ${meeting.time || '[Pendiente]'}
    - Sede: ${meeting.venue || '[Pendiente]'}
    
    Tono: ${tone}. Breve, respetuoso y logístico.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || 'Error en generación.';
  } catch (error) {
    console.error("Gemini Base Error:", error);
    return `Bendiciones {{nombre_completo}}. Le invitamos a la reunión de {{reunion_asignada}} el día {{fecha}} a las {{hora}} en {{sede}}.`;
  }
};

/**
 * PARSER DE DATOS REALES
 */
export const parseTemplate = (template: string, church: ChurchLeader, meeting: Meeting): string => {
  let message = template;
  message = message.replace(/{{nombre_completo}}/g, church.fullName || '');
  message = message.replace(/{{nombre_iglesia}}/g, church.churchName || '');
  message = message.replace(/{{comunidad}}/g, church.community || '');
  message = message.replace(/{{reunion_asignada}}/g, meeting.name || church.meetingId || '');
  message = message.replace(/{{fecha}}/g, meeting.date || 'Por definir');
  message = message.replace(/{{hora}}/g, meeting.time || 'Por definir');
  message = message.replace(/{{sede}}/g, meeting.venue || 'Por definir');
  return message;
};

/**
 * EXTRACCIÓN DE TEMAS DESDE DOCUMENTO
 */
export const extractTopicsFromDocument = async (text: string): Promise<{ topic: string }[]> => {
  try {
    const prompt = `Analiza el siguiente texto de un programa de capacitación y extrae los temas principales.
    Devuelve una lista de objetos JSON con la propiedad "topic".
    
    TEXTO:
    ${text}
    
    Responde ÚNICAMENTE con el JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const result = JSON.parse(response.text || '[]');
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return [];
  }
};

/**
 * RECOMENDACIÓN DE RECURSOS Y OBJETIVOS
 */
export const getYouTubeRecommendation = async (topic: string): Promise<{ videoTitle: string, videoUrl: string, question: string, lessonObjective: string }> => {
  try {
    const prompt = `Para el tema de capacitación: "${topic}", proporciona:
    1. Un título de video de YouTube relevante.
    2. Una URL de YouTube (puedes usar una de ejemplo si no conoces una exacta).
    3. Una pregunta de reflexión profunda para el líder.
    4. Un objetivo de aprendizaje claro.
    
    Responde en formato JSON con las propiedades: videoTitle, videoUrl, question, lessonObjective.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return {
      videoTitle: "Recurso no disponible",
      videoUrl: "https://www.youtube.com",
      question: "¿Cómo aplicarías este tema en tu contexto?",
      lessonObjective: "Analizar los principios básicos del tema propuesto."
    };
  }
};
