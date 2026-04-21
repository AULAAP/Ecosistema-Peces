import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Target, HelpCircle } from 'lucide-react';
import type { WeeklyPlan } from '../types';

interface TopicCardProps {
    plan: WeeklyPlan;
    onToggleComplete: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ plan, onToggleComplete }) => {
    return (
        <div className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-700 subtle-shadow glossy-finish ${plan.isCompleted ? 'border-sea/30 shadow-sea/5' : 'border-slate-100 hover:border-royal/30 hover:shadow-2xl'}`}>
            
            {/* Status Badge */}
            <div className="absolute -top-4 -right-4 z-10 transition-transform group-hover:scale-110">
                <button 
                    onClick={onToggleComplete}
                    className={`flex items-center justify-center w-12 h-12 rounded-[1.25rem] shadow-xl transition-all duration-500 active:scale-90 ${plan.isCompleted ? 'bg-sea text-white rotate-0 shadow-sea/20' : 'bg-white text-slate-300 hover:text-royal rotate-12 group-hover:rotate-0'}`}
                >
                    {plan.isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                </button>
            </div>

            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-lg bg-royal/5 text-royal text-[9px] font-black uppercase tracking-widest mb-4 border border-royal/10">
                        Módulo {plan.weekNumber}
                    </span>
                    <h3 className={`text-xl font-black tracking-tight leading-tight transition-colors ${plan.isCompleted ? 'text-slate-400' : 'text-slate-800'}`}>
                        {plan.topic}
                    </h3>
                </div>

                <div className="space-y-6 flex-grow">
                    {/* Objective */}
                    <div className="flex gap-4 items-start">
                        <div className="mt-1 w-8 h-8 rounded-xl bg-amber/10 flex items-center justify-center text-amber shrink-0">
                            <Target className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Resultado de Aprendizaje</p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{plan.lessonObjective}</p>
                        </div>
                    </div>

                    {/* Video Link */}
                    <a 
                        href={plan.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50 hover:bg-royal/5 transition-all group/link border border-slate-100 hover:border-royal/20"
                    >
                        <div className="w-12 h-12 rounded-[1rem] bg-white text-red-500 shadow-sm flex items-center justify-center group-hover/link:scale-110 transition-transform">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recurso Audiovisual</p>
                            <p className="text-[12px] font-bold text-slate-800 truncate tracking-tight">{plan.videoTitle}</p>
                        </div>
                    </a>

                    {/* Question */}
                    <div className="p-6 rounded-[2rem] bg-royal/5 border border-royal/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 -mr-8 -mt-8 rotate-45"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <HelpCircle className="w-4 h-4 text-royal opacity-50" />
                            <span className="text-[10px] font-black text-royal uppercase tracking-widest">Laboratorio de Reflexión</span>
                        </div>
                        <p className="text-xs text-slate-700 font-bold italic leading-relaxed relative z-10">
                            {plan.question}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
