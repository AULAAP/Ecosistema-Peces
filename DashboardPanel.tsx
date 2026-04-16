import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Target, HelpCircle } from 'lucide-react';
import type { WeeklyPlan } from '../types';

interface TopicCardProps {
    plan: WeeklyPlan;
    onToggleComplete: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ plan, onToggleComplete }) => {
    return (
        <div className={`group relative bg-white/70 backdrop-blur-md rounded-3xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${plan.isCompleted ? 'border-emerald-200 shadow-emerald-100/50' : 'border-white/50 shadow-xl shadow-slate-200/50'}`}>
            
            {/* Status Badge */}
            <div className="absolute -top-3 -right-3 z-10">
                <button 
                    onClick={onToggleComplete}
                    className={`flex items-center justify-center w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 active:scale-90 ${plan.isCompleted ? 'bg-emerald-500 text-white rotate-0' : 'bg-white text-slate-300 hover:text-indigo-500 rotate-12 group-hover:rotate-0'}`}
                >
                    {plan.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
                        Semana {plan.weekNumber}
                    </span>
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                        {plan.topic}
                    </h3>
                </div>

                <div className="space-y-4 flex-grow">
                    {/* Objective */}
                    <div className="flex gap-3 items-start">
                        <div className="mt-1 p-1.5 rounded-lg bg-amber-50 text-amber-600">
                            <Target className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objetivo</p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{plan.lessonObjective}</p>
                        </div>
                    </div>

                    {/* Video Link */}
                    <a 
                        href={plan.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group/link"
                    >
                        <div className="p-2 rounded-xl bg-white text-red-500 shadow-sm group-hover/link:scale-110 transition-transform">
                            <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Video Sugerido</p>
                            <p className="text-[11px] font-bold text-slate-700 truncate">{plan.videoTitle}</p>
                        </div>
                    </a>

                    {/* Question */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                        <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Pregunta de Reflexión</span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold italic leading-relaxed">
                            "{plan.question}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
