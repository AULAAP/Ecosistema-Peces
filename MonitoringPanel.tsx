
import React from 'react';
import type { WeeklyPlan } from '../types';
import YouTubeIcon from './icons/YoutubeIcon';
import WhatsAppIcon from './icons/WhatsappIcon';

interface TopicCardProps {
  plan: WeeklyPlan;
  onToggleComplete: (weekNumber: number) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ plan, onToggleComplete }) => {
  const { weekNumber, topic, videoTitle, videoUrl, question, lessonObjective, isCompleted } = plan;

  const handleShare = () => {
    if (!isCompleted) {
      onToggleComplete(weekNumber);
    }
    const message = `¡Hola equipo de líderes! 🌟\n\n*Semana ${weekNumber}: ${topic}*\n\nEsta semana, nuestro enfoque de capacitación es sobre *${topic}*.\n\n*🎯 Objetivo:* ${lessonObjective}\n\nPor favor, vean este video:\n${videoUrl}\n\nPara nuestra próxima reunión, reflexionemos sobre esta pregunta:\n*${question}*\n\n¡Será de gran bendición!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleCheckboxChange = () => {
    onToggleComplete(weekNumber);
  };

  // Colores dinámicos basados en el estado
  const headerColor = isCompleted ? 'bg-teal-500' : 'bg-indigo-600';
  const ringColor = 'bg-slate-200';
  const weekNumColor = isCompleted ? 'text-teal-600' : 'text-slate-800';

  return (
    <div className="group relative h-full flex flex-col transition-transform duration-300 hover:-translate-y-1.5">
      
      {/* --- Spiral Binding Effect (Top) --- */}
      <div className="absolute -top-3 left-0 w-full z-20 flex justify-evenly px-4 pointer-events-none">
         {[...Array(6)].map((_, i) => (
            <div key={i} className="w-3 h-6 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-full shadow-sm border border-slate-400/30"></div>
         ))}
      </div>

      {/* --- Calendar Sheet --- */}
      <div className="relative flex flex-col flex-grow bg-white rounded-b-xl rounded-t-lg shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden">
        
        {/* Header Strip */}
        <div className={`${headerColor} h-14 w-full flex items-center justify-between px-4 pt-2 relative`}>
            {/* Holes for spiral */}
            <div className="absolute top-1 left-0 w-full flex justify-evenly px-4 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-slate-800/30 rounded-full"></div>
                ))}
            </div>
            
            <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest mt-2">Plan de Liderazgo</span>
            
            {/* Checkbox inside Header */}
            <div className="mt-2 relative z-10">
               <label className="relative inline-flex items-center cursor-pointer group-checkbox">
                 <input 
                    type="checkbox" 
                    checked={isCompleted}
                    onChange={handleCheckboxChange}
                    className="sr-only peer"
                 />
                 <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${isCompleted ? 'bg-white border-white text-teal-600' : 'border-white/60 bg-white/20 hover:bg-white/30 text-transparent'}`}>
                    <svg className={`w-4 h-4 transform transition-transform ${isCompleted ? 'scale-100' : 'scale-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                 </div>
               </label>
            </div>
        </div>

        {/* Main Content */}
        <div className="p-5 flex flex-col flex-grow relative">
            {/* "Paper" texture/noise optional - keeping it clean white for now */}
            
            <div className="flex gap-4 items-start mb-4 pb-4 border-b border-slate-100 border-dashed">
                {/* Calendar Number Date Style */}
                <div className="flex flex-col items-center justify-center min-w-[4.5rem] border-r border-slate-100 border-dashed pr-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Semana</span>
                    <span className={`text-5xl font-black leading-none tracking-tighter ${weekNumColor}`}>
                        {weekNumber}
                    </span>
                </div>
                
                <div className="flex-grow pt-1">
                    <h3 className={`text-base font-bold leading-tight font-sans ${isCompleted ? 'text-slate-400 line-through decoration-2 decoration-slate-300' : 'text-slate-800'}`}>
                        {topic}
                    </h3>
                </div>
            </div>
        
            <div className="space-y-3 flex-grow">
                {/* Objective Section */}
                <div className="bg-slate-50 rounded-lg p-3 border-l-4 border-indigo-200">
                    <p className="text-slate-700 text-xs leading-relaxed font-medium italic">
                        "{lessonObjective}"
                    </p>
                </div>

                {/* Resource Link */}
                <div>
                    <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:shadow-md hover:shadow-red-100 transition-all group"
                    >
                        <div className="bg-red-50 p-1.5 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                            <YouTubeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Ver Recurso</span>
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-red-600 truncate leading-tight">{videoTitle}</span>
                        </div>
                    </a>
                </div>

                {/* Question Section */}
                <div className="pt-1">
                    <div className="flex items-start gap-2">
                        <span className="text-lg leading-none">💬</span>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            {question}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer / Action */}
            <div className="mt-5 pt-2">
                <button
                    onClick={handleShare}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wide rounded-xl text-white shadow-md transform transition-all duration-200 active:scale-95
                    ${isCompleted 
                        ? 'bg-slate-400 hover:bg-slate-500' 
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 hover:shadow-lg hover:shadow-blue-500/30'
                    }`}
                >
                    <WhatsAppIcon className="h-4 w-4" />
                    {isCompleted ? 'Compartir de Nuevo' : 'Compartir Lección'}
                </button>
            </div>

            {/* Completion Stamp Effect */}
            {isCompleted && (
                <div className="absolute bottom-20 right-4 opacity-20 pointer-events-none rotate-[-15deg]">
                    <div className="border-4 border-teal-600 text-teal-600 px-4 py-2 rounded-lg text-2xl font-black uppercase tracking-widest select-none">
                        Completado
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
