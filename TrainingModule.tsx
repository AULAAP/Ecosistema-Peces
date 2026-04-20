import React from 'react';
import { CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';
import type { WeeklyPlan } from '../types';

interface MonitoringPanelProps {
    plans: WeeklyPlan[];
    onTopicSelect: (weekNumber: number) => void;
    churchName: string;
}

const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ plans, onTopicSelect, churchName }) => {
    const completedCount = plans.filter(p => p.isCompleted).length;
    const totalCount = plans.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/60 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                            <TrendingUp className="w-3 h-3" /> Monitoreo de Avance
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{churchName}</h2>
                        <p className="text-slate-500 font-medium">Seguimiento detallado de la ruta de aprendizaje</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-5xl font-black text-indigo-600 tracking-tighter mb-1">{percentage}%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completado</div>
                        </div>
                        <div className="w-px h-16 bg-slate-100 hidden md:block" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-800 tracking-tight mb-1">{completedCount}/{totalCount}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lecciones</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-10 relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Timeline List */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Cronograma de Actividades</h3>
                    <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div className="divide-y divide-slate-100">
                    {plans.map((plan) => (
                        <button
                            key={plan.weekNumber}
                            onClick={() => onTopicSelect(plan.weekNumber)}
                            className="w-full flex items-center gap-6 p-6 hover:bg-white transition-all duration-300 group text-left"
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${plan.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                {plan.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>
                            
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semana {plan.weekNumber}</span>
                                    {plan.isCompleted && <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-tighter">Finalizada</span>}
                                </div>
                                <h4 className={`font-bold text-base truncate transition-colors ${plan.isCompleted ? 'text-slate-500 line-through' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                                    {plan.topic}
                                </h4>
                            </div>

                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-300">
                                <div className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-200">
                                    Ver Detalles
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonitoringPanel;
