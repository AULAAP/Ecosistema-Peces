import React, { useEffect, useState, useRef } from 'react';
import type { Cluster, TrainingChurch } from '../types';
import { Download, TrendingUp, Award, Users, LayoutGrid } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface DashboardPanelProps {
    clusters: Cluster[];
    churches: TrainingChurch[];
    churchProgressData: Record<number, Record<number, boolean>>;
    clusterProgressData: Record<number, Record<number, boolean>>;
    totalPlanCount: number;
}

interface StatCardProps {
    title: string;
    value: number;
    suffix?: string;
    gradient: string;
    delay?: number;
    description?: React.ReactNode;
    icon: React.ReactNode;
}

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, suffix = '', gradient, delay = 0, description, icon }) => {
    const displayValue = useCountUp(value);
    
    return (
        <div 
            className={`bg-gradient-to-br ${gradient} backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/40 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between overflow-hidden relative group`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-600/80 text-[10px] font-black uppercase tracking-widest">{title}</p>
                    <div className="p-2 bg-white/50 rounded-xl text-slate-600">{icon}</div>
                </div>
                <div className="flex items-baseline">
                    <span className="text-5xl font-black text-slate-800 tracking-tighter drop-shadow-sm">{displayValue}</span>
                    <span className="text-xl font-bold text-slate-500 ml-1">{suffix}</span>
                </div>
            </div>
            {description && (
                <div className="mt-6 pt-6 border-t border-white/30 relative z-10">
                    <div className="text-xs text-slate-700 leading-tight font-medium">
                        {description}
                    </div>
                </div>
            )}
            
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    );
};

const DashboardPanel: React.FC<DashboardPanelProps> = ({ clusters, churches, churchProgressData, clusterProgressData, totalPlanCount }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);
    
    // --- Cálculos Estadísticos ---

    let totalCompletedLessons = 0;
    Object.values(churchProgressData).forEach(progress => {
        totalCompletedLessons += Object.keys(progress).length;
    });
    
    const totalPossibleLessons = churches.length * totalPlanCount;
    const globalProgressPercentage = totalPossibleLessons > 0 
        ? Math.round((totalCompletedLessons / totalPossibleLessons) * 100) 
        : 0;

    const churchPerformance = churches.map(church => {
        const progress = churchProgressData[church.id] || {};
        const count = Object.keys(progress).length;
        return { ...church, count, percentage: totalPlanCount > 0 ? (count / totalPlanCount) * 100 : 0 };
    }).sort((a, b) => b.count - a.count);

    const topChurch = churchPerformance[0];
    
    let topChurchContent: React.ReactNode = <span className="italic text-slate-400 text-[10px]">Sin datos suficientes</span>;
    
    if (topChurch && topChurch.count > 0) {
        const belongingCluster = clusters.find(c => c.churchIds.includes(topChurch.id));
        const clusterName = belongingCluster ? belongingCluster.name : "Sin Clúster";
        
        topChurchContent = (
            <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 break-words" title={topChurch.name}>{topChurch.name}</span>
                <div className="flex items-center flex-wrap gap-1 mt-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-white/40 text-[9px] font-black text-slate-500 uppercase border border-white/30">Cluster</span>
                    <span className="text-[10px] font-bold text-indigo-600 break-words" title={clusterName}>
                        {clusterName}
                    </span>
                </div>
            </div>
        );
    }

    const clusterPerformance = clusters.map(cluster => {
        const leaderProgress = clusterProgressData[cluster.id] || {};
        const leaderCount = Object.keys(leaderProgress).length;
        const leaderPercentage = totalPlanCount > 0 ? (leaderCount / totalPlanCount) * 100 : 0;

        let clusterChurchesTotal = 0;
        const clusterChurches = churches.filter(c => cluster.churchIds.includes(c.id));
        
        clusterChurches.forEach(c => {
            const p = churchProgressData[c.id] || {};
            clusterChurchesTotal += Object.keys(p).length;
        });
        
        const churchesPossible = clusterChurches.length * totalPlanCount;
        const churchesAvgPercentage = churchesPossible > 0 
            ? (clusterChurchesTotal / churchesPossible) * 100 
            : 0;

        return { 
            ...cluster, 
            leaderPercentage, 
            churchesAvgPercentage,
            churchCount: clusterChurches.length
        };
    });

    const handleDownloadPDF = async () => {
        if (!dashboardRef.current) return;
        
        setIsGeneratingPdf(true);
        dashboardRef.current.classList.add('is-generating-pdf');
        
        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                backgroundColor: '#f8fafc',
                useCORS: true,
                logging: false,
                windowWidth: dashboardRef.current.scrollWidth,
                windowHeight: dashboardRef.current.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            const margin = 10;
            const availableWidth = pdfWidth - (margin * 2);
            const ratio = availableWidth / imgWidth;
            
            const finalWidth = availableWidth;
            const finalHeight = imgHeight * ratio;
            
            let heightLeft = finalHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, finalWidth, finalHeight);
            heightLeft -= (pdfHeight - margin * 2);

            while (heightLeft > 0) {
                position = heightLeft - finalHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, finalWidth, finalHeight);
                heightLeft -= pdfHeight;
            }
            
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            pdf.save(`reporte-ecosistema-peces-${date}.pdf`);
            
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error al generar el PDF.");
        } finally {
            if (dashboardRef.current) {
                dashboardRef.current.classList.remove('is-generating-pdf');
            }
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Reporte General</h2>
                    <p className="text-slate-500 mt-2 font-medium">Métricas de avance ministerial en tiempo real</p>
                </div>
                
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all
                        ${isGeneratingPdf 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1 shadow-slate-900/20 active:scale-95'
                        }`}
                >
                    {isGeneratingPdf ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                            <span>Generando PDF...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            <span>Descargar Reporte Completo</span>
                        </>
                    )}
                </button>
            </div>

            <div ref={dashboardRef} className="space-y-8 p-4 rounded-[3rem] transition-all">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Clústers" 
                        value={clusters.length} 
                        gradient="from-white to-indigo-50/50" 
                        icon={<LayoutGrid className="w-5 h-5" />}
                    />
                    <StatCard 
                        title="Total Iglesias" 
                        value={churches.length} 
                        gradient="from-white to-sky-50/50" 
                        delay={100} 
                        icon={<Users className="w-5 h-5" />}
                    />
                    <StatCard 
                        title="Avance Global" 
                        value={globalProgressPercentage} 
                        suffix="%" 
                        gradient="from-white to-emerald-50/50" 
                        delay={200} 
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                    <StatCard 
                        title="Iglesia Destacada" 
                        value={topChurch ? Math.round(topChurch.percentage) : 0} 
                        suffix="%" 
                        gradient="from-white to-amber-50/50" 
                        delay={300} 
                        description={topChurchContent}
                        icon={<Award className="w-5 h-5" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Rendimiento por Zona */}
                    <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl p-10 border border-white/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-slate-100 pb-6 gap-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Rendimiento por Zona</h3>
                                <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Comparativa: Líder vs Promedio Iglesias</p>
                            </div>
                            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200"></span> Líder</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-sky-400 shadow-lg shadow-sky-200"></span> Iglesias</div>
                            </div>
                        </div>
                        
                        <div className="space-y-10">
                            {clusterPerformance.map((cluster) => (
                                <div key={cluster.id} className="group">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-black text-slate-700 text-sm uppercase tracking-tight">{cluster.name}</span>
                                        <span className="text-[10px] font-black text-slate-400 bg-white/60 px-3 py-1 rounded-xl border border-white/50">{cluster.churchCount} Iglesias</span>
                                    </div>
                                    <div className="relative h-10 w-full bg-slate-100/50 rounded-2xl overflow-hidden shadow-inner border border-slate-200/50">
                                        <div 
                                            className="absolute top-0 left-0 h-full bg-sky-400/80 backdrop-blur-sm transition-all duration-1000 ease-out flex items-center justify-end px-4"
                                            style={{ width: `${Math.max(5, cluster.churchesAvgPercentage)}%` }}
                                        >
                                            {cluster.churchesAvgPercentage > 15 && <span className="text-[10px] font-black text-white">{Math.round(cluster.churchesAvgPercentage)}%</span>}
                                        </div>
                                        <div 
                                            className="absolute top-1.5 bottom-1.5 left-1.5 h-auto bg-indigo-600 rounded-xl shadow-xl transition-all duration-1000 ease-out flex items-center justify-end px-4 border border-white/20"
                                            style={{ width: `${Math.max(5, cluster.leaderPercentage)}%` }}
                                        >
                                            {cluster.leaderPercentage > 15 && <span className="text-[10px] font-black text-white">{Math.round(cluster.leaderPercentage)}%</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {clusterPerformance.length === 0 && <div className="text-center text-slate-400 py-20 font-bold uppercase tracking-widest text-xs">No hay datos disponibles</div>}
                        </div>
                    </div>

                    {/* Ranking Iglesias */}
                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-xl p-10 border border-white/50 flex flex-col">
                        <h3 className="text-xl font-black text-slate-800 mb-8 pb-6 border-b border-slate-100 uppercase tracking-tighter">Ranking Iglesias</h3>
                        <div className="flex-grow overflow-y-auto max-h-[500px] pr-4 space-y-4 custom-scrollbar">
                            {churchPerformance.map((church, index) => {
                                const cluster = clusters.find(c => c.churchIds.includes(church.id));
                                
                                return (
                                    <div key={church.id} className="flex items-center gap-4 p-4 rounded-3xl bg-white/40 hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-white/60 hover:shadow-lg group">
                                        <div className={`
                                            w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl font-black text-xs shadow-sm
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white ring-4 ring-yellow-100' : 
                                            index === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-white' : 
                                            index === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-white' : 'bg-slate-100 text-slate-400'}\n                                        `}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-black text-sm text-slate-800 group-hover:text-indigo-700 transition-colors leading-tight break-words">{church.name}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{cluster ? cluster.name : 'Sin Clúster'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="block text-base font-black text-indigo-600">{Math.round(church.percentage)}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {churchPerformance.length === 0 && (
                                <div className="text-center text-slate-400 italic py-20 font-bold uppercase tracking-widest text-xs">Lista vacía</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPanel;
