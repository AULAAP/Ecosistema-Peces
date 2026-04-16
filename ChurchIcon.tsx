
import React from 'react';
import type { WeeklyPlan } from '../types';
import StatusIcon from './icons/StatusIcon';

interface MonitoringPanelProps {
    plans: WeeklyPlan[];
    onTopicSelect: (weekNumber: number) => void;
    onBack: () => void;
    churchName: string;
}

const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ plans, onTopicSelect, onBack, churchName }) => {
    const completedCount = plans.filter(p => p.isCompleted).length;
    const totalCount = plans.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/60 max-w-2xl mx-auto relative overflow-hidden ring-1 ring-black/5">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-70"></div>
            
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white rounded-full hover:bg-slate-50 transition-all border border-slate-200 shadow-sm z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Volver a Estudio
            </button>

            <div className="flex flex-col items-center mb-6">
                <h3 className="text-2xl font-bold font-sans text-slate-900 text-center">
                    Progreso: <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{churchName}</span>
                </h3>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-600">
                    <span>{completedCount} de {totalCount} Completadas</span>
                </div>
            </div>
            
            <div className="relative w-full h-4 bg-slate-200/50 rounded-full mb-8 shadow-inner overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                    style={{ width: `${progressPercentage}%` }}
                >
                    <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[spin_3s_linear_infinite]"></div>
                </div>
            </div>

            <div className="bg-white/50 rounded-2xl border border-white/50 p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                <h4 className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur-sm rounded-t-lg z-10 mb-1">Temas del Plan</h4>
                <ul className="space-y-1">
                    {plans.map(plan => (
                        <li key={plan.weekNumber}>
                            <button
                                onClick={() => onTopicSelect(plan.weekNumber)}
                                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group border border-transparent ${
                                    plan.isCompleted 
                                        ? 'bg-teal-50/50 text-slate-500' 
                                        : 'hover:bg-white hover:shadow-md hover:border-indigo-100 hover:scale-[1.01]'
                                }`}
                            >
                                <div className={`p-1.5 rounded-full ${plan.isCompleted ? 'bg-teal-100/50' : 'bg-white shadow-sm group-hover:text-indigo-500'}`}>
                                    <StatusIcon isCompleted={plan.isCompleted} className="h-4 w-4 flex-shrink-0" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className={`text-xs font-bold uppercase tracking-wide ${plan.isCompleted ? 'text-teal-600/70' : 'text-indigo-600/70 group-hover:text-indigo-600'}`}>Semana {plan.weekNumber}</span>
                                    <span className={`text-sm font-medium truncate ${plan.isCompleted ? 'line-through opacity-70' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                        {plan.topic}
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MonitoringPanel;
