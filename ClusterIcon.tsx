
import React, { useState } from 'react';
import type { Cluster } from '../types';
import ClusterIcon from './icons/ClusterIcon';
import TrashIcon from './icons/TrashIcon';
import ResetIcon from './icons/ResetIcon';

interface ClustersPanelProps {
    clusters: Cluster[];
    selectedClusterId?: number;
    onSelectCluster: (cluster: Cluster) => void;
    onAddCluster: (name: string) => void;
    onDeleteCluster: (clusterId: number) => void;
    onResetClusterProgress: (clusterId: number) => void;
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

    const handleDelete = (e: React.MouseEvent, clusterId: number, clusterName: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`¿Estás seguro de que quieres eliminar el clúster "${clusterName}"? Esto también eliminará todas las iglesias dentro de él.`)) {
            onDeleteCluster(clusterId);
        }
    };

    const handleReset = (e: React.MouseEvent, clusterId: number, clusterName: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm(`¿Seguro que deseas reiniciar el progreso del clúster "${clusterName}" y de TODAS sus iglesias? Esta acción borrará el historial de capacitación en toda la zona.`)) {
            onResetClusterProgress(clusterId);
        }
    };
    
    const getClusterProgress = (clusterId: number): { completed: number; percentage: number } => {
        const progress = clusterProgressData[clusterId] || {};
        const completedCount = Object.keys(progress).length;
        const percentage = totalPlanCount > 0 ? (completedCount / totalPlanCount) * 100 : 0;
        return { completed: completedCount, percentage: percentage };
    };

    return (
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl p-8 border border-white/40 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4 border-b border-white/30 pb-6">
                <div className="text-center sm:text-left">
                    <h3 className="text-3xl font-black font-sans text-slate-800 tracking-tight">Zonas de Ministerio</h3>
                    <p className="text-slate-600 font-medium mt-1">Organiza tus iglesias en clústers</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
                    >
                        <span className="text-lg leading-none mb-0.5">+</span> Crear Nuevo Clúster
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleAddSubmit} className="mb-10 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-lg animate-fade-in-up">
                    <label htmlFor="cluster-name" className="block text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3">
                        Nombre del Nuevo Clúster
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            id="cluster-name"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Ej: Zona Norte"
                            className="flex-grow px-5 py-3 bg-white/80 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-lg"
                            required
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button 
                                type="button" 
                                onClick={() => setIsAdding(false)} 
                                className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-slate-600 bg-transparent border border-slate-300/50 rounded-xl hover:bg-white/50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {clusters.length === 0 && !isAdding ? (
                <div className="text-center py-20 bg-white/30 rounded-[2rem] border-2 border-dashed border-white/50">
                    <div className="bg-white/50 p-5 rounded-full inline-block shadow-sm mb-4 backdrop-blur-sm">
                        <ClusterIcon className="h-12 w-12 text-slate-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-700">Comienza Aquí</h4>
                    <p className="text-slate-500 mt-2">Crea tu primer clúster para agrupar iglesias.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {clusters.map(cluster => {
                        const isSelected = selectedClusterId === cluster.id;
                        const churchCount = cluster.churchIds.length;
                        const progress = getClusterProgress(cluster.id);
                        
                        return (
                            <div key={cluster.id} className="relative group h-full">
                                <button
                                    onClick={() => onSelectCluster(cluster)}
                                    className={`w-full h-full flex flex-col items-center text-center p-6 rounded-[2rem] transition-all duration-300 border relative overflow-hidden
                                        ${isSelected
                                            ? 'bg-gradient-to-b from-indigo-50/90 to-white/90 border-indigo-400 shadow-xl scale-[1.03] ring-4 ring-indigo-100/50' 
                                            : 'bg-gradient-to-br from-white/80 to-white/40 border-white/60 hover:border-white hover:bg-white/90 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm'
                                        }`
                                    }
                                >
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl transition-opacity duration-500 ${isSelected ? 'bg-indigo-300/30 opacity-100' : 'bg-sky-200/20 opacity-0 group-hover:opacity-100'}`}></div>
                                    
                                    <div className={`relative p-4 rounded-2xl mb-4 transition-all duration-500 shadow-sm ${isSelected ? 'bg-indigo-500 text-white rotate-3' : 'bg-white text-slate-400 group-hover:text-indigo-500 group-hover:scale-110'}`}>
                                        <ClusterIcon className="h-10 w-10 pointer-events-none" />
                                    </div>
                                    
                                    <span className={`relative font-bold text-xl mb-1 line-clamp-1 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                                        {cluster.name}
                                    </span>
                                    
                                    <span className="relative inline-block px-3 py-1 rounded-full bg-slate-100/50 text-xs font-semibold text-slate-500 mb-6 border border-slate-200/50">
                                        {churchCount} {churchCount === 1 ? 'Iglesia' : 'Iglesias'}
                                    </span>

                                    <div className="relative w-full mt-auto bg-slate-100/80 rounded-full h-3 p-0.5 shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${progress.percentage === 100 ? 'bg-teal-400' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                                            style={{ width: `${Math.max(5, progress.percentage)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{Math.round(progress.percentage)}% Completado</span>
                                </button>

                                {/* Action buttons overlay - visible on hover */}
                                <div className="absolute top-4 right-4 flex gap-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <button 
                                        type="button"
                                        onClick={(e) => handleReset(e, cluster.id, cluster.name)}
                                        title="Reiniciar progreso"
                                        className="p-2 rounded-full bg-white/90 shadow-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 hover:scale-110 transition-all border border-white/50 cursor-pointer pointer-events-auto"
                                    >
                                        <ResetIcon className="h-4 w-4 pointer-events-none" />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDelete(e, cluster.id, cluster.name)}
                                        title="Eliminar clúster"
                                        className="p-2 rounded-full bg-white/90 shadow-lg text-slate-400 hover:text-red-700 hover:bg-red-50 hover:scale-110 transition-all border border-white/50 cursor-pointer pointer-events-auto"
                                    >
                                        <TrashIcon className="h-4 w-4 pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClustersPanel;
