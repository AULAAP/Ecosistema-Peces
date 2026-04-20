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
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Gestión de Clústers</h2>
                    <p className="text-slate-500 font-medium">Organiza y supervisa el avance de tus zonas pastorales</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
                >
                    <Plus className="w-5 h-5" /> Nuevo Clúster
                </button>
            </div>

            {isAdding && (
                <div className="mb-12 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-indigo-100 animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nombre del nuevo clúster..."
                            className="flex-grow px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-grow md:flex-grow-0 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all">Guardar</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clusters.map((cluster) => {
                    const progress = getClusterProgress(cluster.id);
                    const isSelected = selectedClusterId === cluster.id;
                    
                    return (
                        <div key={cluster.id} className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-500 ${isSelected ? 'border-indigo-500 shadow-2xl shadow-indigo-100 scale-[1.02]' : 'border-slate-100 shadow-xl hover:shadow-2xl hover:border-indigo-200'}`}>
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    <LayoutGrid className="w-7 h-7" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onResetClusterProgress(cluster.id)}
                                        className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                                        title="Reiniciar Progreso"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteCluster(cluster.id)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                        title="Eliminar Clúster"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">{cluster.name}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
                                <Users className="w-3 h-3" /> {cluster.churchIds.length} Iglesias Vinculadas
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso del Líder</span>
                                    <span className="text-sm font-black text-indigo-600">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                    <div 
                                        className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => onSelectCluster(cluster)}
                                className={`w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
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
