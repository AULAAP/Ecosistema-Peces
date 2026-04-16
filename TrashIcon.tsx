
import React, { useState } from 'react';
import type { Church } from '../types';
import ChurchIcon from './icons/ChurchIcon';
import TrashIcon from './icons/TrashIcon';
import ResetIcon from './icons/ResetIcon';
import YouTubeIcon from './icons/YoutubeIcon';

interface ChurchesPanelProps {
    churches: Church[];
    selectedChurchId?: number;
    onSelectChurch: (church: Church) => void;
    onSelectClusterPlan: () => void;
    onAddChurch: (name: string) => void;
    onDeleteChurch: (churchId: number) => void;
    onResetChurchProgress: (churchId: number) => void;
    onBack: () => void;
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
    onBack,
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

    const getChurchProgress = (churchId: number): { completed: number; percentage: number } => {
        const churchProgress = progressData[churchId] || {};
        const completedCount = Object.keys(churchProgress).length;
        const percentage = totalPlanCount > 0 ? (completedCount / totalPlanCount) * 100 : 0;
        return { completed: completedCount, percentage: percentage };
    };

    const handleDelete = (e: React.MouseEvent, churchId: number, churchName: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que deseas eliminar la iglesia "${churchName}"? Esta acción no se puede deshacer.`)) {
            onDeleteChurch(churchId);
        }
    };

    const handleReset = (e: React.MouseEvent, churchId: number, churchName: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm(`¿Seguro que deseas reiniciar el progreso de "${churchName}" a 0%? Esta acción borrará todo el historial de esta iglesia.`)) {
            onResetChurchProgress(churchId);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/60 max-w-3xl mx-auto relative">
            
            <button 
                onClick={onBack}
                className="absolute -top-4 -left-4 flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white rounded-full hover:bg-slate-50 transition-all border border-slate-200 shadow-md z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Volver a Zonas
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-200/50 gap-4">
                <div>
                    <h3 className="text-2xl font-bold font-sans text-slate-900">Iglesias del Clúster</h3>
                    <p className="text-slate-500 text-sm">Gestiona y monitorea cada congregación</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={onSelectClusterPlan}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full hover:from-teal-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <YouTubeIcon className="w-4 h-4" />
                        Capacitación Grupal
                    </button>
                    {!isAdding && (
                         <button
                            onClick={() => setIsAdding(true)}
                            className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            + Nueva Iglesia
                        </button>
                    )}
                </div>
            </div>

            {/* Banner Informativo sobre Capacitación Grupal */}
            <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                    Usa <strong>Capacitación Grupal</strong> para marcar lecciones que se imparten a todos los líderes de la zona al mismo tiempo. Afectará el progreso de todas las iglesias listadas abajo.
                </p>
            </div>

            {isAdding && (
                <form onSubmit={handleAddSubmit} className="mb-8 p-6 bg-white/50 rounded-2xl border border-indigo-100 shadow-sm animate-fade-in-up">
                    <label htmlFor="church-name" className="block text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">
                        Nombre de la Iglesia
                    </label>
                    <input
                        id="church-name"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej: Templo Betania"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-800 placeholder-slate-400"
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsAdding(false)} 
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-transparent hover:bg-slate-100/50 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            )}

            {churches.length === 0 && !isAdding ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="bg-white p-3 rounded-full inline-block shadow-sm mb-3">
                         <ChurchIcon className="h-8 w-8 text-slate-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-700">Lista Vacía</h4>
                    <p className="text-slate-500 text-sm mt-1">Añade la primera iglesia para comenzar.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {churches.map(church => {
                        const progress = getChurchProgress(church.id);
                        const isSelected = selectedChurchId === church.id;
                        return (
                            <li key={church.id} className="list-none group">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => onSelectChurch(church)}
                                        className={`flex-grow text-left p-4 rounded-2xl transition-all duration-300 border flex items-center gap-4 relative overflow-hidden
                                            ${isSelected
                                                ? 'bg-gradient-to-r from-indigo-50/90 to-white/90 border-indigo-200 shadow-lg translate-x-1' 
                                                : 'bg-white/60 border-white/40 hover:bg-white/90 hover:border-indigo-100 hover:shadow-md hover:scale-[1.01] backdrop-blur-sm'
                                            }`
                                        }
                                    >
                                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                                        
                                        <div className={`p-3 rounded-full transition-all duration-300 shadow-sm ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-500'}`}>
                                            <ChurchIcon className="h-6 w-6 flex-shrink-0 pointer-events-none" />
                                        </div>
                                        
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <span className={`font-bold text-lg truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{church.name}</span>
                                                {isSelected && <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Seleccionada</span>}
                                            </div>
                                            
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex-grow bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-700 ${progress.percentage === 100 ? 'bg-teal-400' : 'bg-gradient-to-r from-indigo-400 to-purple-400'}`}
                                                        style={{ width: `${progress.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 w-12 text-right">
                                                    {Math.round(progress.percentage)}%
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Action Buttons */}
                                    <div 
                                        className="flex-shrink-0 flex flex-col gap-2 relative z-50 pl-2 border-l border-slate-200/50 ml-1"
                                        onClick={(e) => e.stopPropagation()} 
                                    >
                                        <button 
                                            type="button"
                                            onClick={(e) => handleReset(e, church.id, church.name)}
                                            title="Reiniciar Progreso"
                                            className="group/btn p-2.5 rounded-xl bg-white/80 text-slate-400 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300 shadow-sm border border-slate-100 transition-all cursor-pointer active:scale-95 pointer-events-auto"
                                        >
                                            <ResetIcon className="h-5 w-5 transition-transform group-hover/btn:rotate-180 duration-500 pointer-events-none" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => handleDelete(e, church.id, church.name)}
                                            title="Eliminar Iglesia"
                                            className="group/btn p-2.5 rounded-xl bg-white/80 text-slate-400 hover:bg-red-100 hover:text-red-700 hover:border-red-300 shadow-sm border border-slate-100 transition-all cursor-pointer active:scale-95 pointer-events-auto"
                                        >
                                            <TrashIcon className="h-5 w-5 transition-transform group-hover/btn:scale-110 pointer-events-none" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChurchesPanel;
