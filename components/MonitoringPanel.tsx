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
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Header Stats */}
            <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden subtle-shadow glossy-finish">
                <div className="absolute top-0 right-0 w-80 h-80 bg-royal/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sea/10 text-sea text-[10px] font-black uppercase tracking-widest mb-6 border border-sea/10">
                            <TrendingUp className="w-3.5 h-3.5" /> MÉTRICAS DE FORMACIÓN
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2 uppercase leading-none">{churchName}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Supervisión integral de la ruta académica</p>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <div className="text-6xl font-black text-royal tracking-tighter mb-1 animate-in fade-in duration-1000 slide-in-from-right-4">{percentage}%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Graduación</div>
                        </div>
                        <div className="w-px h-20 bg-slate-100 hidden md:block" />
                        <div className="text-center">
                            <div className="text-4xl font-black text-slate-800 tracking-tight mb-1">{completedCount}/{totalCount}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Créditos</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-12 relative h-5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <div 
                        className="absolute top-0 left-0 h-full bg-royal transition-all duration-1000 ease-out shadow-lg shadow-royal/20 glossy-finish"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Timeline List */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden subtle-shadow glossy-finish">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Currículum Académico</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hitos semestrales completados</p>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
                <div className="divide-y divide-slate-50/50">
                    {plans.map((plan) => (
                        <button
                            key={plan.weekNumber}
                            onClick={() => onTopicSelect(plan.weekNumber)}
                            className="w-full flex items-center gap-8 p-8 hover:bg-royal/[0.01] transition-all duration-300 group text-left relative"
                        >
                            <div className={`flex-shrink-0 w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-sm ${plan.isCompleted ? 'bg-sea/10 text-sea' : 'bg-slate-50 text-slate-300 group-hover:bg-royal/5 group-hover:text-royal'}`}>
                                {plan.isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7 opacity-20" />}
                            </div>
                            
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Semana {plan.weekNumber.toString().padStart(2, '0')}</span>
                                    {plan.isCompleted && <span className="px-3 py-1 rounded-lg bg-sea/10 text-sea text-[9px] font-black uppercase tracking-[0.1em] border border-sea/10 shadow-sm">Certificado</span>}
                                </div>
                                <h4 className={`font-black text-xl tracking-tight transition-colors ${plan.isCompleted ? 'text-slate-400 line-through opacity-70' : 'text-slate-800 group-hover:text-royal'}`}>
                                    {plan.topic}
                                </h4>
                            </div>

                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-6 group-hover:translate-x-0 transition-all duration-500">
                                <div className="px-6 py-3 bg-royal text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] shadow-xl shadow-royal/20 glossy-finish">
                                    ACCEDER MODULO
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
