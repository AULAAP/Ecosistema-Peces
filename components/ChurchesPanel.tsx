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
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-12 max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-6 duration-700 subtle-shadow glossy-finish">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-10 border-b border-slate-50 gap-8">
                <div>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none mb-2">Iglesias del Clúster</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gestión dinámica de congregaciones locales</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={onSelectClusterPlan}
                        className="flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-[0.1em] text-white bg-sea rounded-[1.25rem] hover:bg-sea/90 transition-all shadow-xl shadow-sea/20 active:scale-95 glossy-finish"
                    >
                        <Youtube className="w-5 h-5" />
                        Capacitación Grupal
                    </button>
                    {!isAdding && (
                         <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-[0.1em] text-slate-800 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 transition-all shadow-sm active:scale-95 subtle-shadow"
                        >
                            <Plus className="w-5 h-5 text-royal" /> Nueva Iglesia
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-12 p-8 bg-royal/5 border border-royal/10 rounded-[2.5rem] flex items-start gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-royal/10 blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white p-4 rounded-2xl text-royal shadow-sm relative z-10 shrink-0">
                    <Info className="w-7 h-7" />
                </div>
                <div className="relative z-10">
                    <p className="text-[11px] text-royal font-black uppercase tracking-widest mb-2">Protocolo de sincronización</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        La <strong className="text-slate-900">Capacitación Grupal</strong> permite registrar hitos pedagógicos simultáneos. Al certificar una lección aquí, el progreso se replicará en <span className="font-black text-royal decoration-royal/30">todas las iglesias</span> del clúster automáticamente.
                    </p>
                </div>
            </div>

            {isAdding && (
                <div className="mb-12 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-500 subtle-shadow glossy-finish">
                    <form onSubmit={handleAddSubmit} className="space-y-6">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                            Identificación de la Congregación
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Nombre comercial de la iglesia..."
                                className="flex-grow px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black uppercase tracking-widest text-xs text-slate-700 focus:ring-4 focus:ring-royal/5 focus:bg-white transition-all shadow-inner"
                                required
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button type="submit" className="flex-grow px-10 py-5 bg-royal text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-royal/90 transition-all glossy-finish">Guardar</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {churches.map(church => {
                    const progress = getChurchProgress(church.id);
                    const isSelected = selectedChurchId === church.id;
                    
                    return (
                        <div key={church.id} className="flex items-center gap-6 group">
                            <button
                                onClick={() => onSelectChurch(church)}
                                className={`flex-grow text-left p-8 rounded-[3rem] transition-all duration-700 border flex items-center gap-8 relative overflow-hidden subtle-shadow
                                    ${isSelected
                                        ? 'bg-white border-royal shadow-2xl shadow-royal/10 translate-x-4 ring-2 ring-royal/5' 
                                        : 'bg-white border-slate-100 hover:border-royal/30 hover:shadow-xl hover:scale-[1.01] glossy-finish'
                                    }`
                                }
                            >
                                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-2 bg-royal glossy-finish" />}
                                
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-sm ${isSelected ? 'bg-royal text-white rotate-6' : 'bg-slate-50 text-slate-300 group-hover:bg-royal/10 group-hover:text-royal'}`}>
                                    <Church className="w-8 h-8" />
                                </div>
                                
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-black text-xl uppercase tracking-tighter truncate ${isSelected ? 'text-royal' : 'text-slate-800'}`}>{church.name}</span>
                                            {progress.percentage === 100 && <div className="w-5 h-5 bg-sea/10 rounded-full flex items-center justify-center"><RotateCcw className="w-3 h-3 text-sea" /></div>}
                                        </div>
                                        {isSelected && <span className="px-4 py-1.5 rounded-xl bg-royal/10 text-royal text-[9px] font-black uppercase tracking-[0.2em] animate-pulse border border-royal/10 shadow-sm">PANEL ACTIVO</span>}
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="flex-grow bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner border border-slate-50">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${progress.percentage === 100 ? 'bg-sea shadow-lg shadow-sea/20' : 'bg-royal shadow-md shadow-royal/20'} glossy-finish`}
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                        <span className={`text-[12px] font-black w-12 text-right tracking-tighter ${isSelected ? 'text-royal' : 'text-slate-400'}`}>
                                            {Math.round(progress.percentage)}%
                                        </span>
                                    </div>
                                </div>
                            </button>

                            <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                <button 
                                    onClick={() => onResetChurchProgress(church.id)}
                                    className="p-4 bg-white text-amber border border-slate-100 rounded-[1.25rem] hover:bg-amber hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                                    title="Reiniciar Progreso"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => onDeleteChurch(church.id)}
                                    className="p-4 bg-white text-red-400 border border-slate-100 rounded-[1.25rem] hover:bg-red-400 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                                    title="Eliminar Iglesia"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {churches.length === 0 && !isAdding && (
                    <div className="text-center py-24 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm text-slate-200">
                            <Church className="w-12 h-12" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Sin congregaciones locales</h4>
                        <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-[10px]">Crea la primera unidad operativa para este clúster</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChurchesPanel;
