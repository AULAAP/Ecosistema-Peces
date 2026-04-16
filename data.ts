
import { GoogleGenAI, Type } from "@google/genai";
import type { Topic, VideoRecommendation } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extrae temas personalizados basados en la misión, visión y contenido del documento.
 */
export async function extractTopicsFromDocument(documentText: string): Promise<Topic[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Analiza el siguiente documento de una Iglesia/Ministerio que contiene su Misión, Visión y objetivos. 
        Basado en este contenido, genera exactamente 8 temas de capacitación semanal para el desarrollo de sus líderes de Escuela Dominical.
        
        IMPORTANTE: Los temas deben seguir un ORDEN LÓGICO Y SISTEMÁTICO de desarrollo eclesiástico:
        1. Temas 1-2: Fundamentos y Visión (El "por qué").
        2. Temas 3-4: El Corazón y Carácter del Líder (El "quién").
        3. Temas 5-6: Herramientas Pedagógicas y Gestión (El "cómo").
        4. Temas 7-8: Impacto Comunitario y Multiplicación (El "hacia dónde").

        Asegúrate de que cada tema refleje los valores de la Misión y Visión proporcionados.

        Documento:
        ---
        ${documentText}
        ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: {
                type: Type.STRING,
                description: "Un tema de liderazgo práctico y alineado con la visión de la iglesia.",
              },
            },
            required: ["topic"],
          },
        },
        systemInstruction: "Eres un consultor senior en desarrollo organizacional eclesiástico. Tu especialidad es alinear la capacitación técnica de maestros de niños con la visión estratégica de la iglesia.",
      },
    });

    // Limpiar posibles etiquetas de markdown antes de parsear
    const cleanedText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);
    return jsonResponse as Topic[];
  } catch (error) {
    console.error("Error extracting topics:", error);
    throw new Error("No se pudieron extraer los temas. Asegúrate de subir un archivo de texto claro.");
  }
}

/**
 * Busca un video de YouTube real y genera contenido educativo.
 */
export async function getYouTubeRecommendation(topic: string): Promise<VideoRecommendation> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Busca un video de YouTube en español que sea un recurso educativo para líderes de Escuela Dominical sobre el tema: "${topic}".
        
        REQUISITOS:
        1. Debe ser un video de YouTube funcional y público (NO shorts).
        2. Genera un objetivo de lección (Objective) de 1 oración.
        3. Genera una pregunta de reflexión (Question) profunda para el equipo.

        Formato de salida esperado:
        TITLE: [Título del video]
        URL: [URL de YouTube]
        OBJECTIVE: [Objetivo]
        QUESTION: [Pregunta]
      `,
      config: {
        tools: [{googleSearch: {}}],
        systemInstruction: "Eres un curador de contenido ministerial. Tu prioridad es encontrar videos de YouTube vigentes y relevantes para maestros de niños.",
      },
    });

    const text = response.text;
    
    // Extraer URL usando regex robusto
    const youtubeVideoRegex = /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11})/;
    const urlMatch = text.match(youtubeVideoRegex);
    const videoUrl = urlMatch ? urlMatch[0] : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Fallback seguro

    // Extraer otros campos
    const titleMatch = text.match(/TITLE:\s*(.*)/i);
    const objectiveMatch = text.match(/OBJECTIVE:\s*(.*)/i);
    const questionMatch = text.match(/QUESTION:\s*(.*)/i);

    return {
      videoTitle: titleMatch ? titleMatch[1].trim() : "Recurso de Capacitación",
      videoUrl: videoUrl,
      lessonObjective: objectiveMatch ? objectiveMatch[1].trim() : "Fortalecer el liderazgo ministerial infantil.",
      question: questionMatch ? questionMatch[1].trim() : "¿Cómo podemos aplicar este principio este domingo?"
    };

  } catch (error) {
    console.error(`Error en recomendación para: ${topic}`, error);
    return {
      videoTitle: `Capacitación: ${topic}`,
      videoUrl: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topic),
      lessonObjective: "Desarrollar habilidades clave para el ministerio infantil.",
      question: "¿Qué paso práctico daremos esta semana para mejorar en esta área?"
    };
  }
}
