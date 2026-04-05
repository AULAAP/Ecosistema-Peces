import React, { useState } from 'react';
import { Church, Plus, Trash2, RotateCcw, Youtube, Info } from 'lucide-react';
import type { TrainingChurch, ContactStatus } from '../types';

interface ChurchesPanelProps {
    churches: TrainingChurch[];
    selectedChurchId?: number;
    onSelectChurch: (church: TrainingChurch) => void;
    onSelectClusterPlan: () => void;
    onAddChurch: (name: string) => void;
    onDeleteChurch: (churchId: number) => void;
    onResetChurchProgress: (churchId: number) => void;
    totalPlanCount: number;
    progressData: Record<number, Record<number, boolean>>;
}

const ChurchesPanel: React.FC<ChurchesPanelProps> = ({ 
    churches, 
    selectedChurchId, 
    onSelectChurch, 
    onSelectClusterPlan,
    onAddChurch, 
    onDeleteChurch, 
    onResetChurchProgress, 
    totalPlanCount, 
    progressData 
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAddChurch(newName.trim());
            setNewName('');
            setIsAdding(false);
        }
    };

    const getChurchProgress = (churchId: number) => {
        const churchProgress = progressData[churchId] || {};
        const completedCount = Object.keys(churchProgress).length;
        const percentage = totalPlanCount > 0 ? (completedCount / totalPlanCount) * 100 : 0;
        return { completed: completedCount, percentage };
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl p-10 border border-white/60 max-w-4xl mx-auto relative animate-in fade-in duration-700">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-slate-100 gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Iglesias del Clúster</h3>
                    <p className="text-slate-500 font-medium">Gestiona y monitorea cada congregación de la zona</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onSelectClusterPlan}
                        className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl hover:from-teal-400 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                        <Youtube className="w-4 h-4" />
                        Capacitación Grupal
                    </button>
                    {!isAdding && (
                         <button
                            onClick={() => setIsAdding(true)}
                            className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <Plus className="w-4 h-4 mr-2 inline" /> Nueva Iglesia
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-10 p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                    <Info className="w-6 h-6" />
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                    Usa <strong className="font-black">Capacitación Grupal</strong> para marcar lecciones que se imparten a todos los líderes de la zona al mismo tiempo. Esto actualizará el progreso de <span className="font-black underline">todas</span> las iglesias del clúster simultáneamente.
                </p>
            </div>

            {isAdding && (
                <div className="mb-10 p-8 bg-white rounded-[2.5rem] border border-indigo-100 shadow-xl animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <label className="block text-[10px] font-black text-indigo-900 uppercase tracking-widest ml-2">
                            Nombre de la Iglesia
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ej: Templo Betania"
                                className="flex-grow px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all"
                                required
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-grow px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all">Guardar</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {churches.map(church => {
                    const progress = getChurchProgress(church.id);
                    const isSelected = selectedChurchId === church.id;
                    
                    return (
                        <div key={church.id} className="flex items-center gap-4 group">
                            <button
                                onClick={() => onSelectChurch(church)}
                                className={`flex-grow text-left p-6 rounded-[2rem] transition-all duration-500 border flex items-center gap-6 relative overflow-hidden
                                    ${isSelected
                                        ? 'bg-gradient-to-r from-indigo-50 to-white border-indigo-200 shadow-2xl translate-x-2' 
                                        : 'bg-white/60 border-white/40 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:scale-[1.01] backdrop-blur-sm'
                                    }`
                                }
                            >
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />}
                                
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    <Church className="w-7 h-7" />
                                </div>
                                
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`font-black text-lg uppercase tracking-tight truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{church.name}</span>
                                        {isSelected && <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-[8px] font-black uppercase tracking-widest animate-pulse">Activa</span>}
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="flex-grow bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-200/50">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${progress.percentage === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-slate-500 w-10 text-right">
                                            {Math.round(progress.percentage)}%
                                        </span>
                                    </div>
                                </div>
                            </button>

                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button 
                                    onClick={() => onResetChurchProgress(church.id)}
                                    className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors shadow-sm border border-amber-100"
                                    title="Reiniciar Progreso"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => onDeleteChurch(church.id)}
                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm border border-red-100"
                                    title="Eliminar Iglesia"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {churches.length === 0 && !isAdding && (
                    <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Church className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">No hay iglesias en este clúster</h4>
                        <p className="text-slate-400 mt-2 font-medium">Comienza añadiendo la primera congregación</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChurchesPanel;
