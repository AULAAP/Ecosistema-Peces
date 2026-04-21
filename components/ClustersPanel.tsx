import React, { useState } from 'react';
import { Users, Plus, Trash2, RotateCcw, ChevronRight, LayoutGrid } from 'lucide-react';
import type { Cluster } from '../types';

interface ClustersPanelProps {
    clusters: Cluster[];
    selectedClusterId?: number;
    onSelectCluster: (cluster: Cluster) => void;
    onAddCluster: (name: string) => void;
    onDeleteCluster: (id: number) => void;
    onResetClusterProgress: (id: number) => void;
    totalPlanCount: number;
    clusterProgressData: Record<number, Record<number, boolean>>;
}

const ClustersPanel: React.FC<ClustersPanelProps> = ({ 
    clusters, 
    selectedClusterId, 
    onSelectCluster, 
    onAddCluster, 
    onDeleteCluster, 
    onResetClusterProgress,
    totalPlanCount,
    clusterProgressData
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAddCluster(newName.trim());
            setNewName('');
            setIsAdding(false);
        }
    };

    const getClusterProgress = (clusterId: number) => {
        const progress = clusterProgressData[clusterId] || {};
        const completedCount = Object.keys(progress).length;
        return totalPlanCount > 0 ? (completedCount / totalPlanCount) * 100 : 0;
    };

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-royal/10 text-royal rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-royal/10">
                        Infraestructura Territorial
                    </div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-3 uppercase leading-none">Gestión de Clústers</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Estructura y supervisión de zonas pastorales</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-royal text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-royal/90 transition-all shadow-xl shadow-royal/20 active:scale-95 transform glossy-finish"
                >
                    <Plus className="w-5 h-5" /> Nuevo Clúster
                </button>
            </div>

            {isAdding && (
                <div className="mb-12 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 subtle-shadow glossy-finish">
                    <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow relative">
                             <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Nombre del nuevo clúster (Ej: Zona Norte)..."
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2-xl outline-none font-black uppercase tracking-widest text-xs text-slate-700 focus:ring-4 focus:ring-royal/5 focus:bg-white transition-all rounded-[1.5rem]"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="flex-grow md:flex-grow-0 px-10 py-5 bg-royal text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-royal/90 transition-all glossy-finish">Guardar</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {clusters.map((cluster) => {
                    const progress = getClusterProgress(cluster.id);
                    const isSelected = selectedClusterId === cluster.id;
                    
                    return (
                        <div key={cluster.id} className={`group relative bg-white rounded-[3rem] p-10 border transition-all duration-700 subtle-shadow glossy-finish ${isSelected ? 'border-royal shadow-2xl shadow-royal/10 scale-[1.02] z-10' : 'border-slate-100 hover:border-royal/30 hover:shadow-2xl hover:shadow-slate-100'}`}>
                            <div className="flex justify-between items-start mb-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-sm ${isSelected ? 'bg-royal text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-royal/5 group-hover:text-royal group-hover:-rotate-6'}`}>
                                    <LayoutGrid className="w-8 h-8" />
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onResetClusterProgress(cluster.id)}
                                        className="p-3 text-amber hover:bg-amber/10 rounded-xl transition-all hover:scale-110"
                                        title="Reiniciar Progreso"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteCluster(cluster.id)}
                                        className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                        title="Eliminar Clúster"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className={`text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 transition-colors ${isSelected ? 'text-royal' : 'group-hover:text-royal'}`}>{cluster.name}</h3>
                            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                                <Users className="w-4 h-4 text-royal opacity-50" /> {cluster.churchIds.length} Iglesias Vinculadas
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso de Formación</span>
                                    <span className={`text-base font-black ${isSelected ? 'text-royal' : 'text-slate-800'}`}>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out shadow-lg ${isSelected ? 'bg-royal' : 'bg-slate-400 group-hover:bg-royal'}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => onSelectCluster(cluster)}
                                className={`w-full mt-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all transform active:scale-95 ${isSelected ? 'bg-royal text-white shadow-xl shadow-royal/20 glossy-finish' : 'bg-slate-50 text-slate-500 hover:bg-royal/5 hover:text-royal hover:shadow-lg'}`}
                            >
                                Gestionar Iglesias <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {clusters.length === 0 && !isAdding && (
                <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LayoutGrid className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No hay clústers registrados</h3>
                    <p className="text-slate-400 mt-2 font-medium">Comienza creando tu primera zona pastoral</p>
                </div>
            )}
        </div>
    );
};

export default ClustersPanel;
